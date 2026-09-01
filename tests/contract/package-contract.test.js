import { existsSync, readFileSync } from 'node:fs'
import yaml from 'js-yaml'
import { describe, expect, it } from 'vitest'

const root = new URL('../../', import.meta.url)
const read = path => readFileSync(new URL(path, root), 'utf8')
const manifest = JSON.parse(read('package.json'))

describe('npm and DSH package contract', () => {
  it('declares the public package, repository, runtime files, and official registry', () => {
    expect(manifest.name).toBe('dsh-cloudq')
    expect(manifest.version).toBe('0.1.8')
    expect(manifest.repository.url).toBe('git+https://github.com/TencentCloud/cloudq-for-dsh.git')
    expect(manifest.homepage).toBe('https://github.com/TencentCloud/cloudq-for-dsh#readme')
    expect(manifest.bugs.url).toBe('https://github.com/TencentCloud/cloudq-for-dsh/issues')
    expect(manifest.publishConfig).toEqual({
      access: 'public',
      registry: 'https://registry.npmjs.org/',
    })
    expect(manifest.files).toContain('assets/cloudq.png')
    expect(manifest.dependencies).toMatchObject({
      '@deepseek-ai/schemastery': expect.any(String),
      'js-yaml': expect.any(String),
    })
  })

  it('declares matching Host, client, and bundle entry points', () => {
    expect(manifest.exports['.'].default).toBe('./lib/index.js')
    expect(manifest.exports['./client'].default).toBe('./lib/client.js')
    expect(manifest.dsh.bundle.patch).toBe('./cordis.patch.yml')
    expect(manifest.dsh.client.platform).toBe('web')
    const patch = yaml.load(read('cordis.patch.yml'))
    expect(patch).toEqual([{ insert: [{ id: 'ui-dsh-cloudq', name: 'dsh-cloudq' }] }])
  })

  it('ships required resources and excludes generated Python caches', () => {
    expect(existsSync(new URL('assets/cloudq.png', root))).toBe(true)
    expect(existsSync(new URL('skills/cloudq/SKILL.md', root))).toBe(true)
    const npmIgnore = read('.npmignore')
    expect(npmIgnore).toContain('**/__pycache__/')
    expect(npmIgnore).toContain('**/*.py[cod]')
  })

  it('contains no production debug global, innerHTML sink, or credential argv bridge', () => {
    const client = read('src/client/index.js')
    const host = read('src/index.js')
    expect(client).not.toContain('__cloudqCtx')
    expect(client).not.toContain('innerHTML')
    expect(host).not.toMatch(/\['--(?:test|save)',\s*secretId,\s*secretKey\]/)
    expect(host).toContain("['--save', '--stdin']")
    expect(host).toContain("['--test', '--stdin']")
  })
})
