import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import yaml from 'js-yaml'
import { afterEach, describe, expect, it } from 'vitest'
import { listPlugins, setPluginDisabled } from '../../src/plugin-manager.js'

const temporaryDirectories = []

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true })
  }
})

function fixture() {
  const profile = mkdtempSync(join(tmpdir(), 'dsh-cloudq-profile-'))
  temporaryDirectories.push(profile)
  const packageDir = join(profile, 'node_modules', '@example', 'custom-plugin')
  mkdirSync(join(packageDir, 'config'), { recursive: true })
  writeFileSync(join(profile, 'package.json'), JSON.stringify({
    dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', '@example/custom-plugin'] } },
  }))
  writeFileSync(join(packageDir, 'package.json'), JSON.stringify({
    name: '@example/custom-plugin',
    dsh: { bundle: { patch: './config/plugin.patch.yml' } },
  }))
  writeFileSync(join(packageDir, 'config', 'plugin.patch.yml'), yaml.dump([
    { insert: [{ id: 'example.plugin', name: '@example/custom-plugin' }] },
  ]))
  writeFileSync(join(profile, 'cordis.patch.yml'), [
    '# user overrides',
    '- insert:',
    '    - id: user.extra',
    '      name: user-extra',
    '',
  ].join('\n'))
  return { profile, baseUrl: pathToFileURL(`${profile}/`).href }
}

describe('profile plugin manager', () => {
  it('loads scoped bundles and their declared custom patch path', () => {
    const { baseUrl } = fixture()
    expect(listPlugins(baseUrl)).toEqual([{
      id: 'example.plugin',
      name: '@example/custom-plugin',
      bundle: '@example/custom-plugin',
      disabled: false,
      self: false,
    }])
  })

  it('atomically toggles an override without discarding unrelated patch blocks', () => {
    const { profile, baseUrl } = fixture()
    expect(setPluginDisabled(baseUrl, 'example.plugin', true)).toEqual({
      ok: true,
      id: 'example.plugin',
      disabled: true,
    })

    const patchPath = join(profile, 'cordis.patch.yml')
    const afterDisable = yaml.load(readFileSync(patchPath, 'utf8'))
    expect(afterDisable).toContainEqual({
      insert: [{ id: 'user.extra', name: 'user-extra' }],
    })
    expect(afterDisable).toContainEqual({ id: 'example.plugin', disabled: true })
    expect(listPlugins(baseUrl)[0].disabled).toBe(true)

    setPluginDisabled(baseUrl, 'example.plugin', false)
    const afterEnable = yaml.load(readFileSync(patchPath, 'utf8'))
    expect(afterEnable).toEqual([{
      insert: [{ id: 'user.extra', name: 'user-extra' }],
    }])
  })

  it('rejects unknown plugin ids', () => {
    const { baseUrl } = fixture()
    expect(() => setPluginDisabled(baseUrl, 'missing.plugin', true))
      .toThrow('Unknown plugin entry')
  })
})
