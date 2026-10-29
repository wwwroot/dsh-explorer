import type { IncomingMessage, ServerResponse } from 'node:http'

export class ExplorerError extends Error {
  readonly code: string
  readonly status: number

  constructor(code: string, message: string, status: number = 400) {
    super(message)
    this.name = 'ExplorerError'
    this.code = code
    this.status = status
  }
}

export function writeJson(res: ServerResponse, data: unknown, status = 200): void {
  const payload = JSON.stringify(data)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Cache-Control': 'no-store',
  })
  res.end(payload)
}

export function writeOk(res: ServerResponse, data: Record<string, unknown> = {}): void {
  writeJson(res, { ok: true, ...data })
}

export function writeError(res: ServerResponse, error: unknown): void {
  if (error instanceof ExplorerError) {
    writeJson(res, { ok: false, code: error.code, message: error.message }, error.status)
    return
  }
  const message = error instanceof Error ? error.message : String(error)
  writeJson(res, { ok: false, code: 'internal-error', message }, 500)
}

export async function readJsonBody<T = unknown>(req: IncomingMessage, limitBytes = 10 * 1024 * 1024): Promise<T> {
  const text = await readTextBody(req, limitBytes)
  if (!text.trim()) {
    throw new ExplorerError('bad-request', 'empty request body', 400)
  }
  try {
    return JSON.parse(text) as T
  } catch {
    throw new ExplorerError('bad-request', 'invalid json body', 400)
  }
}

export async function readTextBody(req: IncomingMessage, limitBytes = 10 * 1024 * 1024): Promise<string> {
  let size = 0
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buf.length
    if (size > limitBytes) {
      throw new ExplorerError('payload-too-large', `request body exceeded ${limitBytes} bytes`, 413)
    }
    chunks.push(buf)
  }
  return Buffer.concat(chunks).toString('utf-8')
}

