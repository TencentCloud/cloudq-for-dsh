/** Host-side management of optional profile bundle entries. */

import { createRequire } from 'node:module'
import {
  existsSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'

const PROTECTED_BUNDLES = new Set(['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app'])

function profileDirectory(baseUrl) {
  const url = new URL('.', baseUrl)
  if (url.protocol !== 'file:') throw new Error('The active DSH profile URL must use the file protocol.')
  return fileURLToPath(url)
}

function patchPath(baseUrl) {
  return resolve(profileDirectory(baseUrl), 'cordis.patch.yml')
}

function parsePatchList(content) {
  if (!content.trim()) return []
  const parsed = yaml.load(content)
  if (parsed === null || parsed === undefined) return []
  if (!Array.isArray(parsed)) throw new Error('The DSH profile patch must contain a top-level array.')
  return parsed
}

function leadingComments(content) {
  return (content.match(/^(#[^\n]*\n)+/) ?? [''])[0]
}

function serializePatchList(entries, originalContent) {
  return `${leadingComments(originalContent)}${yaml.dump(entries, { noRefs: true, lineWidth: 120 })}`
}

function packageDirectory(profileDir, packageName) {
  const anchor = join(profileDir, 'package.json')
  for (const searchPath of createRequire(anchor).resolve.paths(packageName) ?? []) {
    const candidate = join(searchPath, packageName)
    if (existsSync(join(candidate, 'package.json'))) return candidate
  }
  return undefined
}

function bundleInsertRows(profileDir, packageName) {
  const packageDir = packageDirectory(profileDir, packageName)
  if (packageDir === undefined) return []

  const manifest = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'))
  const declaredPatch = manifest?.dsh?.bundle?.patch
  if (typeof declaredPatch !== 'string' || !declaredPatch) return []

  const bundlePatchPath = join(packageDir, declaredPatch)
  if (!existsSync(bundlePatchPath)) return []
  const rows = []
  for (const block of parsePatchList(readFileSync(bundlePatchPath, 'utf8'))) {
    if (block && typeof block === 'object' && Array.isArray(block.insert)) {
      rows.push(...block.insert)
    }
  }
  return rows
}

function readProfileBundles(profileDir) {
  const manifest = JSON.parse(readFileSync(join(profileDir, 'package.json'), 'utf8'))
  const bundles = manifest?.dsh?.profile?.bundles
  return Array.isArray(bundles) ? bundles.filter(bundle => typeof bundle === 'string') : []
}

function fileSnapshot(path) {
  if (!existsSync(path)) return undefined
  const stat = statSync(path)
  return { size: stat.size, mtimeMs: stat.mtimeMs, mode: stat.mode }
}

function sameSnapshot(left, right) {
  if (left === undefined || right === undefined) return left === right
  return left.size === right.size && left.mtimeMs === right.mtimeMs
}

function writePatchAtomically(path, content, originalSnapshot) {
  const temporary = join(dirname(path), `.${process.pid}.${Date.now()}.dsh-cloudq.tmp`)
  try {
    writeFileSync(temporary, content, {
      encoding: 'utf8',
      flag: 'wx',
      mode: originalSnapshot?.mode ?? 0o600,
    })
    if (!sameSnapshot(originalSnapshot, fileSnapshot(path))) {
      throw new Error('The DSH profile patch changed while it was being updated. Retry the operation.')
    }
    renameSync(temporary, path)
  } finally {
    rmSync(temporary, { force: true })
  }
}

/**
 * List third-party bundle entries mounted by the active profile.
 * @param {string | URL} baseUrl Loader base URL from `ctx.baseUrl`.
 * @returns {Array<{id: string, name: string, bundle: string, disabled: boolean, self: boolean}>}
 */
export function listPlugins(baseUrl) {
  const profileDir = profileDirectory(baseUrl)
  const userPatchPath = patchPath(baseUrl)
  const userPatches = existsSync(userPatchPath)
    ? parsePatchList(readFileSync(userPatchPath, 'utf8'))
    : []
  const overrides = userPatches.filter(
    entry => entry && typeof entry === 'object' && typeof entry.id === 'string',
  )

  const plugins = []
  for (const bundle of readProfileBundles(profileDir)) {
    if (PROTECTED_BUNDLES.has(bundle)) continue
    for (const row of bundleInsertRows(profileDir, bundle)) {
      if (!row || typeof row !== 'object' || typeof row.id !== 'string') continue
      const override = overrides.find(entry => entry.id === row.id)
      plugins.push({
        id: row.id,
        name: typeof row.name === 'string' ? row.name : row.id,
        bundle,
        disabled: override?.disabled === true,
        self: bundle === 'dsh-cloudq',
      })
    }
  }
  return plugins
}

/**
 * Atomically update one mounted plugin's disabled override.
 * @param {string | URL} baseUrl Loader base URL from `ctx.baseUrl`.
 * @param {string} id Mounted plugin entry id.
 * @param {boolean} disabled Desired disabled state.
 * @returns {{ok: true, id: string, disabled: boolean}}
 */
export function setPluginDisabled(baseUrl, id, disabled) {
  const userPatchPath = patchPath(baseUrl)
  if (!listPlugins(baseUrl).some(plugin => plugin.id === id)) {
    const error = new Error(`Unknown plugin entry: ${id}`)
    error.code = 'unknown-plugin'
    throw error
  }

  const originalSnapshot = fileSnapshot(userPatchPath)
  const original = originalSnapshot === undefined ? '' : readFileSync(userPatchPath, 'utf8')
  let patches = parsePatchList(original)
  const target = patches.find(entry => entry && typeof entry === 'object' && entry.id === id)

  if (target) {
    if (disabled) {
      target.disabled = true
    } else {
      delete target.disabled
      if (Object.keys(target).length === 1) {
        patches = patches.filter(entry => entry !== target)
      }
    }
  } else if (disabled) {
    patches.push({ id, disabled: true })
  } else {
    return { ok: true, id, disabled: false }
  }

  writePatchAtomically(userPatchPath, serializePatchList(patches, original), originalSnapshot)
  return { ok: true, id, disabled }
}
