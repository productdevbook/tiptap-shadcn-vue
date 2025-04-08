import type { Ref } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'

interface SmartShortcutOptions {
  // Array of keys that make up the shortcut
  keys: string[]
  // CSS selector for the context in which the shortcut should work
  contextSelector: string
  // Callback function to run when shortcut is triggered
  onTrigger: (e: KeyboardEvent) => void
  // Whether to prevent default browser behavior
  preventDefault?: boolean
}

/**
 * Prevents conflicts with other global shortcuts
 */
export function useSmartShortcut(options: SmartShortcutOptions): { keysPressed: Ref<Set<string>> } {
  const {
    keys,
    contextSelector,
    onTrigger,
    preventDefault = true,
  } = options

  const keysPressed = ref<Set<string>>(new Set())

  // Normalize keys to handle different naming conventions
  const normalizeKey = (key: string): string => {
    const keyMap: Record<string, string> = {
      Ctrl: 'Control',
      Cmd: 'Meta',
      Alt: 'Alt',
      Shift: 'Shift',
    }
    return keyMap[key] || key
  }

  const normalizedKeys = keys.map(key =>
    typeof key === 'string' ? normalizeKey(key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()) : key,
  )

  // We need to capture events in the capture phase, before they reach any other handlers
  const handleKeyDown = (e: KeyboardEvent): boolean | undefined => {
    // Add the pressed key to the set
    const key = e.key === ' ' ? 'Space' : e.key
    keysPressed.value.add(e.key.length === 1 ? e.key.toLowerCase() : key)

    // Special handling for modifier keys
    if (e.ctrlKey)
      keysPressed.value.add('Control')
    if (e.metaKey)
      keysPressed.value.add('Meta')
    if (e.altKey)
      keysPressed.value.add('Alt')
    if (e.shiftKey)
      keysPressed.value.add('Shift')

    // Check if all required keys are pressed
    const allKeysPressed = normalizedKeys.every(k =>
      keysPressed.value.has(k)
      || (k.length === 1 && keysPressed.value.has(k.toLowerCase())),
    )

    if (allKeysPressed) {
      // Check if the target or any of its parents match our selector
      const targetElement = e.target as HTMLElement
      const isInContext = targetElement.closest(contextSelector) !== null

      if (isInContext) {
        // Prevent event from bubbling up to other handlers and prevent default
        e.stopPropagation()
        if (preventDefault)
          e.preventDefault()

        // Execute our callback
        onTrigger(e)

        // We need to completely halt the event here
        return false
      }
    }

    return undefined
  }

  const handleKeyUp = (e: KeyboardEvent): void => {
    const key = e.key === ' ' ? 'Space' : e.key
    keysPressed.value.delete(e.key.length === 1 ? e.key.toLowerCase() : key)

    // Handle modifier keys release
    if (!e.ctrlKey)
      keysPressed.value.delete('Control')
    if (!e.metaKey)
      keysPressed.value.delete('Meta')
    if (!e.altKey)
      keysPressed.value.delete('Alt')
    if (!e.shiftKey)
      keysPressed.value.delete('Shift')
  }

  onMounted(() => {
    // Use the capture phase (true as third parameter) to intercept events before they reach other handlers
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('keyup', handleKeyUp, true)
    window.addEventListener('blur', () => keysPressed.value.clear())
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown, true)
    document.removeEventListener('keyup', handleKeyUp, true)
    window.removeEventListener('blur', () => keysPressed.value.clear())
  })

  return {
    keysPressed,
  }
};
