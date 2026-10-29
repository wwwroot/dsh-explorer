import React, { useEffect, useRef } from 'react'
import css from './explorer.module.css'
import type { ExplorerOptions, ExplorerDensity, SingleClickAction } from './options.ts'

interface ExplorerOptionsModalProps {
  options: ExplorerOptions
  onChange: (updated: Partial<ExplorerOptions>) => void
  onReset: () => void
  onClose: () => void
}

export const ExplorerOptionsModal: React.FC<ExplorerOptionsModalProps> = ({
  options,
  onChange,
  onReset,
  onClose,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close on Click Outside & Escape key
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleMouseDown, true)
    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [onClose])

  const handleDensityChange = (density: ExplorerDensity) => {
    onChange({ density })
  }

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scale = parseFloat(e.target.value)
    if (!Number.isNaN(scale)) {
      onChange({ scale: Math.round(scale * 100) / 100 })
    }
  }

  const handleActionChange = (action: SingleClickAction) => {
    onChange({ singleClickAction: action })
  }

  return (
    <div ref={popoverRef} className={css.optionsPopover}>
      {/* Header */}
      <div className={css.optionsHeader}>
        <div className={css.optionsHeaderTitle}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" style={{ marginRight: '6px' }}>
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
          </svg>
          EXPLORER OPTIONS
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button className={css.optionsIconBtn} title="Reset to defaults" onClick={onReset}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.65 2.35A7.958 7.958 0 0 0 8 0a8 8 0 1 0 8 8h-2a6 6 0 1 1-1.76-4.24l-2.24 2.24H16V0l-2.35 2.35z" />
            </svg>
          </button>
          <button className={css.optionsIconBtn} title="Close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className={css.optionsBody}>
        {/* Section 1: Density & Scale */}
        <div className={css.optionsSection}>
          <div className={css.optionsSectionTitle}>Scale & Density</div>

          {/* Density preset buttons */}
          <div className={css.segmentGroup}>
            <button
              type="button"
              className={`${css.segmentBtn} ${options.density === 'compact' ? css.segmentBtnActive : ''}`}
              onClick={() => handleDensityChange('compact')}
            >
              Compact
            </button>
            <button
              type="button"
              className={`${css.segmentBtn} ${options.density === 'normal' ? css.segmentBtnActive : ''}`}
              onClick={() => handleDensityChange('normal')}
            >
              Normal
            </button>
            <button
              type="button"
              className={`${css.segmentBtn} ${options.density === 'relaxed' ? css.segmentBtnActive : ''}`}
              onClick={() => handleDensityChange('relaxed')}
            >
              Relaxed
            </button>
          </div>

          {/* Scale zoom slider */}
          <div className={css.optionsRow} style={{ marginTop: '6px' }}>
            <div className={css.optionsLabelWrap}>
              <span className={css.optionsLabel}>Zoom Scale</span>
              <span className={css.optionsSubLabel}>Resize tree text and icons</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className={css.optionsBadge}>{Math.round(options.scale * 100)}%</span>
              {options.scale !== 1.0 && (
                <button
                  type="button"
                  className={css.optionsMiniBtn}
                  title="Reset scale to 100%"
                  onClick={() => onChange({ scale: 1.0 })}
                >
                  1x
                </button>
              )}
            </div>
          </div>
          <input
            type="range"
            min="0.75"
            max="1.35"
            step="0.05"
            value={options.scale}
            onChange={handleScaleChange}
            className={css.optionsSlider}
          />
        </div>

        {/* Section 2: Motion & Animation */}
        <div className={css.optionsSection}>
          <div className={css.optionsSectionTitle}>Motion & Transitions</div>
          <div className={css.optionsRow}>
            <div className={css.optionsLabelWrap}>
              <span className={css.optionsLabel}>Smooth Animations</span>
              <span className={css.optionsSubLabel}>Fluid folder collapse & icon turns</span>
            </div>
            <div
              className={`${css.switch} ${options.enableMotion ? css.switchActive : ''}`}
              onClick={() => onChange({ enableMotion: !options.enableMotion })}
              role="switch"
              aria-checked={options.enableMotion}
            >
              <div className={`${css.switchKnob} ${options.enableMotion ? css.switchKnobActive : ''}`} />
            </div>
          </div>
        </div>

        {/* Section 3: File Tree Display */}
        <div className={css.optionsSection}>
          <div className={css.optionsSectionTitle}>Workspace View</div>

          {/* Show hidden files */}
          <div className={css.optionsRow}>
            <div className={css.optionsLabelWrap}>
              <span className={css.optionsLabel}>Show Hidden Files</span>
              <span className={css.optionsSubLabel}>Include dotfiles and config directories</span>
            </div>
            <div
              className={`${css.switch} ${options.showHiddenFiles ? css.switchActive : ''}`}
              onClick={() => onChange({ showHiddenFiles: !options.showHiddenFiles })}
              role="switch"
              aria-checked={options.showHiddenFiles}
            >
              <div className={`${css.switchKnob} ${options.showHiddenFiles ? css.switchKnobActive : ''}`} />
            </div>
          </div>

          {/* Git badges */}
          <div className={css.optionsRow}>
            <div className={css.optionsLabelWrap}>
              <span className={css.optionsLabel}>Git Status Indicators</span>
              <span className={css.optionsSubLabel}>Highlight modified & untracked files</span>
            </div>
            <div
              className={`${css.switch} ${options.showGitBadges ? css.switchActive : ''}`}
              onClick={() => onChange({ showGitBadges: !options.showGitBadges })}
              role="switch"
              aria-checked={options.showGitBadges}
            >
              <div className={`${css.switchKnob} ${options.showGitBadges ? css.switchKnobActive : ''}`} />
            </div>
          </div>

          {/* Compact folders */}
          <div className={css.optionsRow}>
            <div className={css.optionsLabelWrap}>
              <span className={css.optionsLabel}>Compact Folders</span>
              <span className={css.optionsSubLabel}>Chain single-child directory paths</span>
            </div>
            <div
              className={`${css.switch} ${options.compactFolders ? css.switchActive : ''}`}
              onClick={() => onChange({ compactFolders: !options.compactFolders })}
              role="switch"
              aria-checked={options.compactFolders}
            >
              <div className={`${css.switchKnob} ${options.compactFolders ? css.switchKnobActive : ''}`} />
            </div>
          </div>
        </div>

        {/* Section 4: Quick Workflow */}
        <div className={css.optionsSection}>
          <div className={css.optionsSectionTitle}>Interaction</div>
          <div className={css.optionsRow}>
            <div className={css.optionsLabelWrap}>
              <span className={css.optionsLabel}>File Click Behavior</span>
              <span className={css.optionsSubLabel}>Direct action when clicking a file</span>
            </div>
          </div>
          <div className={css.segmentGroup} style={{ marginTop: '4px' }}>
            <button
              type="button"
              className={`${css.segmentBtn} ${options.singleClickAction === 'select' ? css.segmentBtnActive : ''}`}
              onClick={() => handleActionChange('select')}
            >
              Select / Focus
            </button>
            <button
              type="button"
              className={`${css.segmentBtn} ${options.singleClickAction === 'mention' ? css.segmentBtnActive : ''}`}
              onClick={() => handleActionChange('mention')}
            >
              Insert @Mention
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
