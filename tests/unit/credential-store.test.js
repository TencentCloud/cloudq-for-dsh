import { beforeEach, describe, expect, it, vi } from 'vitest'
const fs = vi.hoisted(() => ({
  chmodSync: vi.fn(), lstatSync: vi.fn(), mkdirSync: vi.fn(), readFileSync: vi.fn(),
  renameSync: vi.fn(), unlinkSync: vi.fn(), writeFileSync: vi.fn(),
}))
vi.mock('node:fs', () => fs)
import { deleteCredential, saveCredential, validateAndSaveCredential } from '../../src/tcloud.js'

beforeEach(() => {
  vi.resetAllMocks()
  fs.lstatSync.mockReturnValue({ isDirectory: () => true, isSymbolicLink: () => false })
  fs.readFileSync.mockReturnValue('{}')
})

describe('credential persistence safety', () => {
  it('reports deletion failure instead of pretending to log out', () => {
    fs.unlinkSync.mockImplementation(() => { throw Object.assign(new Error(), { code: 'EACCES' }) })
    expect(() => deleteCredential()).toThrow('凭证删除失败')
  })
  it('ignores only an already absent credential', () => {
    fs.unlinkSync.mockImplementation(() => { throw Object.assign(new Error(), { code: 'ENOENT' }) })
    expect(() => deleteCredential()).not.toThrow()
  })
  it('uses exclusive random temporary files and private permissions', () => {
    saveCredential('test-id', 'test-key')
    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.stringMatching(/\.tmp-[a-f0-9-]+$/), expect.any(String), { encoding: 'utf8', mode: 0o600, flag: 'wx' })
    if (process.platform !== 'win32') expect(fs.chmodSync).toHaveBeenCalledWith(expect.any(String), 0o700)
    expect(fs.renameSync).toHaveBeenCalledOnce()
  })
  it('rejects symbolic link credential directories', () => {
    fs.lstatSync.mockReturnValue({ isDirectory: () => true, isSymbolicLink: () => true })
    expect(() => saveCredential('id', 'key')).toThrow('凭证目录不安全')
    expect(fs.writeFileSync).not.toHaveBeenCalled()
  })
  it('cleans up a temporary file when rename fails', () => {
    fs.renameSync.mockImplementation(() => { throw new Error('rename failed') })
    expect(() => saveCredential('id', 'key')).toThrow('rename failed')
    expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining('.tmp-'))
  })
  it('logout invalidates in-flight validation', async () => {
    let finish
    const promise = validateAndSaveCredential('id', 'key', () => new Promise(resolve => { finish = resolve }))
    deleteCredential()
    finish()
    await expect(promise).rejects.toMatchObject({ code: 'credential-save-cancelled' })
    expect(fs.writeFileSync).not.toHaveBeenCalled()
  })
  it('a newer save invalidates an earlier save', async () => {
    let finish
    const earlier = validateAndSaveCredential('old', 'key', () => new Promise(resolve => { finish = resolve }))
    await validateAndSaveCredential('new', 'key', async () => {})
    finish()
    await expect(earlier).rejects.toMatchObject({ code: 'credential-save-cancelled' })
    expect(fs.writeFileSync).toHaveBeenCalledOnce()
  })
  it('does not save disconnected requests', async () => {
    await expect(validateAndSaveCredential('id', 'key', async () => {}, () => false)).rejects.toMatchObject({ code: 'credential-save-cancelled' })
    expect(fs.writeFileSync).not.toHaveBeenCalled()
  })
  it('does not save after the commit deadline', async () => {
    const clock = vi.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(20000)
    try {
      await expect(validateAndSaveCredential('id', 'key', async () => {})).rejects.toMatchObject({ code: 'credential-save-cancelled' })
      expect(fs.writeFileSync).not.toHaveBeenCalled()
    } finally { clock.mockRestore() }
  })
})
