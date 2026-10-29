import React, { useRef, useEffect } from 'react'
import css from './explorer.module.css'

interface ExplorerSearchProps {
  value: string
  onChange: (val: string) => void
  onClose: () => void
}

export const ExplorerSearch: React.FC<ExplorerSearchProps> = ({ value, onChange, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className={css.searchBar}>
      <input
        ref={inputRef}
        type="text"
        className={css.searchInput}
        placeholder="Filter by name (fuzzy)..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {value && (
        <button className={css.clearSearchBtn} title="Clear filter" onClick={() => onChange('')}>
          ✕
        </button>
      )}
    </div>
  )
}

