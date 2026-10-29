import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { ExplorerError } from './wire.ts'

export interface CompactSegment {
  name: string
  path: string
}

export interface FsEntry {
  name: string
  path: string
  isDir: boolean
  hidden: boolean
  isSymlink: boolean
  broken: boolean
  compact?: boolean
  compactName?: string
  compactPath?: string
  compactChain?: CompactSegment[]
}

export interface FsListing {
  path: string
  entries: FsEntry[]
  truncated: boolean
}

export function compareEntries(a: FsEntry, b: FsEntry): number {
  if (a.isDir !== b.isDir) return a.isDir ? -1 : 1
  const la = a.name.toLowerCase()
  const lb = b.name.toLowerCase()
  if (la !== lb) return la < lb ? -1 : 1
  if (a.name === b.name) return 0
  return a.name < b.name ? -1 : 1
}

const directoryCache = new Map<string, { at: number; listing: FsListing }>()
const DIRECTORY_CACHE_TTL_MS = 300

export function invalidateDirectoryCache(_dir?: string): void {
  directoryCache.clear()
}

export async function listDirectory(dirPath: string, maxEntries = 2000): Promise<FsListing> {
  const now = Date.now()
  const key = `${dirPath}\0${maxEntries}`
  const cached = directoryCache.get(key)
  if (cached && now - cached.at < DIRECTORY_CACHE_TTL_MS) {
    return cached.listing
  }

  let dirEnts
  try {
    dirEnts = await readdir(dirPath, { withFileTypes: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    throw new ExplorerError('not-found', `cannot read directory "${dirPath}": ${message}`, 404)
  }

  const entries: FsEntry[] = []
  const truncated = dirEnts.length > maxEntries
  const slice = truncated ? dirEnts.slice(0, maxEntries) : dirEnts

  for (const dirent of slice) {
    const name = dirent.name
    const fullPath = join(dirPath, name)
    const isSymlink = dirent.isSymbolicLink()
    let isDir = dirent.isDirectory()
    let broken = false

    if (isSymlink) {
      try {
        const targetStat = await stat(fullPath)
        isDir = targetStat.isDirectory()
      } catch {
        broken = true
      }
    }

    const hidden = name.startsWith('.')
    let compact = false
    let compactName: string | undefined = undefined
    let compactPath: string | undefined = undefined
    let compactChain: CompactSegment[] | undefined = undefined

    // If it's a directory, resolve single-child directory chains for compact folding
    if (isDir && !isSymlink) {
      try {
        let currPath = fullPath
        const chain: CompactSegment[] = [{ name, path: fullPath }]
        let depth = 0
        while (depth < 6) {
          const sub = await readdir(currPath, { withFileTypes: true })
          const visibleSub = sub.filter((s) => !s.name.startsWith('.'))
          if (visibleSub.length === 1 && visibleSub[0]!.isDirectory() && !visibleSub[0]!.isSymbolicLink()) {
            const childName = visibleSub[0]!.name
            currPath = join(currPath, childName)
            chain.push({ name: childName, path: currPath })
            depth++
          } else {
            break
          }
        }
        if (chain.length > 1) {
          compact = true
          compactName = chain.map((c) => c.name).join('/')
          compactPath = currPath
          compactChain = chain
        }
      } catch {
        // Ignore read errors for child probe
      }
    }

    entries.push({
      name,
      path: fullPath,
      isDir,
      hidden,
      isSymlink,
      broken,
      compact,
      compactName,
      compactPath,
      compactChain,
    })
  }

  entries.sort(compareEntries)

  const listing: FsListing = {
    path: dirPath,
    entries,
    truncated,
  }

  directoryCache.set(key, { at: now, listing })
  return listing
}

export async function listDirectoryBatch(paths: string[], maxEntriesPerDir = 1000): Promise<Record<string, FsListing>> {
  const result: Record<string, FsListing> = {}
  await Promise.all(
    paths.map(async (p) => {
      try {
        result[p] = await listDirectory(p, maxEntriesPerDir)
      } catch {
        // Individual directory failures don't fail the whole batch
      }
    })
  )
  return result
}

