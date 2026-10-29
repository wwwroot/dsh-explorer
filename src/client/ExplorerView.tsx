import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import css from './explorer.module.css'
import {
  fetchTree,
  fetchBatchTree,
  fetchGitStatus,
  apiCreateNewFile,
  apiCreateDirectory,
  apiRename,
  apiDelete,
  fetchFileContent,
  type FsEntry,
  type FsListing,
  type GitStatusResult,
} from './api.ts'
import { ExplorerHeader } from './ExplorerHeader.tsx'
import { ExplorerSearch } from './ExplorerSearch.tsx'
import { ExplorerRow } from './ExplorerRow.tsx'
import { ExplorerContextMenu } from './ExplorerContextMenu.tsx'
import { ExplorerOptionsModal } from './ExplorerOptionsModal.tsx'
import {
  loadExplorerOptions,
  saveExplorerOptions,
  DEFAULT_OPTIONS,
  type ExplorerOptions,
} from './options.ts'
import {
  insertMentionToComposer,
  insertSnippetToComposer,
  setLastKnownSessionId,
  baseName,
} from './conversation-draft.ts'

interface ExplorerViewProps {
  ctx: any
  sessionId?: string
  initialCwd?: string
}

function safeService<T = any>(ctx: any, name: string): T | undefined {
  if (!ctx) return undefined
  try {
    if (typeof ctx.get === 'function') {
      const val = ctx.get(name)
      if (val !== undefined) return val
    }
    return ctx[name]
  } catch {
    return undefined
  }
}

export function openFileInTab(ctx: any, sessionId: string, filePath: string, relPath: string): void {
  const normPath = filePath.replace(/\\/g, '/')
  const fileName = baseName(filePath)

  // 1. Try DSH betterSidebar editor tab
  try {
    const betterSidebar = safeService(ctx, 'betterSidebar')
    if (betterSidebar && typeof betterSidebar.openTab === 'function') {
      betterSidebar.openTab({
        type: 'editor',
        title: fileName,
        path: filePath,
        id: `editor:${filePath}`,
      })
      return
    }
  } catch {}

  // 2. Try native DSH sidebarRight tab opener
  try {
    const sidebarRight = safeService(ctx, 'sidebarRight')
    if (sidebarRight && typeof sidebarRight.openResource === 'function') {
      const normRel = relPath.replace(/\\/g, '/')
      const encodePath = (p: string) =>
        p
          .split('/')
          .map((seg) => encodeURIComponent(seg).replace(/%3A/gi, ':'))
          .join('/')
      const address = sessionId
        ? `dsh-resource://file/session/${encodeURIComponent(sessionId)}/${encodePath(normRel)}`
        : `dsh-resource://file/absolute/${encodePath(normPath.replace(/^\/+/, ''))}`
      sidebarRight.openResource(address)
      return
    }
  } catch {}

  // 3. Try tabs / editor service if registered
  try {
    const tabs = safeService(ctx, 'tabs')
    if (tabs && typeof tabs.open === 'function') {
      tabs.open({ path: filePath, title: fileName })
      return
    }
  } catch {}

  // 4. Try native host openWorkspacePath if native desktop
  try {
    const remote = ctx?.remote?.session
    if (remote && typeof remote.openWorkspacePath === 'function') {
      remote.openWorkspacePath({ path: filePath })
      return
    }
  } catch {}

  // 5. Fallback: open file in new browser window/tab
  try {
    window.open(`/dsh-explorer/api/read-file?path=${encodeURIComponent(filePath)}`, '_blank')
  } catch {}
}

interface TreeNodeProps {
  entry: FsEntry
  depth: number
  parentDir: string
  rootPath: string
  levels: Record<string, FsListing>
  expanded: Set<string>
  selected: Set<string>
  focusedPath: string | null
  gitStatusMap: Map<string, string>
  filterText: string
  creating: { parentDir: string; isDir: boolean } | null
  creatingName: string
  createInputRef: React.RefObject<HTMLInputElement>
  options: ExplorerOptions
  indentStep: number
  iconSize: number
  reloadDirectory: (dir: string) => Promise<void>
  onToggle: (path: string) => void
  onSelect: (path: string, e: React.MouseEvent) => void
  onOpenFile: (filePath: string, relPath: string) => void
  onContextMenu: (entry: FsEntry, relPath: string, e: React.MouseEvent) => void
  onInsertReference: (relPath: string, isDir: boolean) => void
  onCopyRelativePath: (relPath: string) => void
  onRenameSubmit: (path: string, newName: string) => void
  onDelete: (entry: FsEntry) => void
  onCreatingNameChange: (val: string) => void
  onCreatingKeyDown: (e: React.KeyboardEvent) => void
  onCreatingBlur: () => void
  getRelativePath: (path: string) => string
}

const TreeNode: React.FC<TreeNodeProps> = React.memo(({
  entry,
  depth,
  rootPath,
  levels,
  expanded,
  selected,
  focusedPath,
  gitStatusMap,
  filterText,
  creating,
  creatingName,
  createInputRef,
  options,
  indentStep,
  iconSize,
  reloadDirectory,
  onToggle,
  onSelect,
  onOpenFile,
  onContextMenu,
  onInsertReference,
  onCopyRelativePath,
  onRenameSubmit,
  onDelete,
  onCreatingNameChange,
  onCreatingKeyDown,
  onCreatingBlur,
  getRelativePath,
}) => {
  const relPath = getRelativePath(entry.path)
  const normPath = entry.path.replace(/\\/g, '/')
  const listing = levels[entry.path] ?? levels[normPath]
  const hasLoaded = listing !== undefined

  // Hidden files filter
  if (!options.showHiddenFiles && (entry.hidden || entry.name.startsWith('.'))) {
    return null
  }

  // Filter check
  if (filterText) {
    const selfMatches =
      entry.name.toLowerCase().includes(filterText.toLowerCase()) ||
      relPath.toLowerCase().includes(filterText.toLowerCase())
    if (!selfMatches && !entry.isDir) {
      return null
    }
  }

  // Dynamically resolve compact chain from loaded levels (and entry.compactChain if present)
  const compactChain = useMemo(() => {
    if (!options.compactFolders || !entry.isDir) return undefined
    const chain: FsEntry[] = [entry]
    let curr = entry
    let currListing = levels[curr.path] ?? levels[curr.path.replace(/\\/g, '/')]

    while (currListing && currListing.entries) {
      const valid = options.showHiddenFiles
        ? currListing.entries
        : currListing.entries.filter((c) => !c.hidden && !c.name.startsWith('.'))
      if (valid.length === 1 && valid[0]!.isDir) {
        const next = valid[0]!
        chain.push(next)
        curr = next
        currListing = levels[curr.path] ?? levels[curr.path.replace(/\\/g, '/')]
      } else {
        break
      }
    }

    return chain.length > 1 ? chain : undefined
  }, [options.compactFolders, options.showHiddenFiles, entry, levels])

  const isCompacted = compactChain !== undefined && compactChain.length > 1
  const effectiveEntry = isCompacted ? compactChain[compactChain.length - 1]! : entry
  const targetPath = effectiveEntry.path
  const targetRelPath = getRelativePath(targetPath)
  const isExpanded = entry.isDir && (expanded.has(entry.path) || expanded.has(targetPath) || Boolean(filterText))
  const isSel = selected.has(entry.path) || selected.has(targetPath)
  const isFoc = focusedPath === entry.path || focusedPath === targetPath
  const normRel = targetRelPath.replace(/\\/g, '/').toLowerCase()
  const status =
    gitStatusMap.get(normRel) ??
    gitStatusMap.get(targetPath.replace(/\\/g, '/').toLowerCase()) ??
    gitStatusMap.get(relPath.replace(/\\/g, '/').toLowerCase())

  // Target directory listing for compact folders
  const targetListing = levels[targetPath] ?? levels[targetPath.replace(/\\/g, '/')]
  const hasTargetLoaded = targetListing !== undefined

  // Pre-load innermost folder if compact and expanded, or single-child probe
  useEffect(() => {
    if (isExpanded && targetPath !== entry.path && !hasTargetLoaded) {
      reloadDirectory(targetPath)
    }
  }, [isExpanded, targetPath, entry.path, hasTargetLoaded, reloadDirectory])

  // Pre-load single-child directories when compactFolders is enabled
  useEffect(() => {
    if (options.compactFolders && entry.isDir && entry.compact && !hasLoaded) {
      reloadDirectory(entry.path)
    }
  }, [options.compactFolders, entry.isDir, entry.compact, hasLoaded, entry.path, reloadDirectory])

  const handleToggle = () => {
    if (isCompacted && targetPath !== entry.path) {
      const isCurrentlyExpanded = expanded.has(entry.path) || expanded.has(targetPath)
      if (isCurrentlyExpanded) {
        if (expanded.has(entry.path)) onToggle(entry.path)
        if (expanded.has(targetPath)) onToggle(targetPath)
      } else {
        onToggle(entry.path)
        onToggle(targetPath)
      }
    } else {
      onToggle(entry.path)
    }
  }

  if (!entry.isDir) {
    return (
      <ExplorerRow
        entry={entry}
        depth={depth}
        isExpanded={false}
        isSelected={isSel}
        isFocused={isFoc}
        gitStatus={status}
        relativePath={relPath}
        indentStep={indentStep}
        iconSize={iconSize}
        enableMotion={options.enableMotion}
        showGitBadges={options.showGitBadges}
        compactFolders={options.compactFolders}
        singleClickAction={options.singleClickAction}
        onToggle={() => {}}
        onSelect={(e) => onSelect(entry.path, e)}
        onDoubleClick={() => onOpenFile(entry.path, relPath)}
        onContextMenu={(e) => onContextMenu(entry, relPath, e)}
        onInsertReference={() => onInsertReference(relPath, false)}
        onCopyRelativePath={() => onCopyRelativePath(relPath)}
        onRenameSubmit={(newName) => onRenameSubmit(entry.path, newName)}
        onDelete={() => onDelete(entry)}
      />
    )
  }

  const visibleChildren = hasTargetLoaded && targetListing.entries
    ? options.showHiddenFiles
      ? targetListing.entries
      : targetListing.entries.filter((c) => !c.hidden && !c.name.startsWith('.'))
    : []

  return (
    <div className={css.folderGroup}>
      <ExplorerRow
        entry={entry}
        depth={depth}
        isExpanded={isExpanded}
        isSelected={isSel}
        isFocused={isFoc}
        gitStatus={status}
        relativePath={targetRelPath}
        compactChain={compactChain}
        indentStep={indentStep}
        iconSize={iconSize}
        enableMotion={options.enableMotion}
        showGitBadges={options.showGitBadges}
        compactFolders={options.compactFolders}
        singleClickAction={options.singleClickAction}
        onToggle={handleToggle}
        onSelect={(e) => onSelect(targetPath, e)}
        onContextMenu={(e) => onContextMenu(entry, targetRelPath, e)}
        onInsertReference={() => onInsertReference(targetRelPath, true)}
        onCopyRelativePath={() => onCopyRelativePath(targetRelPath)}
        onRenameSubmit={(newName) => onRenameSubmit(entry.path, newName)}
        onDelete={() => onDelete(entry)}
      />

      <div
        className={`${css.folderChildren} ${isExpanded ? css.folderChildrenOpen : css.folderChildrenClosed}`}
        style={!options.enableMotion ? { transition: 'none' } : undefined}
      >
        <div className={css.folderChildrenInner}>
          {creating && (creating.parentDir === entry.path || creating.parentDir === targetPath) && (
            <div className={css.row} style={{ paddingLeft: `${(depth + 1) * indentStep + 8}px` }}>
              <span className={css.iconWrap}>{creating.isDir ? '📁' : '📄'}</span>
              <input
                ref={createInputRef}
                autoFocus
                type="text"
                className={css.inlineInput}
                placeholder={creating.isDir ? 'Folder name...' : 'File name...'}
                value={creatingName}
                onChange={(e) => onCreatingNameChange(e.target.value)}
                onKeyDown={onCreatingKeyDown}
                onBlur={onCreatingBlur}
              />
            </div>
          )}
          {visibleChildren.length > 0 ? (
            visibleChildren.map((child) => (
              <TreeNode
                key={child.path}
                entry={child}
                depth={depth + 1}
                parentDir={targetPath}
                rootPath={rootPath}
                levels={levels}
                expanded={expanded}
                selected={selected}
                focusedPath={focusedPath}
                gitStatusMap={gitStatusMap}
                filterText={filterText}
                creating={creating}
                creatingName={creatingName}
                createInputRef={createInputRef}
                options={options}
                indentStep={indentStep}
                iconSize={iconSize}
                reloadDirectory={reloadDirectory}
                onToggle={onToggle}
                onSelect={onSelect}
                onOpenFile={onOpenFile}
                onContextMenu={onContextMenu}
                onInsertReference={onInsertReference}
                onCopyRelativePath={onCopyRelativePath}
                onRenameSubmit={onRenameSubmit}
                onDelete={onDelete}
                onCreatingNameChange={onCreatingNameChange}
                onCreatingKeyDown={onCreatingKeyDown}
                onCreatingBlur={onCreatingBlur}
                getRelativePath={getRelativePath}
              />
            ))
          ) : hasTargetLoaded && targetListing.entries && targetListing.entries.length === 0 ? (
            <div
              className={css.row}
              style={{
                paddingLeft: `${(depth + 1) * indentStep + 8}px`,
                opacity: 0.45,
                fontStyle: 'italic',
                fontSize: '12px',
              }}
            >
              Empty folder
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
})

export const ExplorerView: React.FC<ExplorerViewProps> = ({ ctx, sessionId, initialCwd }) => {
  const [rootPath, setRootPath] = useState<string>(initialCwd ?? '')
  const [levels, setLevels] = useState<Record<string, FsListing>>({})
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [focusedPath, setFocusedPath] = useState<string | null>(null)
  const [filterText, setFilterText] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [options, setOptions] = useState<ExplorerOptions>(() => loadExplorerOptions())
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [gitData, setGitData] = useState<GitStatusResult>({ isRepo: false, entries: [] })
  const [creating, setCreating] = useState<{ parentDir: string; isDir: boolean } | null>(null)
  const [creatingName, setCreatingName] = useState('')
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    entry: FsEntry
    relativePath: string
  } | null>(null)

  const treeBodyRef = useRef<HTMLDivElement>(null)
  const createInputRef = useRef<HTMLInputElement>(null)

  const handleUpdateOptions = useCallback((patch: Partial<ExplorerOptions>) => {
    setOptions((prev) => {
      const next = { ...prev, ...patch }
      saveExplorerOptions(next)
      return next
    })
  }, [])

  const handleResetOptions = useCallback(() => {
    setOptions({ ...DEFAULT_OPTIONS })
    saveExplorerOptions({ ...DEFAULT_OPTIONS })
  }, [])

  // Calculate dynamic scale metrics
  const baseRowHeight = options.density === 'compact' ? 20 : options.density === 'relaxed' ? 28 : 24
  const baseFontSize = options.density === 'compact' ? 11.5 : options.density === 'relaxed' ? 14 : 13
  const baseIconSize = options.density === 'compact' ? 14 : options.density === 'relaxed' ? 18 : 16
  const baseIndent = options.density === 'compact' ? 12 : options.density === 'relaxed' ? 20 : 16

  const rowHeight = Math.round(baseRowHeight * options.scale)
  const fontSize = Math.round(baseFontSize * options.scale)
  const iconSize = Math.round(baseIconSize * options.scale)
  const indentStep = Math.round(baseIndent * options.scale)

  const containerStyles = useMemo(
    () =>
      ({
        '--dsh-row-height': `${rowHeight}px`,
        '--dsh-font-size': `${fontSize}px`,
        '--dsh-icon-size': `${iconSize}px`,
        '--dsh-scale': `${options.scale}`,
      } as React.CSSProperties),
    [rowHeight, fontSize, iconSize, options.scale]
  )

  useEffect(() => {
    if (sessionId) {
      setLastKnownSessionId(sessionId)
    }
  }, [sessionId])

  // Resolve active session root if not provided
  useEffect(() => {
    if (rootPath) return
    const sessions = safeService(ctx, 'sessions')
    const snapshot = sessions?.list?.getSnapshot?.()
    const activeId = sessionId ?? sessions?.active?.id ?? sessions?.current?.id ?? snapshot?.ids?.[0]

    if (activeId && snapshot?.byId?.[activeId]?.cwd) {
      setRootPath(snapshot.byId[activeId].cwd)
      return
    }

    if (snapshot?.byId) {
      const first = Object.values(snapshot.byId).find((s: any) => s?.cwd) as any
      if (first?.cwd) {
        setRootPath(first.cwd)
        return
      }
    }

    const workspaces = safeService(ctx, 'workspaces')
    const ws = workspaces?.list?.getSnapshot?.()
    const item = ws?.items?.find((w: any) => w.sessionIds?.includes(activeId)) ?? ws?.items?.[0]
    if (item?.path) {
      setRootPath(item.path)
      return
    }

    setLoading(true)
    fetchTree(activeId)
      .then((listing) => {
        const normPath = listing.path.replace(/\\/g, '/')
        setRootPath(listing.path)
        setLevels((prev) => ({
          ...prev,
          [listing.path]: listing,
          [normPath]: listing,
        }))
        setExpanded((prev) => new Set(prev).add(listing.path))
      })
      .catch((err) => {
        console.warn('[dsh-explorer] root fetchTree error:', err)
        setErrorMessage(err?.message || 'Failed to connect to file service')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [rootPath, sessionId, ctx])

  const reloadDirectory = useCallback(
    async (dir: string) => {
      setLoading(true)
      setErrorMessage(null)
      const normDir = dir.replace(/\\/g, '/')
      try {
        const sessions = safeService(ctx, 'sessions')
        const snapshot = sessions?.list?.getSnapshot?.()
        const activeId = sessionId ?? sessions?.active?.id ?? snapshot?.ids?.[0]
        const listing = await fetchTree(activeId, dir)

        if (listing) {
          const normListingPath = listing.path.replace(/\\/g, '/')
          setLevels((prev) => ({
            ...prev,
            [dir]: listing,
            [normDir]: listing,
            [listing.path]: listing,
            [normListingPath]: listing,
          }))
        }
      } catch (err: any) {
        console.warn('[dsh-explorer] failed to load dir:', dir, err)
        setErrorMessage(err?.message || 'Failed to load directory')
      } finally {
        setLoading(false)
      }
    },
    [sessionId, ctx]
  )

  const reloadGit = useCallback(
    async (dir: string) => {
      try {
        const sessions = safeService(ctx, 'sessions')
        const activeId = sessionId ?? sessions?.active?.id
        const git = await fetchGitStatus(activeId, dir)
        setGitData(git)
      } catch {
        // Ignore
      }
    },
    [sessionId, ctx]
  )

  const expandedRef = useRef(expanded)
  useEffect(() => {
    expandedRef.current = expanded
  }, [expanded])

  const refreshAll = useCallback(async () => {
    if (!rootPath) return
    const currentExpanded = Array.from(expandedRef.current)
    const dirsToRefresh = Array.from(new Set([rootPath, ...currentExpanded]))
    try {
      const [batch, rootListing] = await Promise.all([
        fetchBatchTree(dirsToRefresh).catch(() => ({} as Record<string, FsListing>)),
        fetchTree(sessionId, rootPath).catch(() => null),
      ])
      const mergedBatch: Record<string, FsListing> = { ...batch }
      if (rootListing) {
        mergedBatch[rootPath] = rootListing
        if (rootListing.path) mergedBatch[rootListing.path] = rootListing
      }

      setLevels((prev) => {
        const next = { ...prev }
        for (const [dirKey, listing] of Object.entries(mergedBatch)) {
          if (!listing) continue
          const norm = dirKey.replace(/\\/g, '/')
          next[dirKey] = listing
          next[norm] = listing
          if (listing.path) {
            next[listing.path] = listing
            next[listing.path.replace(/\\/g, '/')] = listing
          }
        }
        for (const path of dirsToRefresh) {
          const norm = path.replace(/\\/g, '/')
          if (!mergedBatch[path] && !mergedBatch[norm] && path !== rootPath) {
            delete next[path]
            delete next[norm]
          }
        }
        return next
      })

      setExpanded((prev) => {
        let changed = false
        const next = new Set(prev)
        for (const expPath of prev) {
          if (expPath === rootPath) continue
          const normExp = expPath.replace(/\\/g, '/')
          if (!mergedBatch[expPath] && !mergedBatch[normExp]) {
            next.delete(expPath)
            changed = true
          }
        }
        return changed ? next : prev
      })

      reloadGit(rootPath)
    } catch (err) {
      console.warn('[dsh-explorer] refreshAll failed:', err)
    }
  }, [rootPath, sessionId, reloadGit])

  useEffect(() => {
    if (!rootPath) return
    refreshAll()
    setExpanded((prev) => new Set(prev).add(rootPath))
  }, [rootPath, refreshAll])

  // Live real-time synchronizer (SSE stream + WebSocket + Window focus + Heartbeat)
  useEffect(() => {
    if (!rootPath) return

    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const scheduleRefresh = () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        refreshAll()
      }, 100)
    }

    // 1. Primary: Server-Sent Events (SSE) native stream
    let es: EventSource | null = null
    try {
      const sseUrl = `/dsh-explorer/api/events?dir=${encodeURIComponent(rootPath)}`
      es = new EventSource(sseUrl)
      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data)
          if (data.type === 'connected') return
        } catch {}
        scheduleRefresh()
      }
    } catch (err) {
      console.warn('[dsh-explorer] SSE init error:', err)
    }

    // 2. Secondary: WebSocket fallback / complement
    let ws: WebSocket | null = null
    try {
      const loc = window.location
      const host = loc.host || (loc.port ? `127.0.0.1:${loc.port}` : '127.0.0.1')
      const wsProtocol = loc.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${wsProtocol}//${host}/dsh-explorer/api/watch?dir=${encodeURIComponent(rootPath)}`
      ws = new WebSocket(wsUrl)
      ws.onmessage = () => {
        scheduleRefresh()
      }
    } catch {
      // Ignore ws errors
    }

    // 3. Window focus and visibility listeners (immediate sync on returning to DSH)
    const onFocus = () => {
      scheduleRefresh()
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        scheduleRefresh()
      }
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibilityChange)

    // 4. Fallback periodic sync (every 3 seconds when document is visible)
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        scheduleRefresh()
      }
    }, 3000)

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      if (es) {
        try { es.close() } catch {}
      }
      if (ws) {
        try { ws.close() } catch {}
      }
    }
  }, [rootPath, refreshAll])

  const toggleExpand = useCallback(
    async (path: string) => {
      setExpanded((prev) => {
        const next = new Set(prev)
        if (next.has(path)) {
          next.delete(path)
        } else {
          next.add(path)
          const norm = path.replace(/\\/g, '/')
          if (!levels[path] && !levels[norm]) {
            reloadDirectory(path)
          }
        }
        return next
      })
    },
    [levels, reloadDirectory]
  )

  const getRelativePath = useCallback(
    (fullPath: string): string => {
      if (!rootPath) return fullPath
      const normRoot = rootPath.replace(/\\/g, '/').replace(/\/+$/, '')
      const normTarget = fullPath.replace(/\\/g, '/')
      if (normTarget.toLowerCase().startsWith(`${normRoot.toLowerCase()}/`)) {
        return normTarget.slice(normRoot.length + 1)
      }
      return fullPath
    },
    [rootPath]
  )

  const gitStatusMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const entry of gitData.entries) {
      const p = entry.path.replace(/\\/g, '/').toLowerCase()
      map.set(p, entry.xy)

      // Bubble up to ancestor folders so parent directories reflect modified/untracked state
      let parent = p
      while (true) {
        const lastSlash = parent.lastIndexOf('/')
        if (lastSlash === -1) break
        parent = parent.slice(0, lastSlash)
        if (!parent) break
        const existing = map.get(parent)
        if (!existing) {
          map.set(parent, entry.xy)
        } else if (entry.xy.includes('M') && !existing.includes('M')) {
          map.set(parent, ' M')
        }
      }
    }
    return map
  }, [gitData])

  // Flattened array of currently visible rows for keyboard navigation
  const visibleFlatRows = useMemo(() => {
    const normRoot = rootPath.replace(/\\/g, '/')
    const rootListing = levels[rootPath] ?? levels[normRoot]
    if (!rootPath || !rootListing) return []
    const rows: { entry: FsEntry; relativePath: string }[] = []

    const walk = (dir: string) => {
      const normD = dir.replace(/\\/g, '/')
      const listing = levels[dir] ?? levels[normD]
      if (!listing) return

      for (const entry of listing.entries) {
        if (!options.showHiddenFiles && (entry.hidden || entry.name.startsWith('.'))) {
          continue
        }
        const rel = getRelativePath(entry.path)
        if (filterText) {
          const match =
            entry.name.toLowerCase().includes(filterText.toLowerCase()) ||
            rel.toLowerCase().includes(filterText.toLowerCase())
          if (!match && !entry.isDir) continue
        }

        if (options.compactFolders && entry.isDir) {
          const chain = [entry]
          let curr = entry
          let currL = levels[curr.path] ?? levels[curr.path.replace(/\\/g, '/')]
          while (currL && currL.entries) {
            const valid = options.showHiddenFiles
              ? currL.entries
              : currL.entries.filter((c) => !c.hidden && !c.name.startsWith('.'))
            if (valid.length === 1 && valid[0]!.isDir) {
              const next = valid[0]!
              chain.push(next)
              curr = next
              currL = levels[curr.path] ?? levels[curr.path.replace(/\\/g, '/')]
            } else {
              break
            }
          }
          if (chain.length > 1) {
            const compactRel = getRelativePath(curr.path)
            rows.push({ entry: curr, relativePath: compactRel })
            if (expanded.has(entry.path) || expanded.has(curr.path) || Boolean(filterText)) {
              walk(curr.path)
            }
            continue
          }
        }

        rows.push({ entry, relativePath: rel })

        if (entry.isDir && (expanded.has(entry.path) || Boolean(filterText))) {
          walk(entry.path)
        }
      }
    }

    walk(rootPath)
    return rows
  }, [rootPath, levels, expanded, filterText, getRelativePath, options.showHiddenFiles, options.compactFolders])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (visibleFlatRows.length === 0) return
    const currentIndex = visibleFlatRows.findIndex((r) => r.entry.path === focusedPath)

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextIndex = currentIndex < visibleFlatRows.length - 1 ? currentIndex + 1 : 0
      const nextRow = visibleFlatRows[nextIndex]
      if (nextRow) {
        setFocusedPath(nextRow.entry.path)
        setSelected(new Set([nextRow.entry.path]))
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : visibleFlatRows.length - 1
      const prevRow = visibleFlatRows[prevIndex]
      if (prevRow) {
        setFocusedPath(prevRow.entry.path)
        setSelected(new Set([prevRow.entry.path]))
      }
    } else if (e.key === 'ArrowRight') {
      const currentRow = visibleFlatRows[currentIndex]
      if (currentRow?.entry.isDir && !expanded.has(currentRow.entry.path)) {
        e.preventDefault()
        toggleExpand(currentRow.entry.path)
      }
    } else if (e.key === 'ArrowLeft') {
      const currentRow = visibleFlatRows[currentIndex]
      if (currentRow?.entry.isDir && expanded.has(currentRow.entry.path)) {
        e.preventDefault()
        toggleExpand(currentRow.entry.path)
      }
    } else if (e.key === 'Enter') {
      const currentRow = visibleFlatRows[currentIndex]
      if (currentRow) {
        e.preventDefault()
        if (currentRow.entry.isDir) {
          toggleExpand(currentRow.entry.path)
        } else {
          const activeId = sessionId ?? safeService(ctx, 'sessions')?.active?.id ?? ''
          insertMentionToComposer(ctx, activeId, currentRow.relativePath, false)
        }
      }
    }
  }

  const handleRowSelect = (entryPath: string, e: React.MouseEvent) => {
    setFocusedPath(entryPath)
    if (e.ctrlKey || e.metaKey) {
      setSelected((prev) => {
        const next = new Set(prev)
        if (next.has(entryPath)) next.delete(entryPath)
        else next.add(entryPath)
        return next
      })
    } else {
      setSelected(new Set([entryPath]))
    }
  }

  const handleCreateSubmit = async () => {
    if (!creating || !creatingName.trim()) {
      setCreating(null)
      return
    }
    const name = creatingName.trim()
    const parent = creating.parentDir
    try {
      if (creating.isDir) {
        await apiCreateDirectory(parent, name)
      } else {
        await apiCreateNewFile(parent, name)
      }
      refreshAll()
      setExpanded((prev) => new Set(prev).add(parent))
    } catch (err: any) {
      alert(err.message || 'Operation failed')
    } finally {
      setCreating(null)
      setCreatingName('')
    }
  }

  const handleRename = async (entryPath: string, newName: string) => {
    try {
      await apiRename(entryPath, newName)
      refreshAll()
    } catch (err: any) {
      alert(err.message || 'Rename failed')
    }
  }

  const handleDelete = async (entry: FsEntry) => {
    if (!confirm(`Are you sure you want to delete "${entry.name}"?`)) return
    try {
      await apiDelete(entry.path)
      refreshAll()
    } catch (err: any) {
      alert(err.message || 'Delete failed')
    }
  }

  const handleExplorerDrop = async (e: React.DragEvent) => {
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      e.preventDefault()
      e.stopPropagation()
      const targetDir = rootPath
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i]!
        const uploadUrl = `/dsh-explorer/api/upload?dir=${encodeURIComponent(targetDir)}&relativePath=${encodeURIComponent(file.name)}`
        await fetch(uploadUrl, { method: 'POST', body: file })
      }
      refreshAll()
    }
  }

  const handleOpenFile = useCallback(
    (filePath: string, relPath: string) => {
      openFileInTab(ctx, sessionId ?? '', filePath, relPath)
    },
    [ctx, sessionId]
  )

  const title = rootPath ? baseName(rootPath) : 'EXPLORER'
  const rootListing = levels[rootPath] ?? levels[rootPath.replace(/\\/g, '/')]

  return (
    <div
      className={`${css.container} ${!options.enableMotion ? css.noMotion : ''}`}
      style={containerStyles}
    >
      <ExplorerHeader
        title={`EXPLORER: ${title}`}
        searchOpen={searchOpen}
        optionsOpen={optionsOpen}
        onToggleSearch={() => setSearchOpen(!searchOpen)}
        onToggleOptions={() => setOptionsOpen(!optionsOpen)}
        onNewFile={() => {
          setCreating({ parentDir: rootPath, isDir: false })
          setCreatingName('')
        }}
        onNewFolder={() => {
          setCreating({ parentDir: rootPath, isDir: true })
          setCreatingName('')
        }}
        onRefresh={() => {
          refreshAll()
        }}
        onCollapseAll={() => {
          setExpanded(new Set())
        }}
      />

      {optionsOpen && (
        <ExplorerOptionsModal
          options={options}
          onChange={handleUpdateOptions}
          onReset={handleResetOptions}
          onClose={() => setOptionsOpen(false)}
        />
      )}

      {searchOpen && (
        <ExplorerSearch
          value={filterText}
          onChange={setFilterText}
          onClose={() => {
            setFilterText('')
            setSearchOpen(false)
          }}
        />
      )}

      <div
        ref={treeBodyRef}
        className={css.treeBody}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'copy'
        }}
        onDrop={handleExplorerDrop}
      >
        {/* Root inline creation */}
        {creating && creating.parentDir === rootPath && (
          <div className={css.row} style={{ paddingLeft: `${indentStep + 8}px` }}>
            <span className={css.iconWrap}>{creating.isDir ? '📁' : '📄'}</span>
            <input
              ref={createInputRef}
              autoFocus
              type="text"
              className={css.inlineInput}
              placeholder={creating.isDir ? 'Folder name...' : 'File name...'}
              value={creatingName}
              onChange={(e) => setCreatingName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateSubmit()
                else if (e.key === 'Escape') setCreating(null)
              }}
              onBlur={handleCreateSubmit}
            />
          </div>
        )}

        {/* Tree Nodes with Motion Collapse */}
        {rootListing?.entries.map((entry) => (
          <TreeNode
            key={entry.path}
            entry={entry}
            depth={0}
            parentDir={rootPath}
            rootPath={rootPath}
            levels={levels}
            expanded={expanded}
            selected={selected}
            focusedPath={focusedPath}
            gitStatusMap={gitStatusMap}
            filterText={filterText}
            creating={creating}
            creatingName={creatingName}
            createInputRef={createInputRef}
            options={options}
            indentStep={indentStep}
            iconSize={iconSize}
            reloadDirectory={reloadDirectory}
            onToggle={toggleExpand}
            onSelect={handleRowSelect}
            onOpenFile={handleOpenFile}
            onContextMenu={(ent, rel, e) => {
              e.preventDefault()
              setContextMenu({
                x: e.clientX,
                y: e.clientY,
                entry: ent,
                relativePath: rel,
              })
            }}
            onInsertReference={(rel, isDir) => {
              const activeId = sessionId ?? safeService(ctx, 'sessions')?.active?.id ?? ''
              insertMentionToComposer(ctx, activeId, rel, isDir)
            }}
            onCopyRelativePath={(rel) => {
              navigator.clipboard.writeText(rel)
            }}
            onRenameSubmit={(path, newName) => handleRename(path, newName)}
            onDelete={handleDelete}
            onCreatingNameChange={setCreatingName}
            onCreatingKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateSubmit()
              else if (e.key === 'Escape') setCreating(null)
            }}
            onCreatingBlur={handleCreateSubmit}
            getRelativePath={getRelativePath}
          />
        ))}

        {visibleFlatRows.length === 0 && !creating && (
          <div className={css.emptyState}>
            {loading
              ? 'Loading workspace files...'
              : errorMessage
              ? `Error: ${errorMessage}`
              : filterText
              ? 'No matching files found'
              : !options.showHiddenFiles
              ? 'Only hidden files present (enable in options)'
              : 'Empty directory'}
          </div>
        )}
      </div>

      {contextMenu && (
        <ExplorerContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          entry={contextMenu.entry}
          relativePath={contextMenu.relativePath}
          onClose={() => setContextMenu(null)}
          onOpenFile={() => handleOpenFile(contextMenu.entry.path, contextMenu.relativePath)}
          onInsertReference={() => {
            const activeId = sessionId ?? safeService(ctx, 'sessions')?.active?.id ?? ''
            insertMentionToComposer(ctx, activeId, contextMenu.relativePath, contextMenu.entry.isDir)
          }}
          onInsertSnippet={async () => {
            const activeId = sessionId ?? safeService(ctx, 'sessions')?.active?.id ?? ''
            try {
              const content = await fetchFileContent(contextMenu.entry.path)
              insertSnippetToComposer(ctx, activeId, contextMenu.relativePath, content)
            } catch (err: any) {
              alert(err.message || 'Failed to read file')
            }
          }}
          onCopyPath={() => {
            navigator.clipboard.writeText(contextMenu.entry.path)
          }}
          onCopyRelativePath={() => {
            navigator.clipboard.writeText(contextMenu.relativePath)
          }}
          onNewFile={() => {
            setCreating({ parentDir: contextMenu.entry.path, isDir: false })
            setCreatingName('')
          }}
          onNewFolder={() => {
            setCreating({ parentDir: contextMenu.entry.path, isDir: true })
            setCreatingName('')
          }}
          onRename={() => {
            setFocusedPath(contextMenu.entry.path)
          }}
          onDelete={() => handleDelete(contextMenu.entry)}
        />
      )}
    </div>
  )
}
