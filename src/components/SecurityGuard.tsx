'use client'

import { useEffect } from 'react'

export default function SecurityGuard() {
  useEffect(() => {
    // 1. Disable Right Click (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // 2. Disable F12 and DevTools Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 key
      if (e.keyCode === 123 || e.key === 'F12') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Ctrl + Shift + I / J / C (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Cmd + Alt + I / J / C (Mac DevTools)
      if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Ctrl + U or Cmd + U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      // Ctrl + S or Cmd + S (Save Page)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    // Attach global security event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return null
}
