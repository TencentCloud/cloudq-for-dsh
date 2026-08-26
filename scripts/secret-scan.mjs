import { readFile, readdir } from 'node:fs/promises'
import { extname, join } from 'node:path'

const roots = ['src', 'scripts', 'skills', 'tests', '.github']
const allowed = new Set(['.js', '.mjs', '.ts', '.tsx', '.py', '.yml', '.yaml', '.json', '.md'])
const patterns = [
  /AKID[A-Za-z0-9]{12,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:secret(?:Id|Key)?|token|password)\s*[:=]\s*['"][^'"\s]{16,}['"]/i,
]
const findings = []
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) await walk(path)
    else if (allowed.has(extname(entry.name))) {
      const text = await readFile(path, 'utf8')
      for (const pattern of patterns) {
        if (pattern.test(text)) findings.push(`${path}: ${pattern}`)
      }
    }
  }
}
for (const root of roots) await walk(root)
if (findings.length > 0) throw new Error(`possible committed secrets:\n${findings.join('\n')}`)
console.log('secret scan passed')
