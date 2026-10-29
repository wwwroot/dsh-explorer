export type ExplorerDensity = 'compact' | 'normal' | 'relaxed'
export type SingleClickAction = 'select' | 'mention'

export interface ExplorerOptions {
  scale: number
  density: ExplorerDensity
  enableMotion: boolean
  showHiddenFiles: boolean
  showGitBadges: boolean
  compactFolders: boolean
  singleClickAction: SingleClickAction
}

export const DEFAULT_OPTIONS: ExplorerOptions = {
  scale: 1.0,
  density: 'normal',
  enableMotion: true,
  showHiddenFiles: true,
  showGitBadges: true,
  compactFolders: false,
  singleClickAction: 'select',
}

const STORAGE_KEY = 'dsh_explorer_options_v1'

export function loadExplorerOptions(): ExplorerOptions {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { ...DEFAULT_OPTIONS }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_OPTIONS }
    const parsed = JSON.parse(raw)
    return {
      scale:
        typeof parsed.scale === 'number' && Number.isFinite(parsed.scale)
          ? Math.max(0.75, Math.min(1.35, Math.round(parsed.scale * 100) / 100))
          : DEFAULT_OPTIONS.scale,
      density: parsed.density === 'compact' || parsed.density === 'relaxed' ? parsed.density : 'normal',
      enableMotion: typeof parsed.enableMotion === 'boolean' ? parsed.enableMotion : DEFAULT_OPTIONS.enableMotion,
      showHiddenFiles:
        typeof parsed.showHiddenFiles === 'boolean' ? parsed.showHiddenFiles : DEFAULT_OPTIONS.showHiddenFiles,
      showGitBadges:
        typeof parsed.showGitBadges === 'boolean' ? parsed.showGitBadges : DEFAULT_OPTIONS.showGitBadges,
      compactFolders:
        typeof parsed.compactFolders === 'boolean' ? parsed.compactFolders : DEFAULT_OPTIONS.compactFolders,
      singleClickAction: parsed.singleClickAction === 'mention' ? 'mention' : 'select',
    }
  } catch {
    return { ...DEFAULT_OPTIONS }
  }
}

export function saveExplorerOptions(options: ExplorerOptions): void {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(options))
  } catch {}
}
