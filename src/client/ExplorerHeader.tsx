import React from 'react'
import css from './explorer.module.css'

interface ExplorerHeaderProps {
  title: string
  searchOpen: boolean
  optionsOpen: boolean
  onToggleSearch: () => void
  onToggleOptions: () => void
  onNewFile: () => void
  onNewFolder: () => void
  onRefresh: () => void
  onCollapseAll: () => void
}

export const ExplorerHeader: React.FC<ExplorerHeaderProps> = ({
  title,
  searchOpen,
  optionsOpen,
  onToggleSearch,
  onToggleOptions,
  onNewFile,
  onNewFolder,
  onRefresh,
  onCollapseAll,
}) => {
  return (
    <div className={css.header}>
      <span className={css.headerTitle} title={title}>
        {title}
      </span>
      <div className={css.headerActions}>
        <button
          className={`${css.iconBtn} ${searchOpen ? css.iconBtnActive : ''}`}
          title="Filter files"
          onClick={onToggleSearch}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>
        <button className={css.iconBtn} title="New File" onClick={onNewFile}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9 1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6L9 1zm0 1.5L12.5 6H9V2.5zM8 8.5V11h1V8.5h2.5v-1H9V5H8v2.5H5.5v1H8z"/>
          </svg>
        </button>
        <button className={css.iconBtn} title="New Folder" onClick={onNewFolder}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M7 2l2 2h5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5zm2.5 6.5H8V6H7v2.5H4.5v1H7V12h1V9.5h2.5v-1z"/>
          </svg>
        </button>
        <button className={css.iconBtn} title="Refresh" onClick={onRefresh}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.65 2.35A7.958 7.958 0 0 0 8 0a8 8 0 1 0 8 8h-2a6 6 0 1 1-1.76-4.24l-2.24 2.24H16V0l-2.35 2.35z"/>
          </svg>
        </button>
        <button className={css.iconBtn} title="Collapse All Folders" onClick={onCollapseAll}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 3.5l1.5-1.5L8 7.5 13.5 2 15 3.5 8 10.5 1 3.5zM1 9.5l1.5-1.5L8 13.5 13.5 8 15 9.5 8 16.5 1 9.5z"/>
          </svg>
        </button>
        <button
          className={`${css.iconBtn} ${optionsOpen ? css.iconBtnActive : ''}`}
          title="Explorer Options"
          onClick={onToggleOptions}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

