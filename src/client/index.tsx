import React, { createElement, memo } from 'react'
import { ExplorerView } from './ExplorerView.tsx'
import { attachGlobalConversationDropListener } from './drag-drop.ts'
import { setupCaretTracker } from './conversation-draft.ts'

export const inject = [
  'slots',
  'sessions',
  'locale',
]

const ExplorerTabIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M14 4.5V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6.5L14 4.5zm-1 0H9.5a.5.5 0 0 1-.5-.5V2H3v12h10V4.5z"/>
  </svg>
)

const ExplorerTabTitle = memo(function ExplorerTabTitle() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
      <ExplorerTabIcon />
      <span>Explorer</span>
    </span>
  )
})

const ExplorerPaneBody = memo(function ExplorerPaneBody(props: { ctx?: any; sessionId?: string }) {
  return <ExplorerView ctx={props.ctx} sessionId={props.sessionId} />
})

const ExplorerHeaderButton = ({ ctx, sessionId }: { ctx: any; sessionId?: string }) => {
  return (
    <button
      type="button"
      title="Explorer (File Tree)"
      aria-label="Explorer"
      onClick={() => {
        try {
          const sr = ctx.get ? ctx.get('sidebarRight') : ctx.sidebarRight
          if (sessionId && sr?.openTabIn) {
            sr.openTabIn(sessionId, 'explorer')
          } else if (sr?.openTab) {
            sr.openTab('explorer')
          }
        } catch (err) {
          console.warn('[dsh-explorer] failed to open sidebar tab:', err)
        }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '3px 6px',
        borderRadius: '6px',
        color: 'var(--dsw-alias-label-secondary, #8b949e)',
        transition: 'color 0.15s, background-color 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--dsw-alias-label-primary, #ffffff)'
        e.currentTarget.style.backgroundColor = 'var(--dsw-alias-bg-hover, rgba(255, 255, 255, 0.08))'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--dsw-alias-label-secondary, #8b949e)'
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <ExplorerTabIcon />
    </button>
  )
}

export function apply(ctx: any): void {
  // 1. Live composer caret tracker (for precise insertion point)
  ctx.effect(() => {
    try {
      return setupCaretTracker()
    } catch (err) {
      console.warn('[dsh-explorer] failed to setup caret tracker:', err)
      return () => {}
    }
  }, 'dsh-explorer: caret tracker')

  // 2. Global drag & drop listener onto DSH chat conversation
  ctx.effect(() => {
    try {
      return attachGlobalConversationDropListener(ctx)
    } catch (err) {
      console.warn('[dsh-explorer] failed to attach conversation drop listener:', err)
      return () => {}
    }
  }, 'dsh-explorer: conversation drop listener')

  // 2. Direct icon button in conversation session header utilities
  ctx.slots.inject('conversation.session.header.utilities', () =>
    ctx.slots.register(
      {
        name: 'conversation.session.header.utilities',
        id: 'dsh-explorer:header-button',
        order: 15,
        inject: (sessionId: string) => ({ sessionId }),
      },
      (props: { sessionId?: string }) => <ExplorerHeaderButton ctx={ctx} sessionId={props.sessionId} />
    )
  )

  // 3. Register native tab into DSH right sidebar
  ctx.inject(['sidebarRightTabs'], (injected: any) => {
    const tabs = injected.get ? injected.get('sidebarRightTabs') : injected.sidebarRightTabs
    if (!tabs?.register) return

    // Register 'explorer' kind
    const unregisterExplorer = tabs.register({
      id: 'dsh-explorer',
      kind: 'explorer',
      keepMounted: true,
      priority: 'extension',
      title: () => 'Explorer',
      guide: [
        {
          id: 'dsh-explorer',
          order: 5,
          title: () => 'Explorer',
          description: () => 'VS Code style file explorer with drag & drop to chat',
          icon: ExplorerTabIcon,
        },
      ],
    })

    // Register pane slots for 'dsh-explorer'
    const offBody = ctx.slots.inject('sidebar.right.pane.tab', () =>
      ctx.slots.register(
        {
          name: 'sidebar.right.pane.tab',
          key: 'dsh-explorer',
          inject: (sessionId: string) => ({ ctx, sessionId }),
        },
        ExplorerPaneBody
      )
    )
    const offTitle = ctx.slots.inject('sidebar.right.pane.tab.title', () =>
      ctx.slots.register(
        {
          name: 'sidebar.right.pane.tab.title',
          key: 'dsh-explorer',
          inject: (sessionId: string) => ({ sessionId }),
        },
        ExplorerTabTitle
      )
    )

    return () => {
      try { offTitle?.() } catch {}
      try { offBody?.() } catch {}
      try { unregisterExplorer?.() } catch {}
    }
  })
}
