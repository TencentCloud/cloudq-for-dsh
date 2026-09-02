/**
 * dsh-cloudq host half.
 *
 * Registers the CloudQ skill (a multi-cloud AIOps expert driven by the Tencent
 * Cloud SSE conversation API) so that entering "CloudQ mode" routes the model
 * through the bundled skill. The skill body is shipped under `skills/cloudq/`
 * and referenced through a directory `resourceBase`, so every `{baseDir}`
 * placeholder in the body resolves against the installed package directory.
 *
 * It also exposes a small credential-management API (status / AK-SK test &
 * save / logout) that the client half renders in the settings panel, so the
 * CloudQ credential flow no longer requires touching a terminal.
 *
 * @module dsh-cloudq
 */

import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { get as httpsGet } from 'node:https'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Schema from '@deepseek-ai/schemastery'
import {
  HttpError,
  assertSafeRequest,
  readJsonBody,
  sendError,
  sendJson,
} from './http.js'
import { listPlugins, setPluginDisabled } from './plugin-manager.js'
import {
  callTcloudApi,
  credentialStatus as readCredentialStatus,
  deleteCredential,
  maskSecretId,
  saveCredential,
} from './tcloud.js'

const LOGO_PATH = resolve(dirname(fileURLToPath(import.meta.url)), '../assets/cloudq.png')
const LOGO_BUFFER = readFileSync(LOGO_PATH)

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Installed skill directory (SKILL.md + scripts/ + references/). */
function skillDirectory() {
  return resolve(__dirname, '../skills/cloudq')
}

// ---------------------------------------------------------------------------
// Self version check & update
// ---------------------------------------------------------------------------

/** This plugin's own version, read from the installed package manifest. */
const PACKAGE_VERSION = (() => {
  try {
    return JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'))?.version ?? '0.0.0'
  } catch {
    return '0.0.0'
  }
})()

/**
 * Profile directory holding this plugin (`<profile>/node_modules/dsh-cloudq`).
 * Both src/ (dev) and lib/ (packed) sit one level under the package root.
 */
function profileDirectory() {
  return resolve(__dirname, '../../..')
}

/** Fetch the latest published version from the npm registry (best effort). */
function fetchLatestPackageVersion() {
  return new Promise((resolvePromise) => {
    const request = httpsGet('https://registry.npmjs.org/dsh-cloudq/latest', { timeout: 8000 }, (res) => {
      if (res.statusCode !== 200) {
        res.resume()
        resolvePromise(null)
        return
      }
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
        if (body.length > 64 * 1024) request.destroy()
      })
      res.on('end', () => {
        try {
          resolvePromise(JSON.parse(body)?.version ?? null)
        } catch {
          resolvePromise(null)
        }
      })
    })
    request.on('error', () => resolvePromise(null))
    request.on('timeout', () => {
      request.destroy()
      resolvePromise(null)
    })
  })
}

// Registry answers are cached for ten minutes so every page load costs at
// most a local read; the TTL only trades a few minutes of badge staleness.
let latestVersionCache = { at: 0, version: null }
async function latestPackageVersion() {
  if (latestVersionCache.version && Date.now() - latestVersionCache.at < 10 * 60 * 1000) {
    return latestVersionCache.version
  }
  const version = await fetchLatestPackageVersion()
  if (version) latestVersionCache = { at: Date.now(), version }
  return version
}

/** Semver-ish compare: is `latest` strictly newer than `current`? */
function isNewerVersion(latest, current) {
  const parse = (value) => String(value).split('.').map((part) => parseInt(part, 10) || 0)
  const next = parse(latest)
  const now = parse(current)
  for (let index = 0; index < 3; index += 1) {
    if (next[index] !== now[index]) return next[index] > now[index]
  }
  return false
}

const UPDATE_TIMEOUT_MS = 120_000

/** Install the latest published plugin version into the active profile. */
function runProfileUpdate() {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn('pnpm', ['add', 'dsh-cloudq@latest', '--registry=https://registry.npmjs.org/'], {
      cwd: profileDirectory(),
    })
    let output = ''
    const collect = (chunk) => {
      output += chunk
      if (output.length > 64 * 1024) child.kill()
    }
    child.stdout.on('data', collect)
    child.stderr.on('data', collect)
    const timer = setTimeout(() => {
      child.kill()
      rejectRun(new HttpError(504, 'update-timeout', '更新超时，请检查网络后重试。'))
    }, UPDATE_TIMEOUT_MS)
    child.on('error', () => {
      clearTimeout(timer)
      rejectRun(new HttpError(502, 'update-failed', '无法启动 pnpm，请在终端手动执行：dsh plugin --profile web add dsh-cloudq'))
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      if (code === 0) {
        resolveRun()
      } else {
        rejectRun(new HttpError(502, 'update-failed', `更新失败：${output.trim().slice(-200) || 'pnpm 执行异常'}`))
      }
    })
  })
}

/**
 * Restart the DSH host after an update. A detached watcher respawns the same
 * command line the moment this process exits; there is no supervisor, so the
 * plugin exits itself once the watcher is armed.
 */
function scheduleSelfRestart() {
  if (process.platform === 'win32') {
    throw new HttpError(501, 'restart-unsupported', '当前系统不支持自动重启，请手动重启 DSH 服务。')
  }
  const quote = (value) => `'${String(value).replaceAll("'", "'\\''")}'`
  const pid = process.pid
  const command = [
    `while kill -0 ${pid} 2>/dev/null; do sleep 0.5; done`,
    'sleep 1',
    `cd ${quote(process.cwd())} && nohup ${quote(process.argv[0])} ${process.argv.slice(1).map(quote).join(' ')} >> /tmp/dsh-cloudq-restart.log 2>&1 &`,
  ].join('; ')
  const watcher = spawn('/bin/sh', ['-c', command], { detached: true, stdio: 'ignore' })
  watcher.unref()
  setTimeout(() => process.exit(0), 300).unref()
}

/** Raw SKILL.md body. */
function rawSkillContent() {
  return readFileSync(resolve(skillDirectory(), 'SKILL.md'), 'utf8')
}

/**
 * Render the skill body with `{baseDir}` substituted by the installed skill
 * directory. The model then runs `python3 <absolute path>/scripts/...`
 * directly, without having to infer the base directory from the rendered
 * `<skill_resources>` block.
 */
function renderedSkillContent() {
  const baseDir = skillDirectory()
  return rawSkillContent().replace(/\{baseDir\}/g, baseDir)
}

// ---------------------------------------------------------------------------
// CloudQ API bridge — pure Node (same approach as dsh-cos: the host process
// IS Node, so no external runtime is ever required). The advisor APIs have
// no lightweight standalone SDK, so TC3 signing is implemented in tcloud.js.
// ---------------------------------------------------------------------------

/** Map upstream TC error codes to stable, actionable client-facing errors. */
function normalizeApiError(error) {
  if (error instanceof HttpError) {
    if (error.code === 'NeedAuth') throw error
    if (typeof error.code === 'string' && error.code.startsWith('AuthFailure')) {
      throw new HttpError(401, 'AuthFailure', 'AK/SK 无效或权限不足，请前往「设置 → 插件 → CloudQ」检查配置。')
    }
  }
  throw error
}

/** Wrap one API call with the credential-error mapping. */
async function callCloudq(spec) {
  try {
    return { data: await callTcloudApi(spec) }
  } catch (error) {
    normalizeApiError(error)
    throw error
  }
}

/** Credential state for the settings UI (never exposes the SecretKey). */
function credentialStatus() {
  return readCredentialStatus()
}

function logout() {
  deleteCredential()
  return { message: '已退出登录。' }
}

/**
 * Validate a long-lived Tencent Cloud AK/SK pair without persisting it.
 * DescribeCloudQUsageOverview is read-only, parameterless, and CloudQ's own
 * API — a successful call proves both the key and the CloudQ enrollment.
 */
async function testAccessKey(secretId, secretKey) {
  try {
    await callTcloudApi(
      { service: 'advisor', host: 'advisor.tencentcloudapi.com', action: 'DescribeCloudQUsageOverview', version: '2020-07-21' },
      { secretId, secretKey, token: '' },
    )
    return { valid: true, secret_id_masked: maskSecretId(secretId) }
  } catch (error) {
    normalizeApiError(error)
    throw error
  }
}

/** Validate then persist a long-lived AK/SK pair as `type:"ak"`. */
async function saveAccessKey(secretId, secretKey) {
  await testAccessKey(secretId, secretKey)
  saveCredential(secretId, secretKey)
  return readCredentialStatus()
}

// CloudQ usage / inspiration data. `payload` must NOT include `Version` —
// it travels in the TC3 header.
function cloudqUsageOverview() {
  return callCloudq({ service: 'advisor', host: 'advisor.tencentcloudapi.com', action: 'DescribeCloudQUsageOverview', version: '2020-07-21' })
}

function cloudqUsageDetail({ startTime, endTime, limit = 20, offset = 0 }) {
  return callCloudq({
    service: 'advisor', host: 'advisor.tencentcloudapi.com', action: 'DescribeCloudQUsageDetail', version: '2020-07-21',
    payload: { StartTime: startTime, EndTime: endTime, Limit: limit, Offset: offset },
  })
}

function cloudqInspirationList() {
  return callCloudq({
    service: 'advisor', host: 'advisor.tencentcloudapi.com', action: 'DescribeCloudQInspirationList', version: '2020-07-21',
    payload: { Category: 0 },
  })
}

/** Fetch all CloudQ artifact sessions and their archived files. */
function cloudqArtifactLibrary() {
  return callCloudq({ service: 'advisor', host: 'advisor.tencentcloudapi.com', action: 'DescribeCloudQArtifactLibrary', version: '2020-07-21' })
}

/** Fetch the architecture directory tree available to the current account. */
function cloudqArchitectureDirectories() {
  return callCloudq({
    service: 'advisor', host: 'advisor.tencentcloudapi.com', action: 'ListDirectoryV2', version: '2020-07-21',
    payload: { Tags: [], TagKeys: [] },
  })
}

/** Fetch one page of diagrams in a CloudQ architecture directory. */
function cloudqArchitectureList({ folderId, pageNumber = 1, pageSize = 30 }) {
  return callCloudq({
    service: 'advisor', host: 'advisor.tencentcloudapi.com', action: 'DescribeArchList', version: '2020-07-21',
    payload: {
      PageNumber: pageNumber,
      PageSize: pageSize,
      SearchKey: '',
      FolderId: folderId,
      WithSvgURL: true,
      Tags: [],
      TagKeys: [],
    },
  })
}

/**
 * Extract and validate an AK/SK pair from a request body.
 * Both routes (test / save) share the same contract, so the shape check and
 * the error messages live in one place.
 */
function readAccessKeyBody(body) {
  const secretId = typeof body?.secretId === 'string' ? body.secretId.trim() : ''
  const secretKey = typeof body?.secretKey === 'string' ? body.secretKey.trim() : ''
  if (!secretId || !secretKey) {
    throw new HttpError(400, 'missing-credential', 'SecretId 与 SecretKey 均为必填。')
  }
  return { secretId, secretKey }
}

/** Join the plain-text blocks carried by one DSH message. */
function messageText(content) {
  if (!Array.isArray(content)) return ''
  return content
    .filter((block) => block?.type === 'text' && typeof block.text === 'string')
    .map((block) => block.text)
    .join('\n')
}

/** A durable log proves CloudQ mode through an explicit claim or skill call. */
function hasCloudqEvidence(events) {
  if (!Array.isArray(events)) return false
  for (const event of events) {
    if (event?.type === 'user/message' && event?.data?.source?.kind === 'user') {
      if (/^\s*\/cloudq(?:\s|$)/i.test(messageText(event?.data?.content))) return true
    }
    if (event?.type !== 'tool/call' || event?.data?.name !== 'skill') continue
    let args = event?.data?.arguments
    if (typeof args === 'string') {
      try {
        args = JSON.parse(args)
      } catch {
        args = undefined
      }
    }
    const skillName = typeof args?.name === 'string'
      ? args.name
      : (typeof args?.skill === 'string' ? args.skill : '')
    if (skillName.toLowerCase() === 'cloudq') return true
  }
  return false
}

/**
 * Derive CloudQ session ids from their durable DSH logs. This is the source of
 * truth for historical rows; browser storage is only an optimistic cache for
 * a brand-new blank session that has no log yet.
 */
async function detectCloudqSessionIds(ctx) {
  const query = ctx.get('sessionQuery')
  if (query === undefined) {
    throw new HttpError(503, 'session-query-unavailable', '当前 DSH 未启用会话查询服务。')
  }
  const records = await query.listSessions()
  const ids = []
  const knownIds = []
  // Bound concurrent full-log reads: a user may have hundreds of sessions and
  // one large transcript must not block every other read or spike memory.
  const queue = [...records]
  const worker = async () => {
    while (queue.length > 0) {
      const record = queue.shift()
      const sessionId = record?.header?.id
      if (!sessionId) continue
      knownIds.push(sessionId)
      try {
        const snapshot = await query.readSession(sessionId)
        if (hasCloudqEvidence(snapshot?.events)) ids.push(sessionId)
      } catch {
        // One corrupt/unavailable historical log must not hide all other rows.
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(6, queue.length) }, () => worker()))
  return { ids, knownIds }
}

// ---------------------------------------------------------------------------
// Plugin entry
// ---------------------------------------------------------------------------

/** Settings namespace for the browser card (must equal client card `key`). */
const SETTINGS_NAMESPACE = 'dsh-cloudq'

/** Empty schema; the card is credential-focused and stores nothing. */
export const Config = Schema.object({})

/** Settings namespace for the plugin-manager card. */
const PLUGIN_MANAGER_NAMESPACE = 'dsh-plugin-manager'

export const name = 'dsh-cloudq'

export const inject = ['skills', 'webServer', 'settings', 'sessionQuery']

export function apply(ctx) {
  // Register a settings namespace so the browser half's CloudQ card has a
  // Host-side counterpart to pair with (the "插件配置" tab renders the
  // intersection of Host-served namespaces and cards registered on those
  // keys). The card itself is credential-focused and does not persist a
  // schema, so the schema is an empty object.
  ctx.effect(() => {
    ctx.settings.register(SETTINGS_NAMESPACE, Config, { base: {} })
  }, 'dsh-cloudq: settings namespace')

  // Host-side counterpart for the plugin-manager card. The card is
  // action-driven (list / toggle), so the namespace carries no persisted
  // schema either.
  ctx.effect(() => {
    ctx.settings.register(PLUGIN_MANAGER_NAMESPACE, Config, { base: {} })
  }, 'dsh-cloudq: plugin-manager settings namespace')

  ctx.effect(() => {
    ctx.skills.register({
      name: 'cloudq',
      description:
        '用户咨询腾讯云产品资源、AWS、阿里云等多云资源时，查看智能顾问架构图、架构目录、架构详情、架构评估结果、绘制架构图、开通智能顾问时、AI智能巡检、AI容量监测、AI混沌演练、AI云诊断、主动预警、架构健康度、云运维问答、云资源查询、云成本优化、安全合规、云资源盘点、闲置资源检查、云产品最佳实践等AIOps、ChatOps、CloudOps操作时使用。',
      whenToUse:
        '用户要求进入 CloudQ 模式、使用 CloudQ、咨询云上架构/资源/成本/巡检/诊断等多云或腾讯云运维问题，或点击输入栏 CloudQ 按钮时使用；也适用于架构图查看/评估、AI 巡检、容量监测、混沌演练、云诊断等场景。',
      source: 'bundled',
      resourceBase: {
        kind: 'directory',
        path: skillDirectory(),
      },
      content: renderedSkillContent(),
      invocation: {
        modelInvocable: true,
        userInvocable: true,
      },
    })
  }, 'dsh-cloudq: CloudQ skill')

  ctx.effect(
    () => {
      const disposers = []

      // GET /api/dsh-cloudq/credential — current login state
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/credential',
          handler: async (request, response) => {
            try {
              assertSafeRequest(request, 'GET')
              const status = await credentialStatus()
              sendJson(response, 200, { ok: true, status })
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      // POST /api/dsh-cloudq/logout — clear stored credentials
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/logout',
          handler: async (request, response) => {
            try {
              assertSafeRequest(request, 'POST')
              const result = await logout()
              sendJson(response, 200, { ok: true, status: result })
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      // GET /api/dsh-cloudq/version — installed vs latest npm version.
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/version',
          handler: async (request, response) => {
            try {
              assertSafeRequest(request, 'GET')
              const latest = await latestPackageVersion()
              sendJson(response, 200, {
                ok: true,
                current: PACKAGE_VERSION,
                latest,
                outdated: latest !== null && isNewerVersion(latest, PACKAGE_VERSION),
              })
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      // POST /api/dsh-cloudq/update — install dsh-cloudq@latest into the
      // active profile. Only runs from the client badge click.
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/update',
          handler: async (request, response) => {
            try {
              assertSafeRequest(request, 'POST')
              await runProfileUpdate()
              sendJson(response, 200, { ok: true })
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      // POST /api/dsh-cloudq/restart — respawn the DSH host so the updated
      // plugin (host + client halves) actually takes effect.
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/restart',
          handler: async (request, response) => {
            try {
              assertSafeRequest(request, 'POST')
              sendJson(response, 200, { ok: true, restarting: true })
              scheduleSelfRestart()
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      // POST /api/dsh-cloudq/credential/test — validate a manually entered
      // AK/SK pair without writing it to disk.
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/credential/test',
          handler: async (request, response) => {
            try {
              assertSafeRequest(request, 'POST')
              const { secretId, secretKey } = readAccessKeyBody(await readJsonBody(request))
              const result = await testAccessKey(secretId, secretKey)
              sendJson(response, 200, { ok: true, result })
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      // POST /api/dsh-cloudq/credential/save — validate then persist a
      // manually entered AK/SK pair as the active CloudQ credential.
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/credential/save',
          handler: async (request, response) => {
            try {
              assertSafeRequest(request, 'POST')
              const { secretId, secretKey } = readAccessKeyBody(await readJsonBody(request))
              const status = await saveAccessKey(secretId, secretKey)
              sendJson(response, 200, { ok: true, status })
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      // GET /api/dsh-cloudq/logo.png — the official CloudQ mark, served from
      // the plugin's assets so the browser can reference it directly.
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/logo.png',
          handler: (request, response) => {
            try {
              assertSafeRequest(request, 'GET')
              response.statusCode = 200
              response.setHeader('Content-Type', 'image/png')
              response.setHeader('Cache-Control', 'public, max-age=86400')
              response.setHeader('X-Content-Type-Options', 'nosniff')
              response.end(LOGO_BUFFER)
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      // GET /api/dsh-cloudq/plugins — manageable static plugins with their
      // live `disabled` state. Core layers (dsh-base / dsh-web-app) are
      // excluded; the client card renders the returned rows as toggles.
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/plugins',
          handler: (request, response) => {
            try {
              assertSafeRequest(request, 'GET')
              const plugins = listPlugins(ctx.baseUrl)
              sendJson(response, 200, { ok: true, plugins })
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      // POST /api/dsh-cloudq/plugins/toggle — flip a plugin's `disabled` flag
      // in the user patch file; the host's watchUserPatches HMR applies it
      // without a restart.
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/plugins/toggle',
          handler: async (request, response) => {
            try {
              assertSafeRequest(request, 'POST')
              const body = await readJsonBody(request)
              const id = typeof body?.id === 'string' ? body.id : ''
              if (!id) throw new HttpError(400, 'missing-id', '缺少插件 ID。')
              const disabled = body?.disabled === true
              const result = setPluginDisabled(ctx.baseUrl, id, disabled)
              sendJson(response, 200, { ok: true, result })
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      // GET /api/dsh-cloudq/usage?start=&end=&limit=&offset= — CloudQ credit
      // overview + per-request detail rows (proxied via tcloud_api.py).
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/usage',
          handler: async (request, response) => {
            try {
              assertSafeRequest(request, 'GET')
              const url = new URL(request.url, 'http://localhost')
              const startTime = url.searchParams.get('start') ?? ''
              const endTime = url.searchParams.get('end') ?? ''
              const limit = Number(url.searchParams.get('limit') ?? 20)
              const offset = Number(url.searchParams.get('offset') ?? 0)
              const timestampPattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
              if (!timestampPattern.test(startTime) || !timestampPattern.test(endTime)) {
                throw new HttpError(400, 'invalid-range', 'The start and end timestamps are invalid.')
              }
              if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100
                || !Number.isSafeInteger(offset) || offset < 0) {
                throw new HttpError(400, 'invalid-pagination', 'The pagination parameters are invalid.')
              }
              const [overview, detail] = await Promise.all([
                cloudqUsageOverview(),
                cloudqUsageDetail({ startTime, endTime, limit, offset }),
              ])
              sendJson(response, 200, {
                ok: true,
                overview: overview?.data ?? {},
                detail: detail?.data?.Detail ?? [],
                total: detail?.data?.TotalCount ?? detail?.data?.Detail?.length ?? 0,
              })
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      // GET /api/dsh-cloudq/inspirations — CloudQ inspiration suggestions
      // (single request returns all categories; the client filters them).
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/inspirations',
          handler: async (request, response) => {
            try {
              assertSafeRequest(request, 'GET')
              const result = await cloudqInspirationList()
              sendJson(response, 200, {
                ok: true,
                inspirations: result?.data?.InspirationSet ?? [],
                total: result?.data?.TotalCount ?? 0,
              })
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      // GET /api/dsh-cloudq/artifacts — artifact sessions with downloadable
      // files. Download URLs are short-lived signed COS URLs returned by the
      // CloudQ API; the Host does not persist or rewrite them.
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/artifacts',
          handler: async (request, response) => {
            try {
              assertSafeRequest(request, 'GET')
              const result = await cloudqArtifactLibrary()
              const sessions = Array.isArray(result?.data?.Sessions) ? result.data.Sessions : []
              sendJson(response, 200, {
                ok: true,
                sessions,
                total: Number(result?.data?.TotalCount) || sessions.length,
              })
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      // GET /api/dsh-cloudq/sessions — exact historical CloudQ classification
      // derived from durable conversation events rather than browser state.
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/sessions',
          handler: async (request, response) => {
            try {
              assertSafeRequest(request, 'GET')
              const { ids, knownIds } = await detectCloudqSessionIds(ctx)
              sendJson(response, 200, { ok: true, sessionIds: ids, knownIds })
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      // GET /api/dsh-cloudq/architecture/directories — account directory tree.
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/architecture/directories',
          handler: async (request, response) => {
            try {
              assertSafeRequest(request, 'GET')
              const result = await cloudqArchitectureDirectories()
              const folders = Array.isArray(result?.data?.Folders) ? result.data.Folders : []
              sendJson(response, 200, {
                ok: true,
                folders,
                firstFolderId: Number(result?.data?.FirstFolderId) || null,
              })
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      // GET /api/dsh-cloudq/architecture/list?folderId=<positive integer>
      disposers.push(
        ctx.webServer.register({
          kind: 'exact',
          path: '/api/dsh-cloudq/architecture/list',
          handler: async (request, response) => {
            try {
              assertSafeRequest(request, 'GET')
              const url = new URL(request.url, 'http://localhost')
              const folderId = Number(url.searchParams.get('folderId'))
              if (!Number.isSafeInteger(folderId) || folderId <= 0) {
                throw new HttpError(400, 'invalid-folder-id', 'folderId 必须是正整数。')
              }
              const result = await cloudqArchitectureList({ folderId })
              const architectures = Array.isArray(result?.data?.ArchList) ? result.data.ArchList : []
              sendJson(response, 200, {
                ok: true,
                architectures,
                total: Number(result?.data?.TotalCount) || architectures.length,
              })
            } catch (error) {
              sendError(response, error)
            }
          },
        }),
      )

      return () => {
        for (const dispose of disposers) dispose()
      }
    },
    'dsh-cloudq: credential, plugin-manager and data routes',
  )
}
