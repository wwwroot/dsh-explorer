import { homedir } from 'node:os'
import type { Context } from './index.ts'

export function resolveSessionCwd(ctx: Context, sessionId?: string): string {
  try {
    const sessionService = (ctx.get('sessions') ?? (ctx as any).sessions) as unknown as {
      get?: (id: string) => { cwd?: string; workingDirectory?: string; header?: { cwd?: string } } | undefined
      list?: () => Array<{ cwd?: string; workingDirectory?: string; header?: { cwd?: string } }>
    } | undefined

    if (sessionService) {
      if (sessionId) {
        const direct = sessionService.get?.(sessionId)
        if (direct?.header?.cwd) return direct.header.cwd
        if (direct?.cwd) return direct.cwd
        if (direct?.workingDirectory) return direct.workingDirectory
      }

      // If no sessionId or direct session not found, pick the latest session
      if (typeof sessionService.list === 'function') {
        const all = sessionService.list()
        for (let i = all.length - 1; i >= 0; i--) {
          const s = all[i]
          if (s?.header?.cwd) return s.header.cwd
          if (s?.cwd) return s.cwd
          if (s?.workingDirectory) return s.workingDirectory
        }
      }
    }
  } catch {
    // Ignore and fallback
  }
  return homedir()
}

