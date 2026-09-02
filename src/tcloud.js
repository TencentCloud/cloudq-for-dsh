/**
 * Node-native Tencent Cloud API client (TC3-HMAC-SHA256) and credential
 * store for the dsh-cloudq host.
 *
 * The DSH host itself runs on Node, so — same as dsh-cos — every panel API
 * call happens in-process with zero external runtime dependency. Python only
 * remains for the agent-driven skill conversation flow.
 *
 * @module dsh-cloudq/tcloud
 */

import { createHmac, createHash } from 'node:crypto'
import { chmodSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { request as httpsRequest } from 'node:https'
import { dirname, join } from 'node:path'
import { HttpError } from './http.js'

const CREDENTIAL_FILE = join(homedir(), '.tencent-cloudq', 'credential.json')

const sha256 = (value) => createHash('sha256').update(value, 'utf8').digest('hex')
const hmacSha256 = (key, value) => createHmac('sha256', key).update(value, 'utf8').digest()
const hmacSha256Hex = (key, value) => createHmac('sha256', key).update(value, 'utf8').digest('hex')

/** Mask a SecretId exactly like the Python helpers: keep only the last 4. */
export function maskSecretId(value) {
  const text = String(value ?? '')
  return text.length <= 4 ? '*'.repeat(text.length) : '*'.repeat(text.length - 4) + text.slice(-4)
}

/**
 * Read the stored credential shared with the CloudQ skill.
 * Only the AK/SK entries (`type: "ak"`, optional STS token) can TC3-sign;
 * OAuth/Connector entries carry no SecretKey and surface as NeedAuth.
 */
export function readCredential() {
  let data
  try {
    data = JSON.parse(readFileSync(CREDENTIAL_FILE, 'utf8'))
  } catch {
    return null
  }
  const secretId = typeof data?.secretId === 'string' ? data.secretId : ''
  const secretKey = typeof data?.secretKey === 'string' ? data.secretKey : ''
  if (!secretId || !secretKey) return null
  return {
    secretId,
    secretKey,
    token: typeof data?.token === 'string' ? data.token : '',
    authType: typeof data?.type === 'string' ? data.type : 'ak',
  }
}

/** Credential state for the settings UI (never exposes the SecretKey). */
export function credentialStatus() {
  const credential = readCredential()
  if (!credential) return { logged_in: false }
  return {
    logged_in: true,
    secret_id_masked: maskSecretId(credential.secretId),
    auth_type: credential.authType,
  }
}

/** Persist an AK/SK pair atomically, mirroring credential_manager (dir 700, file 600). */
export function saveCredential(secretId, secretKey) {
  const data = {
    type: 'ak',
    secretId,
    secretKey,
    token: '',
    expiresAt: 0,
    createdAt: new Date().toISOString(),
  }
  const directory = dirname(CREDENTIAL_FILE)
  mkdirSync(directory, { recursive: true })
  const temporary = `${CREDENTIAL_FILE}.tmp-${process.pid}`
  writeFileSync(temporary, JSON.stringify(data, null, 2), { encoding: 'utf8', mode: 0o600 })
  renameSync(temporary, CREDENTIAL_FILE)
  if (process.platform !== 'win32') {
    try {
      chmodSync(directory, 0o700)
      chmodSync(CREDENTIAL_FILE, 0o600)
    } catch {
      // best effort only
    }
  }
}

/** Remove the stored credential (退出登录). */
export function deleteCredential() {
  try {
    unlinkSync(CREDENTIAL_FILE)
  } catch {
    // already absent — nothing to clear
  }
}

/**
 * Call a Tencent Cloud API with TC3-HMAC-SHA256 signing.
 * Returns the unwrapped `Response` payload; API errors become HttpError with
 * the upstream code (AuthFailure.* etc.) so callers can map them like the
 * Python helpers did.
 */
export async function callTcloudApi(
  { service, host, action, version, payload = {} },
  credential = readCredential(),
) {
  if (!credential) {
    throw new HttpError(401, 'NeedAuth', '尚未配置 AK/SK，请前往「设置 → 插件 → CloudQ」完成配置。')
  }
  const body = JSON.stringify(payload)
  const timestamp = Math.floor(Date.now() / 1000)
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10)

  const canonicalRequest = [
    'POST',
    '/',
    '',
    `content-type:application/json\nhost:${host}\nx-tc-action:${action.toLowerCase()}`,
    '',
    'content-type;host;x-tc-action',
    sha256(body),
  ].join('\n')
  const stringToSign = [
    'TC3-HMAC-SHA256',
    String(timestamp),
    `${date}/${service}/tc3_request`,
    sha256(canonicalRequest),
  ].join('\n')
  const keyDate = hmacSha256(`TC3${credential.secretKey}`, date)
  const keyService = hmacSha256(keyDate, service)
  const keySigning = hmacSha256(keyService, 'tc3_request')
  const signature = hmacSha256Hex(keySigning, stringToSign)
  const authorization = `TC3-HMAC-SHA256 Credential=${credential.secretId}/${date}/${service}/tc3_request, SignedHeaders=content-type;host;x-tc-action, Signature=${signature}`

  const headers = {
    'Content-Type': 'application/json',
    'X-TC-Action': action,
    'X-TC-Version': version,
    'X-TC-Timestamp': String(timestamp),
    Authorization: authorization,
  }
  if (credential.token) headers['X-TC-Token'] = credential.token

  const text = await new Promise((resolveRequest, rejectRequest) => {
    const request = httpsRequest(
      { host, path: '/', method: 'POST', headers, timeout: 30000 },
      (response) => {
        let bodyText = ''
        response.on('data', (chunk) => {
          bodyText += chunk
          if (bodyText.length > 1024 * 1024) request.destroy()
        })
        response.on('end', () => resolveRequest(bodyText))
      },
    )
    request.on('error', () => rejectRequest(new HttpError(502, 'network-error', '无法连接腾讯云服务，请检查网络后重试。')))
    request.on('timeout', () => {
      request.destroy()
      rejectRequest(new HttpError(504, 'network-timeout', '腾讯云服务响应超时，请稍后重试。'))
    })
    request.end(body)
  })

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new HttpError(502, 'invalid-response', '腾讯云服务返回了无法识别的响应。')
  }
  const envelope = parsed?.Response ?? {}
  if (envelope.Error) {
    throw new HttpError(502, String(envelope.Error.Code ?? 'api-error'), String(envelope.Error.Message ?? '腾讯云接口调用失败。'))
  }
  return envelope
}
