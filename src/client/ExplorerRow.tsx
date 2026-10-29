import React, { useState, useRef, useEffect } from 'react'
import css from './explorer.module.css'
import type { FsEntry } from './api.ts'
import type { SingleClickAction } from './options.ts'
import { renderFileIcon } from './vscode-theme.tsx'
import { setupDragStart, setupDragEnd, type DragExplorerItem } from './drag-drop.ts'

interface ExplorerRowProps {
  entry: FsEntry
  depth: number
  isExpanded: boolean
  isSelected: boolean
  isFocused: boolean
  gitStatus?: string
  relativePath: string
  compactChain?: FsEntry[]
  indentStep?: number
  iconSize?: number
  enableMotion?: boolean
  showGitBadges?: boolean
  compactFolders?: boolean
  singleClickAction?: SingleClickAction
  onToggle: () => void
  onSelect: (e: React.MouseEvent) => void
  onDoubleClick?: () => void
  onContextMenu: (e: React.MouseEvent) => void
  onInsertReference: () => void
  onCopyRelativePath: () => void
  onRenameSubmit: (newName: string) => void
  onDelete: () => void
}

export const ExplorerRow: React.FC<ExplorerRowProps> = ({
  entry,
  depth,
  isExpanded,
  isSelected,
  isFocused,
  gitStatus,
  relativePath,
  compactChain,
  indentStep = 16,
  iconSize = 16,
  enableMotion = true,
  showGitBadges = true,
  compactFolders = true,
  singleClickAction = 'select',
  onToggle,
  onSelect,
  onDoubleClick,
  onContextMenu,
  onInsertReference,
  onCopyRelativePath,
  onRenameSubmit,
  onDelete,
}) => {
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameVal, setRenameVal] = useState(entry.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isRenaming])

  const handleDragStart = (e: React.DragEvent) => {
    const item: DragExplorerItem = {
      path: entry.path,
      relativePath,
      isDir: entry.isDir,
      name: entry.name,
    }
    setupDragStart(e, [item])
  }

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const trimmed = renameVal.trim()
      if (trimmed && trimmed !== entry.name) {
        onRenameSubmit(trimmed)
      }
      setIsRenaming(false)
    } else if (e.key === 'Escape') {
      setRenameVal(entry.name)
      setIsRenaming(false)
    }
  }

  // Display label: if compactFolders is on and compactChain has elements, join their names (e.g. "vscode/antigravity-quota-context")
  const displayName = compactFolders && compactChain && compactChain.length > 1
    ? compactChain.map((c) => c.name).join('/')
    : (compactFolders && entry.compactName
      ? entry.compactName
      : entry.name)

  // Git status styling
  let gitClass = ''
  let gitLetter = ''
  if (gitStatus) {
    if (gitStatus.includes('M')) {
      gitClass = css.gitModified
      gitLetter = 'M'
    } else if (gitStatus.includes('?') || gitStatus.includes('A')) {
      gitClass = css.gitUntracked
      gitLetter = 'U'
    } else if (gitStatus.includes('D')) {
      gitClass = css.gitDeleted
      gitLetter = 'D'
    }
  }

  const isIgnored = gitStatus?.includes('!')

  return (
    <div
      className={`${css.row} ${isSelected ? css.rowSelected : ''} ${isFocused ? css.rowFocused : ''}`}
      style={{ paddingLeft: `${depth * indentStep + 8}px` }}
      onClick={(e) => {
        onSelect(e)
        if (entry.isDir) {
          onToggle()
        } else if (singleClickAction === 'mention') {
          onInsertReference()
        }
      }}
      onDoubleClick={(e) => {
        if (!entry.isDir) {
          e.stopPropagation()
          onDoubleClick?.()
        }
      }}
      onContextMenu={onContextMenu}
      draggable={!isRenaming}
      onDragStart={handleDragStart}
      onDragEnd={setupDragEnd}
    >
      {/* Indentation guide lines */}
      {Array.from({ length: depth }).map((_, i) => (
        <span
          key={i}
          className={css.indentGuide}
          style={{ left: `${i * indentStep + 15}px` }}
        />
      ))}

      {/* Expand/Collapse Chevron */}
      <span
        className={`${css.chevron} ${isExpanded ? css.chevronExpanded : ''} ${!entry.isDir ? css.chevronHidden : ''}`}
        style={!enableMotion ? { transition: 'none' } : undefined}
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
      >
        <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6 3.5L10.5 8 6 12.5V3.5Z" />
        </svg>
      </span>

      {/* Language / Folder Icon */}
      <span className={css.iconWrap}>
        {renderFileIcon(entry.name, entry.isDir, isExpanded, iconSize)}
      </span>

      {/* Label or Inline Rename */}
      {isRenaming ? (
        <input
          ref={inputRef}
          type="text"
          className={css.inlineInput}
          value={renameVal}
          onChange={(e) => setRenameVal(e.target.value)}
          onKeyDown={handleRenameKeyDown}
          onBlur={() => {
            const trimmed = renameVal.trim()
            if (trimmed && trimmed !== entry.name) {
              onRenameSubmit(trimmed)
            }
            setIsRenaming(false)
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className={`${css.label} ${isIgnored ? css.labelDimmed : ''} ${showGitBadges ? gitClass : ''}`}
          title={relativePath}
        >
          {displayName}
        </span>
      )}

      {/* Git status badge */}
      {showGitBadges && gitLetter && <span className={`${css.gitBadge} ${gitClass}`}>{gitLetter}</span>}

      {/* Hover actions */}
      {!isRenaming && (
        <div className={css.hoverActions} onClick={(e) => e.stopPropagation()}>
          <button
            className={css.actionBtn}
            title="Mention in Chat (@)"
            onClick={(e) => {
              e.stopPropagation()
              onInsertReference()
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zM7 5h2v2h2v2H9v2H7V9H5V7h2V5z"/>
            </svg>
          </button>
          <button
            className={css.actionBtn}
            title="Copy Relative Path"
            onClick={(e) => {
              e.stopPropagation()
              onCopyRelativePath()
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 4h6v1H4v9h7v-4h1v5H3V4h1zm3-2h7v7h-1V3.7L7.7 9 7 8.3 12.3 3H7V2z"/>
            </svg>
          </button>
          <button
            className={css.actionBtn}
            title="Rename (F2)"
            onClick={(e) => {
              e.stopPropagation()
              setIsRenaming(true)
            }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
