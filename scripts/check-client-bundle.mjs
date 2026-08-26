import { readFile } from 'node:fs/promises'

const packageId = 'dsh-cloudq'
const source = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')
const escapedId = packageId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const registration = new RegExp(
  `window\\.__ModuleLoader__\\.load\\(\\{\\s*id:\\s*["']${escapedId}["'],\\s*factory:\\s*\\(require\\)\\s*=>\\s*\\{`,
)
if (!registration.test(source)) {
  throw new Error(`client bundle is missing the ${packageId} ModuleLoader registration`)
}
if (!/var\s+module\s*=\s*\{\s*exports:\s*\{\}\s*\};/.test(source)) {
  throw new Error('client bundle is missing the CommonJS module bridge')
}
if (!/return\s+module\.exports;\s*\}\s*\}\);/.test(source)) {
  throw new Error('client bundle is missing the ModuleLoader factory footer')
}
const registrations = source.match(/__ModuleLoader__\.load\(/g) ?? []
if (registrations.length !== 1) {
  throw new Error(`client bundle must register exactly once, found ${registrations.length}`)
}
if (/^\s*import(?:\s+[\w*{'"]|\s*\()/m.test(source)) {
  throw new Error('client bundle must not contain ESM imports')
}
if (source.includes('__cloudqCtx')) {
  throw new Error('client bundle exposes a production debug global')
}
if (source.includes('innerHTML')) {
  throw new Error('client bundle contains an unsafe innerHTML sink')
}
console.log(`client bundle contract passed (${source.length} bytes)`)
