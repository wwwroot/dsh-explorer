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

export interface GitStatusEntry {
  path: string
  xy: string
}

export interface GitStatusResult {
  isRepo: boolean
  branch?: string
  entries: GitStatusEntry[]
}

export async function fetchTree(sessionId?: string, dir?: string): Promise<FsListing> {
  const params = new URLSearchParams()
  if (sessionId) params.set('sessionId', sessionId)
  if (dir) params.set('dir', dir)
  const res = await fetch(`/dsh-explorer/api/tree?${params.toString()}`)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`)
  }
  const json = await res.json()
  if (!json.ok) throw new Error(json.message || 'Failed to fetch directory')
  return json.listing
}

export async function fetchBatchTree(paths: string[]): Promise<Record<string, FsListing>> {
  const res = await fetch('/dsh-explorer/api/batch-tree', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paths }),
  })
  const json = await res.json()
  if (!json.ok) throw new Error(json.message || 'Failed to fetch batch trees')
  return json.results
}

export async function fetchGitStatus(sessionId?: string, dir?: string): Promise<GitStatusResult> {
  const params = new URLSearchParams()
  if (sessionId) params.set('sessionId', sessionId)
  if (dir) params.set('dir', dir)
  const res = await fetch(`/dsh-explorer/api/git-status?${params.toString()}`)
  const json = await res.json()
  if (!json.ok) return { isRepo: false, entries: [] }
  return json.git
}

export async function fetchFileContent(path: string): Promise<string> {
  const params = new URLSearchParams({ path })
  const res = await fetch(`/dsh-explorer/api/read-file?${params.toString()}`)
  const json = await res.json()
  if (!json.ok) throw new Error(json.message || 'Failed to read file')
  return json.text
}

export async function apiCreateNewFile(dir: string, name: string): Promise<{ path: string }> {
  const res = await fetch('/dsh-explorer/api/new-file', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dir, name }),
  })
  const json = await res.json()
  if (!json.ok) throw new Error(json.message || 'Failed to create file')
  return json
}

export async function apiCreateDirectory(dir: string, name: string): Promise<{ path: string }> {
  const res = await fetch('/dsh-explorer/api/mkdir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dir, name }),
  })
  const json = await res.json()
  if (!json.ok) throw new Error(json.message || 'Failed to create folder')
  return json
}

export async function apiRename(path: string, newName: string): Promise<{ oldPath: string; newPath: string }> {
  const res = await fetch('/dsh-explorer/api/rename', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, newName }),
  })
  const json = await res.json()
  if (!json.ok) throw new Error(json.message || 'Failed to rename')
  return json
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch('/dsh-explorer/api/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path }),
  })
  const json = await res.json()
  if (!json.ok) throw new Error(json.message || 'Failed to delete')
}

