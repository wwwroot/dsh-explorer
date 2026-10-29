import { fetchFileContent } from './api.ts'
import {
  insertMentionToComposer,
  insertSnippetToComposer,
  resolveActiveSessionId,
} from './conversation-draft.ts'

export interface DragExplorerItem {
  path: string
  relativePath: string
  isDir: boolean
  name: string
}

export const DSH_EXPLORER_MIME = 'application/vnd.dsh.explorer-items'

let currentDragItems: DragExplorerItem[] | null = null

export function setupDragStart(
  e: React.DragEvent,
  items: DragExplorerItem[],
): void {
  currentDragItems = items
  const payload = JSON.stringify(items)
  try {
    e.dataTransfer.setData(DSH_EXPLORER_MIME, payload)
  } catch {}
  const plainText = items
    .map(item => (item.isDir ? `@${item.relativePath}/` : `@${item.relativePath}`))
    .join(' ')
  try {
    e.dataTransfer.setData('text/plain', plainText)
  } catch {}
  e.dataTransfer.effectAllowed = 'copy'
}

export function setupDragEnd(): void {
  setTimeout(() => {
    currentDragItems = null
  }, 200)
}

let activeOverlay: HTMLDivElement | null = null

function getOrCreateOverlay(targetEl: HTMLElement): HTMLDivElement {
  if (activeOverlay && document.body.contains(activeOverlay)) {
    return activeOverlay
  }
  const div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.inset = '0'
  div.style.backgroundColor = 'rgba(33, 150, 243, 0.08)'
  div.style.border = '2px dashed #007fd4'
  div.style.borderRadius = '8px'
  div.style.zIndex = '9999'
  div.style.pointerEvents = 'none'
  div.style.display = 'flex'
  div.style.flexDirection = 'column'
  div.style.alignItems = 'center'
  div.style.justifyContent = 'center'
  div.style.gap = '8px'
  div.style.backdropFilter = 'blur(2px)'
  div.style.transition = 'opacity 0.15s cubic-bezier(0.2, 0, 0, 1)'

  div.innerHTML = `
    <div style="font-weight: 600; font-size: 13px; color: #58a6ff; background: rgba(22, 27, 34, 0.85); border: 1px solid rgba(88, 166, 255, 0.3); padding: 8px 16px; border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 8px;">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2z"/>
      </svg>
      Drop at cursor to mention
    </div>
    <div style="font-size: 11px; opacity: 0.9; color: #8b949e; background: rgba(22, 27, 34, 0.7); padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.06);">
      Hold <b>Alt</b> or <b>Shift</b> to embed code snippet
    </div>
  `
  activeOverlay = div
  return div
}

export function attachGlobalConversationDropListener(ctx: any): () => void {
  let dragDepth = 0

  const hasExplorerData = (e: DragEvent): boolean => {
    if (currentDragItems && currentDragItems.length > 0) return true
    try {
      const types = Array.from(e.dataTransfer?.types ?? [])
      return types.includes(DSH_EXPLORER_MIME) || types.includes('text/plain')
    } catch {
      return false
    }
  }

  const getConversationContainer = (): HTMLElement | null => {
    return (
      document.querySelector<HTMLElement>('[data-slot="conversation.session"]') ??
      document.querySelector<HTMLElement>('[data-slot="conversation.shell"]') ??
      document.querySelector<HTMLElement>('[data-slot*="conversation"]') ??
      document.querySelector<HTMLElement>('.an3WzG_root') ??
      document.querySelector<HTMLElement>('.conversation-main') ??
      document.querySelector<HTMLElement>('main') ??
      document.querySelector<HTMLElement>('#root > div') ??
      null
    )
  }

  const handleDragEnter = (e: DragEvent) => {
    if (!hasExplorerData(e)) return
    const container = getConversationContainer()
    if (!container) return

    dragDepth += 1
    const overlay = getOrCreateOverlay(container)
    if (!container.contains(overlay)) {
      if (getComputedStyle(container).position === 'static') {
        container.style.position = 'relative'
      }
      container.appendChild(overlay)
    }
  }

  const handleDragOver = (e: DragEvent) => {
    if (!hasExplorerData(e)) return
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy'
    }
  }

  const handleDragLeave = (e: DragEvent) => {
    if (!hasExplorerData(e)) return
    dragDepth -= 1
    if (dragDepth <= 0) {
      dragDepth = 0
      activeOverlay?.remove()
    }
  }

  const handleDrop = async (e: DragEvent) => {
    if (!hasExplorerData(e)) return
    e.preventDefault()
    e.stopPropagation()

    dragDepth = 0
    activeOverlay?.remove()

    let items = currentDragItems
    if (!items || items.length === 0) {
      try {
        const raw = e.dataTransfer?.getData(DSH_EXPLORER_MIME)
        if (raw) items = JSON.parse(raw) as DragExplorerItem[]
      } catch {}
    }

    if (!items || items.length === 0) {
      // Fallback: try reading plain text
      const plain = e.dataTransfer?.getData('text/plain')
      if (plain && plain.startsWith('@')) {
        const relativePath = plain.replace(/^@"?/, '').replace(/"?$/, '')
        items = [{
          path: relativePath,
          relativePath,
          isDir: relativePath.endsWith('/'),
          name: relativePath,
        }]
      }
    }

    if (!items || items.length === 0) return

    try {
      const activeSessionId = resolveActiveSessionId(ctx)
      const isAlt = e.altKey || e.shiftKey
      let currentPoint: { x: number; y: number } | undefined = { x: e.clientX, y: e.clientY }

      for (const item of items) {
        if (isAlt && !item.isDir) {
          try {
            const content = await fetchFileContent(item.path)
            insertSnippetToComposer(ctx, activeSessionId, item.relativePath, content, currentPoint)
          } catch {
            insertMentionToComposer(ctx, activeSessionId, item.relativePath, item.isDir, currentPoint)
          }
        } else {
          insertMentionToComposer(ctx, activeSessionId, item.relativePath, item.isDir, currentPoint)
        }
        currentPoint = undefined
        if (items.length > 1) {
          await new Promise((resolve) => setTimeout(resolve, 40))
        }
      }
    } catch (err) {
      console.warn('[dsh-explorer] drop failed:', err)
    }
  }

  // Use capture phase so we intercept before child components swallow
  document.addEventListener('dragenter', handleDragEnter, true)
  document.addEventListener('dragover', handleDragOver, true)
  document.addEventListener('dragleave', handleDragLeave, true)
  document.addEventListener('drop', handleDrop, true)

  return () => {
    document.removeEventListener('dragenter', handleDragEnter, true)
    document.removeEventListener('dragover', handleDragOver, true)
    document.removeEventListener('dragleave', handleDragLeave, true)
    document.removeEventListener('drop', handleDrop, true)
    activeOverlay?.remove()
  }
}
