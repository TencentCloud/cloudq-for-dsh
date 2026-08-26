import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
import { HttpError } from './http.js'

const MAX_SCRIPT_OUTPUT_BYTES = 1024 * 1024

function safeCode(value) {
  return typeof value === 'string' && /^[a-zA-Z0-9._-]{1,80}$/.test(value)
    ? value
    : 'script-failed'
}

function redact(value, sensitiveValues) {
  let text = String(value ?? '')
  for (const sensitive of sensitiveValues) {
    if (sensitive) text = text.replaceAll(sensitive, '[redacted]')
  }
  return text.replace(/[\r\n\t]+/g, ' ').slice(0, 300)
}

/**
 * Run one bundled Python helper with bounded output and optional stdin.
 * @param {string} scriptsDirectory Absolute scripts directory.
 * @param {string} scriptName Bundled script filename.
 * @param {string[]} args Non-sensitive command-line arguments.
 * @param {object} options Execution options.
 * @returns {Promise<Record<string, unknown>>} Parsed helper response.
 */
export function runScript(
  scriptsDirectory,
  scriptName,
  args,
  {
    timeoutMs = 30_000,
    jsonOnly = true,
    stdin,
    sensitiveValues = [],
    spawnProcess = spawn,
  } = {},
) {
  return new Promise((resolveRun, rejectRun) => {
    const script = resolve(scriptsDirectory, scriptName)
    const child = spawnProcess('python3', [script, ...args], {
      stdio: [stdin === undefined ? 'ignore' : 'pipe', 'pipe', 'pipe'],
      timeout: timeoutMs,
    })
    let stdout = ''
    let stderr = ''
    let outputBytes = 0
    let settled = false

    const rejectOnce = (error) => {
      if (settled) return
      settled = true
      rejectRun(error)
    }
    const resolveOnce = (value) => {
      if (settled) return
      settled = true
      resolveRun(value)
    }
    const collect = (current, chunk) => {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
      outputBytes += buffer.byteLength
      if (outputBytes > MAX_SCRIPT_OUTPUT_BYTES) {
        child.kill()
        rejectOnce(new HttpError(502, 'script-output-too-large', 'The CloudQ helper returned too much data.'))
        return current
      }
      return current + buffer.toString('utf8')
    }

    child.stdout.on('data', (chunk) => {
      stdout = collect(stdout, chunk)
    })
    child.stderr.on('data', (chunk) => {
      stderr = collect(stderr, chunk)
    })
    child.on('error', () => {
      rejectOnce(new HttpError(502, 'script-launch-failed', 'The CloudQ helper could not be started.'))
    })
    child.on('close', (code) => {
      if (settled) return
      const trimmed = stdout.trim()
      if (!jsonOnly) {
        if (code !== 0) {
          rejectOnce(new HttpError(502, 'script-failed', 'The CloudQ helper failed.'))
        } else {
          resolveOnce({ success: true, message: redact(trimmed, sensitiveValues) })
        }
        return
      }

      let parsed
      try {
        parsed = trimmed ? JSON.parse(trimmed) : {}
      } catch {
        rejectOnce(new HttpError(502, 'script-invalid-output', 'The CloudQ helper returned an invalid response.'))
        return
      }
      if (code !== 0 || parsed?.ok === false || parsed?.success === false) {
        const codeValue = safeCode(parsed?.error?.code ?? parsed?.code)
        rejectOnce(new HttpError(502, codeValue, 'The CloudQ helper failed.'))
        return
      }
      resolveOnce(parsed)
    })

    if (stdin !== undefined) {
      child.stdin.on('error', () => {
        rejectOnce(new HttpError(502, 'script-input-failed', 'The CloudQ helper could not receive its input.'))
      })
      child.stdin.end(stdin)
    }
  })
}
