import { homedir } from 'node:os'
import { isAbsolute, normalize, resolve } from 'node:path'
import { ExplorerError } from './wire.ts'

export function resolveTarget(cwd: string, targetPath: string): string {
  if (!targetPath) return cwd
  if (targetPath === '~' || targetPath.startsWith('~/') || targetPath.startsWith('~\\')) {
    const home = homedir()
    return normalize(resolve(home, targetPath.slice(targetPath.startsWith('~') ? (targetPath[1] ? 2 : 1) : 0)))
  }
  if (isAbsolute(targetPath)) {
    return normalize(targetPath)
  }
  return normalize(resolve(cwd, targetPath))
}

export function assertSingleSegmentName(name: string): void {
  if (!name || name === '.' || name === '..' || name.includes('/') || name.includes('\\')) {
    throw new ExplorerError('bad-request', 'name must be a single path segment without separators', 400)
  }
}

