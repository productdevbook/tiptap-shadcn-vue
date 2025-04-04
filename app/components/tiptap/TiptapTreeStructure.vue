<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { extractInstruction } from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { TreeRoot } from 'reka-ui'
import { computed, onBeforeUnmount, watchEffect } from 'vue'
import { useTiptapContext } from '.'
import TiptapTreeItem from './TiptapTreeItem.vue'
import { editorNodesToTree } from './tiptapTreeUtils'

const props = defineProps<{
  editorNodes?: any[]
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  'select-node': [id: string]
  'duplicate-node': [id: string]
  'delete-node': [id: string]
  'reorder-nodes': [params: { sourceId: string, targetId: string, position: 'before' | 'after' }]
}>()

// Get context data if props were not provided directly
const {
  editorNodes: contextNodes,
  selectNode,
  deleteNode,
  duplicateNode,
  reorderNodes,
} = useTiptapContext()

const nodes = computed(() => {
  const rawNodes = props.editorNodes ?? contextNodes.value ?? []

  // Transform nodes to match the tree structure expected by TreeRoot
  return editorNodesToTree(rawNodes)
})

// Handle node selection
function handleSelectNode(id: string) {
  if (selectNode) {
    selectNode(id)
  }
  else {
    emits('select-node', id)
  }
}

// Handle node duplication
function handleDuplicateNode(id: string) {
  if (duplicateNode) {
    duplicateNode(id)
  }
  else {
    emits('duplicate-node', id)
  }
}

// Handle node deletion
function handleDeleteNode(id: string) {
  if (deleteNode) {
    deleteNode(id)
  }
  else {
    emits('delete-node', id)
  }
}

// Handle node reordering
function handleReorderNodes(params) {
  if (reorderNodes) {
    reorderNodes(params)
  }
  else {
    emits('reorder-nodes', params)
  }
}

// Clean up all drag and drop handlers when component is destroyed
onBeforeUnmount(() => {
  if (cleanupDnd && typeof cleanupDnd === 'function') {
    cleanupDnd()
  }
})

// Set up global drop monitoring
let cleanupDnd: (() => void) | undefined

watchEffect((onCleanup) => {
  const dndFunction = combine(
    monitorForElements({
      onDrop(args) {
        const { location, source } = args
        // didn't drop on anything
        if (!location.current.dropTargets.length)
          return

        const sourceId = source.data.id as string
        const target = location.current.dropTargets[0]
        const targetId = target.data.id as string

        const instruction = extractInstruction(target.data)

        if (instruction !== null) {
          if (instruction.type === 'reorder-above') {
            handleReorderNodes({
              sourceId,
              targetId,
              position: 'before',
            })
          }
          else if (instruction.type === 'reorder-below') {
            handleReorderNodes({
              sourceId,
              targetId,
              position: 'after',
            })
          }
        }
      },
    }),
  )

  cleanupDnd = dndFunction

  onCleanup(() => {
    if (dndFunction) {
      dndFunction()
    }
  })
})
</script>

<template>
  <div
    :class="cn('tiptap-tree-structure', props.class)"
    data-slot="tiptap-structure"
  >
    <div v-if="!nodes || nodes.length === 0" class="text-sm text-muted-foreground italic p-2">
      No content yet. Start writing to see document structure.
    </div>
    <div v-else>
      <TreeRoot
        v-slot="{ flattenItems }"
        class="list-none select-none w-full"
        :items="nodes"
        :get-key="(item) => item.title"
        multiple
      >
        <TiptapTreeItem
          v-for="item in flattenItems"
          :key="item._id + item.index"
          :item="item"
          v-bind="item.bind"
          @select-node="handleSelectNode"
          @duplicate-node="handleDuplicateNode"
          @delete-node="handleDeleteNode"
        />
      </TreeRoot>
    </div>
  </div>
</template>
