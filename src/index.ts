import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Duplex } from 'node:stream'
import { Config, type ExplorerConfig } from './config.ts'
import { createFsWatcherServer } from './fs-watch.ts'
import { listDirectory, listDirectoryBatch } from './fs-tree.ts'
import { createDirectory, createNewFile, readFileText, removeEntry, renameEntry, writeUpload } from './fs-operations.ts'
import { getGitStatus } from './git-status.ts'
import { resolveTarget } from './path-security.ts'
import { resolveSessionCwd } from './session-path.ts'
import { readJsonBody, writeError, writeOk, writeJson, ExplorerError } from './wire.ts'

export interface Context {
  webServer: {
    register: (options: {
      path: string
      kind?: 'exact' | 'prefix'
      method?: string | string[]
      prefix?: boolean
      handler: (req: IncomingMessage, res: ServerResponse) => Promise<boolean | void> | boolean | void
    }) => () => void
    registerUpgrade: (options: {
      path: string
      prefix?: boolean
      handler: (req: IncomingMessage, socket: Duplex, head: Buffer) => Promise<boolean | void> | boolean | void
    }) => () => void
  }
  effect: (fn: () => void | (() => void)) => void
  get: (service: string) => unknown
}

export const name = 'dsh-explorer'
export const inject = ['webServer', 'sessions']
export { Config }

export function apply(ctx: Context, config?: ExplorerConfig): void {
  const watcher = createFsWatcherServer()

  ctx.effect(() => {
    return () => {
      watcher.close()
    }
  })

  // WebSocket upgrade
  ctx.effect(() => {
    return ctx.webServer.registerUpgrade({
      path: '/dsh-explorer/api/watch',
      handler: (req, socket, head) => {
        watcher.handleUpgrade(req, socket, head)
        return true
      },
    })
  })

  // HTTP Routes
  ctx.effect(() => {
    return ctx.webServer.register({
      kind: 'prefix',
      path: '/dsh-explorer/api',
      handler: async (req, res) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const pathname = url.pathname

        try {
          if (pathname === '/dsh-explorer/api/events') {
            const sessionId = url.searchParams.get('sessionId') ?? undefined
            const cwd = resolveSessionCwd(ctx, sessionId)
            const dirParam = url.searchParams.get('dir')
            const targetDir = resolveTarget(cwd, dirParam ?? cwd)
            watcher.handleSse(req, res, targetDir)
            return true
          }

          if (pathname === '/dsh-explorer/api/tree') {
            const sessionId = url.searchParams.get('sessionId') ?? undefined
            const cwd = resolveSessionCwd(ctx, sessionId)
            const dirParam = url.searchParams.get('dir')
            const targetDir = resolveTarget(cwd, dirParam ?? cwd)
            const max = config?.maxListingEntries ?? 2000
            const listing = await listDirectory(targetDir, max)
            writeOk(res, { listing })
            return true
          }

          if (pathname === '/dsh-explorer/api/batch-tree' && req.method === 'POST') {
            const body = await readJsonBody<{ paths: string[] }>(req)
            if (!Array.isArray(body?.paths)) {
              throw new ExplorerError('bad-request', 'paths must be an array', 400)
            }
            const results = await listDirectoryBatch(body.paths)
            writeOk(res, { results })
            return true
          }

          if (pathname === '/dsh-explorer/api/git-status') {
            const sessionId = url.searchParams.get('sessionId') ?? undefined
            const cwd = resolveSessionCwd(ctx, sessionId)
            const dirParam = url.searchParams.get('dir')
            const targetDir = resolveTarget(cwd, dirParam ?? cwd)
            const git = await getGitStatus(targetDir)
            writeOk(res, { git })
            return true
          }

          if (pathname === '/dsh-explorer/api/read-file') {
            const pathParam = url.searchParams.get('path')
            if (!pathParam) {
              throw new ExplorerError('bad-request', 'missing path parameter', 400)
            }
            const data = await readFileText(pathParam)
            writeOk(res, data)
            return true
          }

          if (pathname === '/dsh-explorer/api/new-file' && req.method === 'POST') {
            const body = await readJsonBody<{ dir: string; name: string }>(req)
            const created = await createNewFile(body.dir, body.name)
            writeOk(res, created)
            return true
          }

          if (pathname === '/dsh-explorer/api/mkdir' && req.method === 'POST') {
            const body = await readJsonBody<{ dir: string; name: string }>(req)
            const created = await createDirectory(body.dir, body.name)
            writeOk(res, created)
            return true
          }

          if (pathname === '/dsh-explorer/api/rename' && req.method === 'POST') {
            const body = await readJsonBody<{ path: string; newName: string }>(req)
            const renamed = await renameEntry(body.path, body.newName)
            writeOk(res, renamed)
            return true
          }

          if (pathname === '/dsh-explorer/api/delete' && req.method === 'POST') {
            const body = await readJsonBody<{ path: string }>(req)
            await removeEntry(body.path)
            writeOk(res)
            return true
          }

          if (pathname === '/dsh-explorer/api/upload' && req.method === 'POST') {
            const dirParam = url.searchParams.get('dir')
            const relParam = url.searchParams.get('relativePath')
            if (!dirParam || !relParam) {
              throw new ExplorerError('bad-request', 'dir and relativePath are required', 400)
            }
            const uploaded = await writeUpload(dirParam, relParam, req)
            writeOk(res, uploaded)
            return true
          }

          // Unhandled
          writeJson(res, { ok: false, message: 'Not found' }, 404)
          return true
        } catch (err) {
          writeError(res, err)
          return true
        }
      },
    })
  })
}

