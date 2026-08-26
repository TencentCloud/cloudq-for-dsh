import { Readable } from 'node:stream'
import { describe, expect, it, vi } from 'vitest'
import {
  HttpError,
  MAX_JSON_BODY_BYTES,
  assertSafeRequest,
  readJsonBody,
  sendError,
} from '../../src/http.js'

function request(chunks, headers = {}) {
  const stream = Readable.from(chunks)
  stream.headers = headers
  stream.method = 'POST'
  stream.socket = { remoteAddress: '127.0.0.1' }
  return stream
}

describe('HTTP request safety', () => {
  it('accepts bounded JSON from a loopback request', async () => {
    const body = await readJsonBody(request(['{"ok":', 'true}'], {
      'content-type': 'application/json; charset=utf-8',
    }))
    expect(body).toEqual({ ok: true })
  })

  it('rejects an oversized declared body before buffering it', async () => {
    const stream = request([], {
      'content-type': 'application/json',
      'content-length': String(MAX_JSON_BODY_BYTES + 1),
    })
    await expect(readJsonBody(stream)).rejects.toMatchObject({
      statusCode: 413,
      code: 'payload-too-large',
    })
  })

  it('rejects an oversized chunked body', async () => {
    const stream = request([
      Buffer.alloc(MAX_JSON_BODY_BYTES),
      Buffer.from('x'),
    ], { 'content-type': 'application/json' })
    await expect(readJsonBody(stream)).rejects.toMatchObject({
      statusCode: 413,
      code: 'payload-too-large',
    })
  })

  it('rejects non-JSON media types', async () => {
    await expect(readJsonBody(request(['{}'], { 'content-type': 'text/plain' })))
      .rejects.toMatchObject({ statusCode: 415, code: 'unsupported-media-type' })
  })

  it('rejects cross-site requests', () => {
    const stream = request([], { 'sec-fetch-site': 'cross-site' })
    expect(() => assertSafeRequest(stream, 'POST')).toThrowError(HttpError)
  })

  it('does not expose unexpected internal error messages', () => {
    const response = {
      setHeader: vi.fn(),
      end: vi.fn(),
    }
    sendError(response, new Error('private filesystem path and secret'))
    expect(response.statusCode).toBe(500)
    expect(response.end).toHaveBeenCalledWith(JSON.stringify({
      ok: false,
      error: { code: 'internal', message: 'The CloudQ request failed.' },
    }))
  })
})
