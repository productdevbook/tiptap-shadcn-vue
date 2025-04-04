import type { Editor } from '@tiptap/vue-3'
import type { ComputedRef, Ref } from 'vue'
import { createContext } from 'reka-ui'

// Define the TiptapContext type
export interface TiptapContext {
  editor: ComputedRef<Editor | null>
  editorNodes: Ref<any[]>
  sidebarVisible: Ref<boolean>
  selectedNodeId: Ref<string>
  toggleSidebar: () => void
  selectNode: (id: string) => void
  deleteNode: (id: string) => boolean | void
  duplicateNode: (id: string) => boolean | void
  reorderNodes: (params: { sourceId: string, targetId: string, position: 'before' | 'after' }) => boolean | void
  updateEditorNodes: () => void
  // Add these missing properties that are used in TiptapProvider.vue
  canUndo: ComputedRef<boolean>
  canRedo: ComputedRef<boolean>
  metadata: ComputedRef<{
    lastSaved: Date | null
    wordCount: number
    charCount: number
    readingTime: string
  }>
  updateMetadata: () => void
}

// Create context for Tiptap components
export const [useTiptapContext, provideTiptapContext]
  = createContext<TiptapContext>('TiptapEditor')

export { default as TiptapContent } from './TiptapContent.vue'
// Export all component parts
export { default as TiptapEditor } from './TiptapEditor.vue'
export { default as TiptapIcon } from './TiptapIcon.vue'
export { default as TiptapKeyboardShortcuts } from './TiptapKeyboardShortcuts.vue'
export { default as TiptapMobileToolbar } from './TiptapMobileToolbar.vue'
export { default as TiptapProvider } from './TiptapProvider.vue'
export { default as TiptapSlotPanel } from './TiptapSlotPanel.vue'
export { default as TiptapStatusBar } from './TiptapStatusBar.vue'
export { default as TiptapTableToolbar } from './TiptapTableToolbar.vue'
export { default as TiptapToolbar } from './TiptapToolbar.vue'

export { default as TiptapTreeItem } from './TiptapTreeItem.vue'
// Export the tree-based structure components
export { default as TiptapTreeStructure } from './TiptapTreeStructure.vue'

// Re-export utilities
export * from './tiptapTreeUtils'
