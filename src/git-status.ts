import { execFile } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export interface GitStatusEntry {
  path: string
  xy: string
}

export interface GitStatusResult {
  isRepo: boolean
  branch?: string
  entries: GitStatusEntry[]
}

const gitCache = new Map<string, { at: number; data: GitStatusResult }>()
const GIT_CACHE_TTL_MS = 2000

const IGNORED_SCAN_DIRS = new Set([
  'node_modules',
  '.agent',
  '.git',
  'dist',
  'target',
  'build',
  '.system_generated',
  '.cache',
  '.dsh',
  '.gemini',
  '.vscode',
  '.idea',
])

function parsePorcelainLines(stdout: string, prefix = ''): { branch?: string; entries: GitStatusEntry[] } {
  let branch: string | undefined
  const entries: GitStatusEntry[] = []

  for (const rawLine of stdout.split('\n')) {
    const line = rawLine.replace(/\r$/, '')
    if (!line) continue
    if (line.startsWith('## ')) {
      const branchMatch = line.slice(3).match(/^([^.\s]+)/)
      if (branchMatch) branch = branchMatch[1]
      continue
    }
    if (line.length < 4) continue
    const xy = line.slice(0, 2)
    let p = line.slice(3).trim()
    if (p.startsWith('"') && p.endsWith('"')) {
      p = p.slice(1, -1)
    }
    // Handle renamed files: "R  old -> new"
    if (xy.startsWith('R') || xy.endsWith('R')) {
      const arrowIdx = p.indexOf(' -> ')
      if (arrowIdx !== -1) {
        p = p.slice(arrowIdx + 4).trim()
        if (p.startsWith('"') && p.endsWith('"')) {
          p = p.slice(1, -1)
        }
      }
    }
    const cleanPath = p.replace(/\\/g, '/')
    const finalPath = prefix ? `${prefix.replace(/\\/g, '/').replace(/\/+$/, '')}/${cleanPath}` : cleanPath
    entries.push({ path: finalPath, xy })
  }

  return { branch, entries }
}

function findSubRepos(root: string, depth = 1, maxDepth = 3): string[] {
  if (depth > maxDepth) return []
  const repos: string[] = []
  try {
    const entries = readdirSync(root, { withFileTypes: true })
    for (const ent of entries) {
      if (!ent.isDirectory() || ent.name.startsWith('.') || IGNORED_SCAN_DIRS.has(ent.name)) {
        continue
      }
      const full = join(root, ent.name)
      if (existsSync(join(full, '.git'))) {
        repos.push(full)
      } else {
        repos.push(...findSubRepos(full, depth + 1, maxDepth))
      }
    }
  } catch {
    // Ignore read errors
  }
  return repos
}

export async function getGitStatus(cwd: string): Promise<GitStatusResult> {
  const now = Date.now()
  const cached = gitCache.get(cwd)
  if (cached && now - cached.at < GIT_CACHE_TTL_MS) {
    return cached.data
  }

  // 1. Try running git directly in cwd
  try {
    const { stdout } = await execFileAsync(
      'git',
      ['status', '--porcelain', '-b', '-unormal', '--ignored=matching'],
      { cwd, maxBuffer: 10 * 1024 * 1024, timeout: 3500 }
    )

    const parsed = parsePorcelainLines(stdout)
    const data: GitStatusResult = {
      isRepo: true,
      branch: parsed.branch,
      entries: parsed.entries,
    }
    gitCache.set(cwd, { at: now, data })
    return data
  } catch {
    // cwd is not a git repo or direct command failed. Check for nested/sub repositories.
  }

  // 2. Discover sub-repositories within cwd (for workspaces containing multiple repos)
  try {
    const subRepos = findSubRepos(cwd)
    if (subRepos.length > 0) {
      const allEntries: GitStatusEntry[] = []
      const subResults = await Promise.all(
        subRepos.map(async (repoDir) => {
          const rel = relative(cwd, repoDir).replace(/\\/g, '/')
          try {
            const { stdout } = await execFileAsync(
              'git',
              ['status', '--porcelain', '-b', '-unormal', '--ignored=matching'],
              { cwd: repoDir, maxBuffer: 5 * 1024 * 1024, timeout: 3000 }
            )
            return parsePorcelainLines(stdout, rel).entries
          } catch {
            return []
          }
        })
      )

      for (const res of subResults) {
        allEntries.push(...res)
      }

      const data: GitStatusResult = {
        isRepo: true,
        entries: allEntries,
      }
      gitCache.set(cwd, { at: now, data })
      return data
    }
  } catch {
    // Ignore
  }

  const fallback: GitStatusResult = { isRepo: false, entries: [] }
  gitCache.set(cwd, { at: now, data: fallback })
  return fallback
}
