import { EventEmitter } from 'node:events'
import { describe, expect, it, vi } from 'vitest'
import { runScript } from '../../src/script-runner.js'

function childProcess() {
  const child = new EventEmitter()
  child.stdout = new EventEmitter()
  child.stderr = new EventEmitter()
  child.stdin = { end: vi.fn(), on: vi.fn() }
  child.kill = vi.fn()
  return child
}

describe('Python helper runner', () => {
  it('passes credentials through stdin instead of argv', async () => {
    const child = childProcess()
    const spawnProcess = vi.fn(() => child)
    const secretId = 'id-for-test'
    const secretKey = 'key-for-test'
    const stdin = JSON.stringify({ secretId, secretKey })

    const resultPromise = runScript('/package/scripts', 'save_ak.py', ['--test', '--stdin'], {
      stdin,
      sensitiveValues: [secretId, secretKey],
      spawnProcess,
    })

    const [, argv, options] = spawnProcess.mock.calls[0]
    expect(argv).toEqual(['/package/scripts/save_ak.py', '--test', '--stdin'])
    expect(argv.join(' ')).not.toContain(secretId)
    expect(argv.join(' ')).not.toContain(secretKey)
    expect(options.stdio[0]).toBe('pipe')
    expect(child.stdin.end).toHaveBeenCalledWith(stdin)

    child.stdout.emit('data', Buffer.from('{"success":true,"valid":true}'))
    child.emit('close', 0)
    await expect(resultPromise).resolves.toEqual({ success: true, valid: true })
  })

  it('does not expose helper error output', async () => {
    const child = childProcess()
    const spawnProcess = vi.fn(() => child)
    const resultPromise = runScript('/package/scripts', 'save_ak.py', ['--test'], {
      spawnProcess,
    })
    child.stdout.emit('data', Buffer.from(JSON.stringify({
      success: false,
      error: { code: 'ValidateFailed', message: '/private/path secret-value' },
    })))
    child.emit('close', 1)
    await expect(resultPromise).rejects.toMatchObject({
      statusCode: 502,
      code: 'ValidateFailed',
      message: 'The CloudQ helper failed.',
    })
  })

  it('terminates helpers that exceed the output limit', async () => {
    const child = childProcess()
    const spawnProcess = vi.fn(() => child)
    const resultPromise = runScript('/package/scripts', 'large.py', [], { spawnProcess })
    child.stdout.emit('data', Buffer.alloc(1024 * 1024 + 1))
    await expect(resultPromise).rejects.toMatchObject({ code: 'script-output-too-large' })
    expect(child.kill).toHaveBeenCalledOnce()
  })
})
