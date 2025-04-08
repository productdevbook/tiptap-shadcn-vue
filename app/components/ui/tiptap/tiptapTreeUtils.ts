import type { Instruction } from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item'

export interface TiptapTreeItem {
  title: string
  name: string
  icon: string
  content?: string
  selected?: boolean
  depth?: number
  children?: TiptapTreeItem[]
}

export type TiptapTreeAction =
  | {
    type: 'instruction'
    instruction: Instruction
    itemId: string
    targetId: string
  }
  | {
    type: 'reorder'
    sourceId: string
    targetId: string
    position: 'before' | 'after'
  }

export const tiptapTree = {
  remove(data: TiptapTreeItem[], id: string): TiptapTreeItem[] {
    return data
      .filter(item => item.title !== id)
      .map((item) => {
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: tiptapTree.remove(item.children, id),
          }
        }
        return item
      })
  },

  insertBefore(data: TiptapTreeItem[], targetId: string, newItem: TiptapTreeItem): TiptapTreeItem[] {
    return data.flatMap((item) => {
      if (item.title === targetId)
        return [newItem, item]

      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: tiptapTree.insertBefore(item.children, targetId, newItem),
        }
      }
      return item
    })
  },

  insertAfter(data: TiptapTreeItem[], targetId: string, newItem: TiptapTreeItem): TiptapTreeItem[] {
    return data.flatMap((item) => {
      if (item.title === targetId)
        return [item, newItem]

      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: tiptapTree.insertAfter(item.children, targetId, newItem),
        }
      }

      return item
    })
  },

  find(data: TiptapTreeItem[], itemId: string): TiptapTreeItem | undefined {
    for (const item of data) {
      if (item.title === itemId)
        return item

      if (item.children && item.children.length > 0) {
        const result = tiptapTree.find(item.children, itemId)
        if (result)
          return result
      }
    }

    return undefined
  },

  hasChildren(item: TiptapTreeItem): boolean {
    return Array.isArray(item.children) && item.children.length > 0
  },
}

export function updateTiptapTree(data: TiptapTreeItem[], action: TiptapTreeAction) {
  if (action.type === 'instruction') {
    const { instruction, itemId, targetId } = action

    // Find the item that's being moved
    const item = tiptapTree.find(data, itemId)
    if (!item)
      return data

    // Don't allow dropping on itself
    if (itemId === targetId)
      return data

    if (instruction.type === 'reorder-above') {
      let result = tiptapTree.remove(data, itemId)
      result = tiptapTree.insertBefore(result, targetId, item)
      return result
    }

    if (instruction.type === 'reorder-below') {
      let result = tiptapTree.remove(data, itemId)
      result = tiptapTree.insertAfter(result, targetId, item)
      return result
    }
  }

  if (action.type === 'reorder') {
    const { sourceId, targetId, position } = action

    // Find the item that's being moved
    const item = tiptapTree.find(data, sourceId)
    if (!item)
      return data

    // Don't allow dropping on itself
    if (sourceId === targetId)
      return data

    // Remove the item from its current position
    let result = tiptapTree.remove(data, sourceId)

    // Insert at the new position
    if (position === 'before') {
      result = tiptapTree.insertBefore(result, targetId, item)
    }
    else {
      result = tiptapTree.insertAfter(result, targetId, item)
    }

    return result
  }

  return data
}

// Helper function to convert flat editor nodes to tree structure
export function editorNodesToTree(nodes: any[]): TiptapTreeItem[] {
  if (!nodes || !Array.isArray(nodes))
    return []

  return nodes.map(node => ({
    title: node.id,
    name: node.name || node.id,
    icon: node.icon || 'mdi:circle',
    content: node.content,
    selected: node.selected,
    depth: node.depth || 0,
  }))
}

export const shortcuts = [
  { keys: ['Ctrl', 'B'], description: 'Bold' },
  { keys: ['Ctrl', 'I'], description: 'Italic' },
  { keys: ['Ctrl', 'U'], description: 'Underline' },
  { keys: ['Ctrl', '`'], description: 'Code' },
  { keys: ['Ctrl', 'Alt', '1-6'], description: 'Heading 1-6' },
  { keys: ['Ctrl', 'Shift', '8'], description: 'Bullet list' },
  { keys: ['Ctrl', 'Shift', '9'], description: 'Ordered list' },
  { keys: ['Tab'], description: 'Indent' },
  { keys: ['Shift', 'Tab'], description: 'Outdent' },
  { keys: ['Ctrl', 'Z'], description: 'Undo' },
  { keys: ['Ctrl', 'Y'], description: 'Redo' },
]
