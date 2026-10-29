export interface DraftCaret {
  start: number
  end: number
}

let lastKnownSessionId = ''
let trackedCaret: { start: number; end: number; draft?: string; timestamp: number } | null = null

export function setLastKnownSessionId(id?: string): void {
  if (id) lastKnownSessionId = id
}

export function safeService(ctx: any, name: string): any {
  try {
    return ctx?.get ? ctx.get(name) : ctx?.reflect?.get ? ctx.reflect.get(name, false) : ctx?.[name]
  } catch {
    try {
      return ctx?.reflect?.get?.(name, false)
    } catch {
      return undefined
    }
  }
}

export function resolveActiveSessionId(ctx: any, explicitId?: string): string {
  if (explicitId) {
    lastKnownSessionId = explicitId
    return explicitId
  }
  if (lastKnownSessionId) return lastKnownSessionId

  try {
    const sessions = safeService(ctx, 'sessions')
    if (sessions) {
      const snapshot = sessions.list?.getSnapshot?.()
      if (snapshot?.byId) {
        for (const [id, row] of Object.entries<any>(snapshot.byId)) {
          if ((row?.retainedBy?.mainView ?? 0) > 0) {
            lastKnownSessionId = id
            return id
          }
        }
        if (snapshot.activeId) {
          lastKnownSessionId = snapshot.activeId
          return snapshot.activeId
        }
        if (Array.isArray(snapshot.ids) && snapshot.ids.length > 0) {
          const id = snapshot.ids[snapshot.ids.length - 1]
          lastKnownSessionId = id
          return id
        }
        const keys = Object.keys(snapshot.byId)
        if (keys.length > 0) {
          const id = keys[keys.length - 1]
          lastKnownSessionId = id
          return id
        }
      }
      if (sessions.active?.id) {
        lastKnownSessionId = sessions.active.id
        return sessions.active.id
      }
      if (sessions.current?.id) {
        lastKnownSessionId = sessions.current.id
        return sessions.current.id
      }
    }
  } catch {
    // Ignore
  }
  return ''
}

/**
 * Locate DSH's native Lexical composer element.
 * DSH marks the composer contenteditable with [data-composer-input="true"].
 */
export function findComposerElement(): HTMLElement | null {
  if (typeof document === 'undefined') return null

  // 1. Direct DSH Lexical composer attribute
  const composerInput =
    document.querySelector<HTMLElement>('[data-composer-input="true"]') ??
    document.querySelector<HTMLElement>('[data-composer-input]')
  if (composerInput) return composerInput

  // 2. Lexical composer inside conversation slot
  const slot =
    document.querySelector('[data-slot="conversation"]') ??
    document.querySelector('[data-slot*="conversation"]') ??
    document.body
  const ce =
    slot.querySelector<HTMLElement>('[contenteditable="true"][role="textbox"]') ??
    slot.querySelector<HTMLElement>('[contenteditable="true"]')
  if (ce) return ce

  // 3. Fallback textarea
  return (
    document.querySelector<HTMLTextAreaElement>('textarea[data-phase]') ??
    document.querySelector<HTMLTextAreaElement>('textarea') ??
    document.querySelector<HTMLElement>('[contenteditable="true"]') ??
    null
  )
}

/**
 * Continuously track user selection/caret in composer.
 */
export function recordLiveCaret(): void {
  if (typeof document === 'undefined') return
  const el = findComposerElement()
  if (!el) return

  if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
    const ta = el as HTMLTextAreaElement
    const start = ta.selectionStart
    const end = ta.selectionEnd
    if (typeof start === 'number' && typeof end === 'number' && Number.isFinite(start) && Number.isFinite(end)) {
      trackedCaret = {
        start: Math.max(0, Math.min(start, ta.value.length)),
        end: Math.max(start, Math.min(end, ta.value.length)),
        draft: ta.value,
        timestamp: Date.now(),
      }
    }
  } else if (el.isContentEditable) {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && el.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0)
      const preRange = range.cloneRange()
      preRange.selectNodeContents(el)
      preRange.setEnd(range.startContainer, range.startOffset)
      const start = preRange.toString().length
      const length = range.toString().length
      trackedCaret = {
        start,
        end: start + length,
        draft: el.innerText ?? el.textContent ?? '',
        timestamp: Date.now(),
      }
    }
  }
}

let caretTrackerAttached = false
export function setupCaretTracker(): () => void {
  if (caretTrackerAttached || typeof document === 'undefined') return () => {}
  caretTrackerAttached = true

  const handleSelection = () => recordLiveCaret()
  document.addEventListener('selectionchange', handleSelection, { passive: true })
  document.addEventListener('keyup', handleSelection, { passive: true })
  document.addEventListener('mouseup', handleSelection, { passive: true })
  document.addEventListener('input', handleSelection, { passive: true })
  document.addEventListener('focusin', handleSelection, { passive: true })

  return () => {
    document.removeEventListener('selectionchange', handleSelection)
    document.removeEventListener('keyup', handleSelection)
    document.removeEventListener('mouseup', handleSelection)
    document.removeEventListener('input', handleSelection)
    document.removeEventListener('focusin', handleSelection)
    caretTrackerAttached = false
  }
}

/**
 * Snap caret so it never cuts inside a word token (e.g. 'per|lu' -> 'perlu|').
 */
export function snapCaretToWordBoundary(draft: string, caret: DraftCaret | null): DraftCaret | null {
  if (!caret || draft.length === 0) return caret
  let { start, end } = caret

  const isWordChar = (ch: string | undefined): boolean => {
    return Boolean(ch && !/[\s\r\n\t]/.test(ch))
  }

  if (start === end && start > 0 && start < draft.length) {
    const prevChar = draft[start - 1]
    const nextChar = draft[start]
    if (isWordChar(prevChar) && isWordChar(nextChar)) {
      while (start < draft.length && isWordChar(draft[start])) {
        start++
      }
      end = start
    }
  }

  return { start, end }
}

export function probeComposerCaret(draft: string, targetPoint?: { x: number; y: number }): DraftCaret | null {
  const el = findComposerElement()

  // 1. Direct read from focused/active textarea
  if (el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT')) {
    const ta = el as HTMLTextAreaElement
    if (!ta.disabled && !ta.readOnly) {
      const start = ta.selectionStart
      const end = ta.selectionEnd
      if (
        typeof start === 'number' &&
        typeof end === 'number' &&
        Number.isFinite(start) &&
        Number.isFinite(end) &&
        (document.activeElement === ta || ta.value === draft)
      ) {
        const clampedStart = Math.max(0, Math.min(start, draft.length))
        const clampedEnd = Math.max(clampedStart, Math.min(end, draft.length))
        trackedCaret = { start: clampedStart, end: clampedEnd, draft, timestamp: Date.now() }
        return { start: clampedStart, end: clampedEnd }
      }
    }
  }

  // 2. Fallback to continuously tracked live caret
  if (trackedCaret) {
    const clampedStart = Math.max(0, Math.min(trackedCaret.start, draft.length))
    const clampedEnd = Math.max(clampedStart, Math.min(trackedCaret.end, draft.length))
    return { start: clampedStart, end: clampedEnd }
  }

  return null
}

export function placeComposerCaret(expectedDraft: string, caretIndex: number): void {
  let remaining = 3
  const check = () => {
    remaining -= 1
    const el = findComposerElement()
    if (!el) return
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      const textarea = el as HTMLTextAreaElement
      if (textarea.disabled || textarea.readOnly) return
      const clamped = Math.max(0, Math.min(caretIndex, textarea.value.length))
      textarea.focus()
      textarea.setSelectionRange(clamped, clamped)
      trackedCaret = { start: clamped, end: clamped, draft: textarea.value, timestamp: Date.now() }
      return
    } else if (el.isContentEditable) {
      el.focus()
      trackedCaret = { start: caretIndex, end: caretIndex, draft: expectedDraft, timestamp: Date.now() }
      return
    }
    if (remaining > 0) {
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(check)
      else setTimeout(check, 16)
    }
  }
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(check)
  else setTimeout(check, 16)
}

/**
 * Splice text into draft with strict whitespace and word-boundary safety.
 */
export function spliceInsert(
  draft: string,
  text: string,
  rawCaret: DraftCaret | null,
): { draft: string; caretAfter: number } {
  const caret = snapCaretToWordBoundary(draft, rawCaret)
  if (!caret || draft === '') {
    const next = draft.trim() === '' ? text : `${draft}${/\s$/.test(draft) ? '' : ' '}${text}`
    return { draft: next, caretAfter: next.length }
  }

  const prefix = draft.slice(0, caret.start)
  const suffix = draft.slice(caret.end)

  // Enforce single space separation on left
  const left = prefix === '' || /\s$/.test(prefix) ? '' : ' '

  // Enforce single space separation on right
  const right = suffix === '' || /^\s/.test(suffix) || /\s$/.test(text) ? '' : ' '

  const next = `${prefix}${left}${text}${right}${suffix}`
  const caretAfter = prefix.length + left.length + text.length

  return {
    draft: next,
    caretAfter,
  }
}

export function mentionForPath(relativePath: string, isDir: boolean): string {
  const norm = relativePath.replace(/[\\/]+$/, '').replace(/\\/g, '/')
  const target = isDir ? `${norm}/` : norm
  return /\s/.test(target) ? `@"${target}"` : `@${target}`
}

export function baseName(path: string): string {
  const at = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'))
  return at === -1 ? path : path.slice(at + 1)
}

/**
 * Main insertion function for DSH chat composer.
 * Inserts native structured ReferenceChip nodes with strict single-execution
 * protection so mentions never duplicate, never merge, and always format cleanly.
 */
export function insertMentionToComposer(
  ctx: any,
  sessionId: string,
  relativePath: string,
  isDir: boolean,
  targetPoint?: { x: number; y: number },
): boolean {
  try {
    const mention = mentionForPath(relativePath, isDir)
    const name = baseName(relativePath)
    const label = isDir ? `${name}/` : name
    const appearance = isDir ? 'folder' : 'file'

    // If drop coordinate provided, set Lexical selection to the exact drop point first
    if (targetPoint && typeof document !== 'undefined') {
      const el = findComposerElement()
      if (el) {
        let range: Range | null = null
        if (typeof (document as any).caretRangeFromPoint === 'function') {
          range = (document as any).caretRangeFromPoint(targetPoint.x, targetPoint.y)
        } else if (typeof (document as any).caretPositionFromPoint === 'function') {
          const pos = (document as any).caretPositionFromPoint(targetPoint.x, targetPoint.y)
          if (pos && pos.offsetNode) {
            range = document.createRange()
            range.setStart(pos.offsetNode, pos.offset)
            range.collapse(true)
          }
        }
        if (range && el.contains(range.startContainer)) {
          const sel = window.getSelection()
          sel?.removeAllRanges()
          sel?.addRange(range)
          el.focus({ preventScroll: true })
        }
      }
    }

    const sessions = safeService(ctx, 'sessions')
    const targetSessionId = resolveActiveSessionId(ctx, sessionId)
    const actx = targetSessionId && sessions?.scope ? sessions.scope(targetSessionId) : undefined
    const conversation = safeService(ctx, 'conversation')

    // 1. Primary path: Native DSH Lexical structured reference chip (supports both file & folder)
    if (conversation && actx) {
      const shell = conversation.input?.for(actx)
      if (shell) {
        // Method A: Direct native batch reference insertion on draftEditor
        // This is DSH's internal native routine which automatically guarantees single-space separation
        // on both sides without manual cursor manipulation or span races.
        if (shell.draftEditor && typeof shell.draftEditor.insertFileReferences === 'function') {
          try {
            const revBefore = shell.rev ?? shell.state?.getSnapshot?.()?.draftRev ?? 0
            const applied = shell.draftEditor.insertFileReferences([
              {
                source: 'reference',
                ref: mention,
                label,
                appearance,
                clipboardText: mention,
              },
            ])
            const revAfter = shell.rev ?? shell.state?.getSnapshot?.()?.draftRev ?? 0
            if (applied || revAfter !== revBefore) {
              shell.focus?.()
              return true
            }
          } catch (err) {
            console.warn('[dsh-explorer] draftEditor.insertFileReferences failed, trying actx.bail:', err)
          }
        }

        // Method B: Event-driven reference chip insertion with detectText-aligned whitespace check
        let span = shell.actions?.captureInsertion?.() ?? shell.captureInsertion?.()
        if (span && span.draftRev !== undefined) {
          const detectText = shell.projection?.detectText ?? ''
          let charBefore = span.start > 0 ? (detectText[span.start - 1] ?? '') : ''

          if (!charBefore) {
            try {
              const sel = window.getSelection()
              if (sel && sel.anchorNode) {
                const text = sel.anchorNode.textContent ?? ''
                const offset = sel.anchorOffset
                if (offset > 0) charBefore = text[offset - 1] ?? ''
              }
            } catch {}
          }
          if (!charBefore) {
            const draftText = shell.state?.getSnapshot?.()?.draft ?? ''
            if (span.start > 0 && span.start <= draftText.length) {
              charBefore = draftText[span.start - 1] ?? ''
            }
          }

          // If preceded by a non-whitespace character, insert a single space first so the chip doesn't merge
          if (charBefore && !/\s/.test(charBefore)) {
            if (typeof shell.actions?.insertText === 'function') {
              try { shell.actions.insertText(' ', span) } catch {}
            } else if (typeof shell.insertText === 'function') {
              try { shell.insertText(' ', span) } catch {}
            }
            const updated = shell.actions?.captureInsertion?.() ?? shell.captureInsertion?.()
            if (updated && updated.draftRev !== undefined) {
              span = updated
            }
          }

          const revBefore = shell.rev ?? shell.state?.getSnapshot?.()?.draftRev ?? 0
          let applied = false

          // Try actx.bail first (Cordis bail returns the listener's return value!)
          try {
            if (typeof actx.bail === 'function') {
              applied = Boolean(
                actx.bail(actx, 'slash/input-insert-reference', {
                  reference: {
                    source: 'reference',
                    ref: mention,
                    label,
                    appearance,
                    clipboardText: mention,
                  },
                  span,
                })
              )
            }
          } catch {}

          if (!applied) {
            try {
              actx.emit?.('slash/input-insert-reference', {
                reference: {
                  source: 'reference',
                  ref: mention,
                  label,
                  appearance,
                  clipboardText: mention,
                },
                span,
              })
            } catch {}
          }

          const revAfter = shell.rev ?? shell.state?.getSnapshot?.()?.draftRev ?? 0

          // If chip insertion applied or rev bumped, RETURN IMMEDIATELY (no fallthrough duplicate!)
          if (applied || revAfter !== revBefore) {
            shell.focus?.()
            return true
          }

          // If chip node insertion not handled, insert plain reference text via Lexical replaceText
          let leadSpace = ''
          if (charBefore && !/\s/.test(charBefore)) leadSpace = ' '
          const textToInsert = `${leadSpace}${mention} `
          if (typeof shell.actions?.insertText === 'function') {
            try {
              if (shell.actions.insertText(textToInsert, span)) {
                shell.focus?.()
                return true
              }
            } catch {}
          }
          if (typeof shell.insertText === 'function') {
            try {
              if (shell.insertText(textToInsert, span)) {
                shell.focus?.()
                return true
              }
            } catch {}
          }
        }
      }
    }

    // 2. DOM fallback on Lexical contenteditable
    const el = findComposerElement()
    if (el) {
      if (el.isContentEditable) {
        el.focus()
        let needLeadingSpace = false
        try {
          const sel = window.getSelection()
          if (sel && sel.rangeCount > 0) {
            const r = sel.getRangeAt(0)
            if (r.startContainer.nodeType === Node.TEXT_NODE) {
              const text = r.startContainer.textContent ?? ''
              if (r.startOffset > 0 && !/\s/.test(text[r.startOffset - 1])) {
                needLeadingSpace = true
              }
            } else if (r.startContainer.previousSibling) {
              const text = r.startContainer.previousSibling.textContent ?? ''
              if (text && !/\s/.test(text.slice(-1))) {
                needLeadingSpace = true
              }
            }
          }
        } catch {}

        const textToInsert = `${needLeadingSpace ? ' ' : ''}${mention} `

        try {
          if (document.execCommand('insertText', false, textToInsert)) {
            recordLiveCaret()
            return true
          }
        } catch {}

        try {
          const sel = window.getSelection()
          if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0)
            range.deleteContents()
            const textNode = document.createTextNode(textToInsert)
            range.insertNode(textNode)
            range.collapse(false)
            sel.removeAllRanges()
            sel.addRange(range)
            el.dispatchEvent(new Event('input', { bubbles: true }))
            recordLiveCaret()
            return true
          }
        } catch {}
      }

      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        const textarea = el as HTMLTextAreaElement
        const current = textarea.value
        const rawCaret = probeComposerCaret(current, targetPoint) ?? {
          start: textarea.selectionStart ?? current.length,
          end: textarea.selectionEnd ?? current.length,
        }
        const { draft: next, caretAfter } = spliceInsert(current, `${mention} `, rawCaret)
        textarea.value = next
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
        placeComposerCaret(next, caretAfter)
        return true
      }
    }

    // 3. Last-resort fallback: setDraft
    if (conversation && actx) {
      const shell = conversation.input?.for(actx)
      if (shell?.setDraft) {
        const currentDraft = shell.state?.getSnapshot?.()?.draft ?? ''
        const rawCaret = probeComposerCaret(currentDraft, targetPoint)
        const { draft: next, caretAfter } = spliceInsert(currentDraft, `${mention} `, rawCaret)
        shell.setDraft(next)
        placeComposerCaret(next, caretAfter)
        return true
      }
    }

    return false
  } catch (err) {
    console.warn('[dsh-explorer] insertMentionToComposer failed:', err)
    return false
  }
}

export function insertSnippetToComposer(
  ctx: any,
  sessionId: string,
  relativePath: string,
  content: string,
  targetPoint?: { x: number; y: number },
): boolean {
  try {
    const ext = relativePath.slice(relativePath.lastIndexOf('.') + 1) || 'text'
    const block = `\n\`\`\`${ext} title="${relativePath}"\n${content}\n\`\`\`\n`

    const targetSessionId = resolveActiveSessionId(ctx, sessionId)
    const sessions = safeService(ctx, 'sessions')
    const actx = targetSessionId && sessions?.scope ? sessions.scope(targetSessionId) : undefined
    const conversation = safeService(ctx, 'conversation')

    if (conversation && actx) {
      const shell = conversation.input?.for(actx)
      if (shell) {
        const span = shell.actions?.captureInsertion?.() ?? shell.captureInsertion?.()
        if (span && span.draftRev !== undefined) {
          if (typeof shell.actions?.insertText === 'function') {
            try {
              if (shell.actions.insertText(block, span)) {
                shell.focus?.()
                return true
              }
            } catch {}
          }
          if (typeof shell.insertText === 'function') {
            try {
              if (shell.insertText(block, span)) {
                shell.focus?.()
                return true
              }
            } catch {}
          }
        }
      }
    }

    const el = findComposerElement()
    if (el) {
      if (el.isContentEditable) {
        el.focus()
        try {
          if (document.execCommand('insertText', false, block)) {
            recordLiveCaret()
            return true
          }
        } catch {}
      }

      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        const textarea = el as HTMLTextAreaElement
        const current = textarea.value
        const rawCaret = probeComposerCaret(current, targetPoint) ?? {
          start: textarea.selectionStart ?? current.length,
          end: textarea.selectionEnd ?? current.length,
        }
        const { draft: next, caretAfter } = spliceInsert(current, block, rawCaret)
        textarea.value = next
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
        placeComposerCaret(next, caretAfter)
        return true
      }
    }

    return false
  } catch (err) {
    console.warn('[dsh-explorer] insertSnippetToComposer failed:', err)
    return false
  }
}
