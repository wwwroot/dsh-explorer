import React from 'react'

export interface IconStyle {
  color: string
  label?: string
}

export function getFileExtension(filename: string): string {
  const at = filename.lastIndexOf('.')
  return at <= 0 ? '' : filename.slice(at + 1).toLowerCase()
}

export function getLanguageColor(filename: string, isDir: boolean): string {
  if (isDir) return '#dcb67a'
  const ext = getFileExtension(filename)
  const lowerName = filename.toLowerCase()

  if (lowerName === 'dockerfile' || lowerName.startsWith('dockerfile.')) return '#2496ed'
  if (lowerName === '.gitignore' || lowerName === '.gitattributes') return '#f14e32'
  if (lowerName === 'package.json') return '#cb3837'
  if (lowerName.startsWith('.env')) return '#ecd53f'

  switch (ext) {
    case 'ts':
    case 'mts':
    case 'cts':
      return '#3178c6'
    case 'tsx':
      return '#3178c6'
    case 'js':
    case 'mjs':
    case 'cjs':
      return '#f7df1e'
    case 'jsx':
      return '#00d8ff'
    case 'py':
    case 'pyw':
      return '#3572a5'
    case 'rs':
      return '#dea584'
    case 'go':
      return '#00add8'
    case 'c':
    case 'h':
      return '#a8b9cc'
    case 'cpp':
    case 'cc':
    case 'cxx':
    case 'hpp':
      return '#00599c'
    case 'cs':
      return '#178600'
    case 'java':
    case 'jar':
      return '#b07219'
    case 'kt':
    case 'kts':
      return '#a97bff'
    case 'swift':
      return '#f05138'
    case 'php':
      return '#777bb4'
    case 'rb':
      return '#cc342d'
    case 'html':
    case 'htm':
      return '#e34c26'
    case 'css':
      return '#42a5f5'
    case 'scss':
    case 'sass':
      return '#cd6799'
    case 'less':
      return '#1d365d'
    case 'json':
    case 'jsonc':
    case 'json5':
      return '#cbcb41'
    case 'yaml':
    case 'yml':
      return '#cb171e'
    case 'toml':
      return '#9c4221'
    case 'md':
    case 'markdown':
    case 'mdx':
      return '#519aba'
    case 'sql':
      return '#e38c00'
    case 'sh':
    case 'bash':
    case 'zsh':
      return '#89e051'
    case 'ps1':
    case 'psm1':
      return '#012456'
    case 'svg':
      return '#ff9800'
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
    case 'ico':
      return '#ab47bc'
    case 'zip':
    case 'tar':
    case 'gz':
    case '7z':
    case 'rar':
      return '#ec407a'
    default:
      return '#90a4ae'
  }
}

export function renderFileIcon(filename: string, isDir: boolean, isOpen = false, size = 16): React.ReactNode {
  if (isDir) {
    const folderColor = isOpen ? '#e5c07b' : '#dcb67a'
    if (isOpen) {
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <path d="M1.5 2.5C1.5 1.94772 1.94772 1.5 2.5 1.5H6.29289C6.5581 1.5 6.81249 1.60536 7 1.79289L8.20711 3H13.5C14.0523 3 14.5 3.44772 14.5 4V5H2.5L1.5 2.5Z" fill={folderColor} opacity="0.8"/>
          <path d="M1.5 5.5H14.5L13.5 13.5C13.5 14.0523 13.0523 14.5 12.5 14.5H3.5C2.94772 14.5 2.5 14.0523 2.5 13.5L1.5 5.5Z" fill={folderColor}/>
          <path d="M1.5 5.5L2.8 14H13.2L14.5 5.5H1.5Z" fill="#ffe082" fillOpacity="0.25"/>
        </svg>
      )
    }
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <path d="M1.5 2.5C1.5 1.94772 1.94772 1.5 2.5 1.5H6.29289C6.5581 1.5 6.81249 1.60536 7 1.79289L8.20711 3H13.5C14.0523 3 14.5 3.44772 14.5 4V13.5C14.5 14.0523 14.0523 14.5 13.5 14.5H2.5C1.94772 14.5 1.5 14.0523 1.5 13.5V2.5Z" fill={folderColor}/>
      </svg>
    )
  }

  const ext = getFileExtension(filename)
  const lowerName = filename.toLowerCase()
  const color = getLanguageColor(filename, false)

  // Specific high-frequency icons
  if (ext === 'ts') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <rect width="16" height="16" rx="2.5" fill="#3178c6"/>
        <text x="3" y="12" fill="#ffffff" fontSize="9.5" fontWeight="bold" fontFamily="monospace">TS</text>
      </svg>
    )
  }
  if (ext === 'tsx') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <rect width="16" height="16" rx="2.5" fill="#3178c6"/>
        <circle cx="8" cy="8" r="2" fill="#00d8ff"/>
        <ellipse cx="8" cy="8" rx="5" ry="2.2" stroke="#00d8ff" strokeWidth="0.9" fill="none"/>
        <ellipse cx="8" cy="8" rx="5" ry="2.2" stroke="#00d8ff" strokeWidth="0.9" fill="none" transform="rotate(60 8 8)"/>
        <ellipse cx="8" cy="8" rx="5" ry="2.2" stroke="#00d8ff" strokeWidth="0.9" fill="none" transform="rotate(120 8 8)"/>
      </svg>
    )
  }
  if (ext === 'js' || ext === 'mjs' || ext === 'cjs') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <rect width="16" height="16" rx="2.5" fill="#f7df1e"/>
        <text x="3.5" y="12" fill="#000000" fontSize="9.5" fontWeight="bold" fontFamily="monospace">JS</text>
      </svg>
    )
  }
  if (ext === 'jsx') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <rect width="16" height="16" rx="2.5" fill="#20232a"/>
        <circle cx="8" cy="8" r="2" fill="#00d8ff"/>
        <ellipse cx="8" cy="8" rx="5" ry="2.2" stroke="#00d8ff" strokeWidth="0.9" fill="none"/>
        <ellipse cx="8" cy="8" rx="5" ry="2.2" stroke="#00d8ff" strokeWidth="0.9" fill="none" transform="rotate(60 8 8)"/>
        <ellipse cx="8" cy="8" rx="5" ry="2.2" stroke="#00d8ff" strokeWidth="0.9" fill="none" transform="rotate(120 8 8)"/>
      </svg>
    )
  }
  if (ext === 'py') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <path d="M7.9 1.5C5.2 1.5 5.3 2.7 5.3 2.7V4H8V4.4H3.8C2.5 4.4 1.5 5.5 1.5 7.2C1.5 8.9 2.3 9.4 3.3 9.4H4.3V8.1C4.3 6.6 5.5 5.5 7 5.5H9.6C10.5 5.5 11.2 4.8 11.2 3.9V2.7C11.2 1.8 10.3 1.5 7.9 1.5ZM6.5 2.6C6.9 2.6 7.2 2.9 7.2 3.3C7.2 3.7 6.9 4 6.5 4C6.1 4 5.8 3.7 5.8 3.3C5.8 2.9 6.1 2.6 6.5 2.6Z" fill="#3572a5"/>
        <path d="M8.1 14.5C10.8 14.5 10.7 13.3 10.7 13.3V12H8V11.6H12.2C13.5 11.6 14.5 10.5 14.5 8.8C14.5 7.1 13.7 6.6 12.7 6.6H11.7V7.9C11.7 9.4 10.5 10.5 9 10.5H6.4C5.5 10.5 4.8 11.2 4.8 12.1V13.3C4.8 14.2 5.7 14.5 8.1 14.5ZM9.5 13.4C9.1 13.4 8.8 13.1 8.8 12.7C8.8 12.3 9.1 12 9.5 12C9.9 12 10.2 12.3 10.2 12.7C10.2 13.1 9.9 13.4 9.5 13.4Z" fill="#ffd43b"/>
      </svg>
    )
  }
  if (ext === 'rs') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="6.5" stroke="#dea584" strokeWidth="1.2" fill="#1e1e1e"/>
        <path d="M5.5 5H9C9.8 5 10.5 5.5 10.5 6.3C10.5 7 10 7.6 9.3 7.8L10.8 11H9.3L8 8.2H7V11H5.5V5ZM7 7.1H8.8C9.2 7.1 9.5 6.8 9.5 6.4C9.5 6 9.2 5.8 8.8 5.8H7V7.1Z" fill="#dea584"/>
      </svg>
    )
  }
  if (ext === 'go') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <rect width="16" height="16" rx="2.5" fill="#00add8"/>
        <text x="2" y="11.5" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">GO</text>
      </svg>
    )
  }
  if (ext === 'json') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <path d="M2.5 2C2.5 1.44772 2.94772 1 3.5 1H10L14 5V14C14 14.5523 13.5523 15 13 15H3.5C2.94772 15 2.5 14.5523 2.5 14V2Z" fill="#2d3748"/>
        <text x="4" y="11" fill="#cbcb41" fontSize="9" fontWeight="bold" fontFamily="monospace">{'{}'}</text>
      </svg>
    )
  }
  if (ext === 'md' || ext === 'markdown') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="#519aba" strokeWidth="1.2" fill="#1e1e1e"/>
        <path d="M3.5 10V6L5.5 8.5L7.5 6V10" stroke="#519aba" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 6V10M9.5 8.5L11 10L12.5 8.5" stroke="#519aba" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  if (lowerName === '.gitignore' || lowerName === '.gitattributes') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <path d="M14.6 7.4L8.6 1.4C8.2 1 7.6 1 7.2 1.4L1.4 7.2C1 7.6 1 8.2 1.4 8.6L7.4 14.6C7.8 15 8.4 15 8.8 14.6L14.6 8.8C15 8.4 15 7.8 14.6 7.4ZM8.5 10.8V8.3C7.4 8.4 6.8 9 6.8 9.5C6.8 9.7 6.6 9.8 6.4 9.8C6.2 9.8 6 9.6 6 9.4C6 8.3 7 7.3 8.5 7.1V5.5C8.1 5.4 7.8 5 7.8 4.5C7.8 3.9 8.2 3.5 8.8 3.5C9.4 3.5 9.8 3.9 9.8 4.5C9.8 5 9.4 5.4 9.1 5.5V10.8C9.4 10.9 9.8 11.3 9.8 11.8C9.8 12.4 9.4 12.8 8.8 12.8C8.2 12.8 7.8 12.4 7.8 11.8C7.8 11.3 8.1 10.9 8.5 10.8Z" fill="#f14e32"/>
      </svg>
    )
  }
  if (lowerName === 'dockerfile' || lowerName.startsWith('dockerfile.')) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <path d="M14.5 7.5C14 7.5 13.5 7.8 13.2 8.2C12.4 7.7 11.2 7.7 10.5 8.2V5H8.5V7H9.5V8.5H5.5V6H3.5V8.5H2V7H1V8.5C0.4 8.8 0 9.4 0 10C0 12.2 2.5 14 6.5 14C11.5 14 14.8 11.2 15 8.5C15 8 14.8 7.5 14.5 7.5Z" fill="#2496ed"/>
      </svg>
    )
  }

  // Generic document sheet with badge
  const shortExt = ext.slice(0, 3).toUpperCase()
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 2C3 1.44772 3.44772 1 4 1H10L14 5V14C14 14.5523 13.5523 15 13 15H4C3.44772 15 3 14.5523 3 14V2Z" fill="#2b313c" stroke="#3e4451" strokeWidth="0.8"/>
      <path d="M10 1V5H14" fill="#3e4451" opacity="0.6"/>
      {shortExt ? (
        <text x="4" y="11" fill={color} fontSize="6" fontWeight="bold" fontFamily="monospace">{shortExt}</text>
      ) : (
        <circle cx="8" cy="9" r="1.8" fill={color}/>
      )}
    </svg>
  )
}

export const renderVSCodeIcon = renderFileIcon
