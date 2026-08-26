import { Buffer } from 'node:buffer'

/** Maximum accepted JSON request body size. */
export const MAX_JSON_BODY_BYTES = 64 * 1024

/** HTTP failure with a stable client-facing code. */
export class HttpError extends Error {
  /**
   * @param {number} statusCode HTTP status code.
   * @param {string} code Stable machine-readable code.
   * @param {string} message Safe client-facing message.
   */
  constructor(statusCode, code, message) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.code = code
  }
}

/** Return whether a request originated from the local machine. */
export function isLoopbackRequest(request) {
  const address = request.socket?.remoteAddress
  return address === '::1'
    || address === '127.0.0.1'
    || address === '::ffff:127.0.0.1'
    || (typeof address === 'string' && /^::ffff:127\./.test(address))
}

/** Reject cross-site, non-loopback, or unexpected-method requests. */
export function assertSafeRequest(request, expectedMethod) {
  if (!isLoopbackRequest(request)) {
    throw new HttpError(403, 'forbidden', 'CloudQ is available only from the local DSH page.')
  }
  if ((request.method ?? 'GET').toUpperCase() !== expectedMethod) {
    throw new HttpError(405, 'method-not-allowed', 'The request method is not supported.')
  }

  const fetchSite = request.headers['sec-fetch-site']
  if (typeof fetchSite === 'string'
    && fetchSite !== 'same-origin'
    && fetchSite !== 'same-site'
    && fetchSite !== 'none') {
    throw new HttpError(403, 'forbidden-origin', 'Cross-site requests are not allowed.')
  }

  const origin = request.headers.origin
  if (origin !== undefined) {
    const host = request.headers.host
    if (host === undefined) {
      throw new HttpError(403, 'forbidden-origin', 'The request origin is invalid.')
    }
    let originHost
    try {
      originHost = new URL(origin).host.toLowerCase()
    } catch {
      throw new HttpError(403, 'forbidden-origin', 'The request origin is invalid.')
    }
    if (originHost !== host.toLowerCase()) {
      throw new HttpError(403, 'forbidden-origin', 'Cross-site requests are not allowed.')
    }
  }
}

/** Send a JSON response with security and caching headers. */
export function sendJson(response, statusCode, body) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.end(JSON.stringify(body))
}

/** Send only stable, client-safe error details. */
export function sendError(response, error) {
  if (error instanceof HttpError) {
    sendJson(response, error.statusCode, {
      ok: false,
      error: { code: error.code, message: error.message },
    })
    return
  }
  sendJson(response, 500, {
    ok: false,
    error: { code: 'internal', message: 'The CloudQ request failed.' },
  })
}

function contentLength(request) {
  const value = request.headers['content-length']
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === undefined) return undefined
  if (!/^\d+$/.test(raw)) {
    throw new HttpError(400, 'invalid-content-length', 'The Content-Length header is invalid.')
  }
  const length = Number(raw)
  if (!Number.isSafeInteger(length)) {
    throw new HttpError(400, 'invalid-content-length', 'The Content-Length header is invalid.')
  }
  return length
}

/** Read and parse a bounded application/json request body. */
export function readJsonBody(request, { maxBytes = MAX_JSON_BODY_BYTES } = {}) {
  const contentType = request.headers['content-type']
  if (typeof contentType !== 'string'
    || contentType.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
    request.resume?.()
    return Promise.reject(new HttpError(415, 'unsupported-media-type', 'Content-Type must be application/json.'))
  }

  let declaredLength
  try {
    declaredLength = contentLength(request)
  } catch (error) {
    request.resume?.()
    return Promise.reject(error)
  }
  if (declaredLength !== undefined && declaredLength > maxBytes) {
    request.resume?.()
    return Promise.reject(new HttpError(413, 'payload-too-large', 'The JSON request body is too large.'))
  }

  return new Promise((resolveBody, rejectBody) => {
    const chunks = []
    let bytes = 0
    let settled = false

    const rejectOnce = (error) => {
      if (settled) return
      settled = true
      chunks.length = 0
      rejectBody(error)
    }

    request.on('data', (chunk) => {
      if (settled) return
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
      bytes += buffer.byteLength
      if (bytes > maxBytes) {
        rejectOnce(new HttpError(413, 'payload-too-large', 'The JSON request body is too large.'))
        return
      }
      chunks.push(buffer)
    })
    request.on('end', () => {
      if (settled) return
      settled = true
      if (chunks.length === 0) {
        rejectBody(new HttpError(400, 'invalid-json', 'The request body must contain JSON.'))
        return
      }
      try {
        resolveBody(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        rejectBody(new HttpError(400, 'invalid-json', 'The request body is not valid JSON.'))
      }
    })
    request.on('aborted', () => {
      rejectOnce(new HttpError(400, 'request-aborted', 'The request body was interrupted.'))
    })
    request.on('error', () => {
      rejectOnce(new HttpError(400, 'request-read-failed', 'The request body could not be read.'))
    })
  })
}
