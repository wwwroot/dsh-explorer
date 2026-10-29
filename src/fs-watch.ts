import { watch, type FSWatcher } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Duplex } from 'node:stream'
import { invalidateDirectoryCache } from './fs-tree.ts'

interface Subscriber {
  send: (data: unknown) => void
  close: () => void
}

interface DirWatcher {
  watcher: FSWatcher
  subscribers: Set<Subscriber>
}

const dirWatchers = new Map<string, DirWatcher>()

function normalizeDirPath(d: string): string {
  return d.replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase()
}

function subscribeToDir(dir: string, subscriber: Subscriber): () => void {
  const norm = normalizeDirPath(dir)
  let entry = dirWatchers.get(norm)
  if (!entry) {
    try {
      const watcher = watch(dir, { recursive: true }, (eventType, filename) => {
        invalidateDirectoryCache()
        const payload = {
          event: eventType,
          filename: filename ? String(filename) : undefined,
          timestamp: Date.now(),
        }
        const current = dirWatchers.get(norm)
        if (current) {
          for (const sub of current.subscribers) {
            try {
              sub.send(payload)
            } catch {
              // ignore individual send failures
            }
          }
        }
      })
      entry = { watcher, subscribers: new Set() }
      dirWatchers.set(norm, entry)
    } catch (err) {
      console.warn('[dsh-explorer] recursive watch failed on', dir, err)
    }
  }

  if (entry) {
    entry.subscribers.add(subscriber)
  }

  return () => {
    if (entry) {
      entry.subscribers.delete(subscriber)
      if (entry.subscribers.size === 0) {
        try {
          entry.watcher.close()
        } catch {}
        dirWatchers.delete(norm)
      }
    }
  }
}

export function createFsWatcherServer(): {
  handleSse: (req: IncomingMessage, res: ServerResponse, dir: string) => void
  handleUpgrade: (req: IncomingMessage, socket: Duplex, head: Buffer) => void
  close: () => void
} {
  let wssPromise: Promise<any> | null = null

  const getWss = async () => {
    if (!wssPromise) {
      wssPromise = (async () => {
        try {
          const wsModule: any = await import('ws')
          const Server = wsModule.WebSocketServer ?? wsModule.default?.WebSocketServer
          if (!Server) return null

          const server = new Server({ noServer: true })
          server.on('connection', (ws: any, req: IncomingMessage) => {
            const url = new URL(req.url ?? '/', 'http://localhost')
            const dir = url.searchParams.get('dir')
            if (!dir) {
              ws.close(1008, 'missing dir parameter')
              return
            }

            const subscriber: Subscriber = {
              send: (data) => {
                if (ws.readyState === 1) { // 1 = OPEN
                  ws.send(JSON.stringify(data))
                }
              },
              close: () => {
                try { ws.close() } catch {}
              },
            }

            const unsubscribe = subscribeToDir(dir, subscriber)
            ws.on('close', () => {
              unsubscribe()
            })
          })
          return server
        } catch {
          return null
        }
      })()
    }
    return wssPromise
  }

  return {
    handleSse: (req: IncomingMessage, res: ServerResponse, dir: string) => {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      })
      res.write(`data: ${JSON.stringify({ type: 'connected', dir, timestamp: Date.now() })}\n\n`)

      const subscriber: Subscriber = {
        send: (data) => {
          try {
            res.write(`data: ${JSON.stringify(data)}\n\n`)
          } catch {
            // Socket write failed
          }
        },
        close: () => {
          try { res.end() } catch {}
        },
      }

      const unsubscribe = subscribeToDir(dir, subscriber)

      req.on('close', () => {
        unsubscribe()
      })
    },

    handleUpgrade: (req: IncomingMessage, socket: Duplex, head: Buffer) => {
      getWss().then((server) => {
        if (server) {
          server.handleUpgrade(req, socket, head, (ws: any) => {
            server.emit('connection', ws, req)
          })
        } else {
          socket.destroy()
        }
      }).catch(() => {
        socket.destroy()
      })
    },

    close: () => {
      for (const entry of dirWatchers.values()) {
        for (const sub of entry.subscribers) {
          sub.close()
        }
        try {
          entry.watcher.close()
        } catch {}
      }
      dirWatchers.clear()
      if (wssPromise) {
        wssPromise.then((server) => {
          try { server?.close() } catch {}
        })
      }
    },
  }
}
