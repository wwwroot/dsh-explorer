import React, { useEffect, useRef } from 'react'
import css from './explorer.module.css'
import type { FsEntry } from './api.ts'

interface ContextMenuProps {
  x: number
  y: number
  entry: FsEntry
  relativePath: string
  onClose: () => void
  onOpenFile?: () => void
  onInsertReference: () => void
  onInsertSnippet: () => void
  onCopyPath: () => void
  onCopyRelativePath: () => void
  onNewFile: () => void
  onNewFolder: () => void
  onRename: () => void
  onDelete: () => void
}

export const ExplorerContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  entry,
  relativePath,
  onClose,
  onOpenFile,
  onInsertReference,
  onInsertSnippet,
  onCopyPath,
  onCopyRelativePath,
  onNewFile,
  onNewFolder,
  onRename,
  onDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    window.addEventListener('mousedown', handleOutsideClick)
    return () => window.removeEventListener('mousedown', handleOutsideClick)
  }, [onClose])

  // Adjust menu bounds if overflowing screen
  const top = Math.min(y, window.innerHeight - 260)
  const left = Math.min(x, window.innerWidth - 200)

  return (
    <div ref={menuRef} className={css.contextMenu} style={{ top, left }}>
      {!entry.isDir && onOpenFile && (
        <>
          <div
            className={css.menuItem}
            onClick={() => {
              onOpenFile()
              onClose()
            }}
          >
            <span>Open in New Tab</span>
            <span className={css.menuShortcut}>Double-Click</span>
          </div>
          <div className={css.menuDivider} />
        </>
      )}
      <div
        className={css.menuItem}
        onClick={() => {
          onInsertReference()
          onClose()
        }}
      >
        <span>Insert Mention to Chat</span>
        <span className={css.menuShortcut}>@</span>
      </div>
      {!entry.isDir && (
        <div
          className={css.menuItem}
          onClick={() => {
            onInsertSnippet()
            onClose()
          }}
        >
          <span>Insert Code to Chat</span>
          <span className={css.menuShortcut}>Alt+Drop</span>
        </div>
      )}
      <div className={css.menuDivider} />
      {entry.isDir && (
        <>
          <div
            className={css.menuItem}
            onClick={() => {
              onNewFile()
              onClose()
            }}
          >
            <span>New File...</span>
          </div>
          <div
            className={css.menuItem}
            onClick={() => {
              onNewFolder()
              onClose()
            }}
          >
            <span>New Folder...</span>
          </div>
          <div className={css.menuDivider} />
        </>
      )}
      <div
        className={css.menuItem}
        onClick={() => {
          onCopyRelativePath()
          onClose()
        }}
      >
        <span>Copy Relative Path</span>
      </div>
      <div
        className={css.menuItem}
        onClick={() => {
          onCopyPath()
          onClose()
        }}
      >
        <span>Copy Path</span>
      </div>
      <div className={css.menuDivider} />
      <div
        className={css.menuItem}
        onClick={() => {
          onRename()
          onClose()
        }}
      >
        <span>Rename...</span>
        <span className={css.menuShortcut}>F2</span>
      </div>
      <div
        className={css.menuItem}
        onClick={() => {
          onDelete()
          onClose()
        }}
      >
        <span style={{ color: '#f44336' }}>Delete</span>
        <span className={css.menuShortcut}>Del</span>
      </div>
    </div>
  )
}

