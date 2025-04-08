<script setup lang="ts">
import type { Instruction } from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item'
import type { FlattenedItem } from 'reka-ui'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { attachInstruction, extractInstruction } from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
import { unrefElement } from '@vueuse/core'
import { TreeItem } from 'reka-ui'
import { computed, h, ref, render, watchEffect } from 'vue'
import Icon from './TiptapIcon.vue'

const props = defineProps<{
  item: FlattenedItem<any>
}>()

const emits = defineEmits<{
  'select-node': [id: string]
  'duplicate-node': [id: string]
  'delete-node': [id: string]
}>()

const elRef = ref()
const isDragging = ref(false)
const isDraggedOver = ref(false)
const instruction = ref<Extract<Instruction, { type: 'reorder-above' | 'reorder-below' | 'make-child' }> | null>(null)

const node = computed(() => {
  return {
    id: props.item.value.title,
    name: props.item.value.name,
    icon: props.item.value.icon || 'mdi:circle',
    content: props.item.value.content,
    selected: props.item.value.selected,
    depth: props.item.value.depth,
  }
})

const mode = computed(() => {
  if (props.item.hasChildren)
    return 'expanded'
  if (props.item.index + 1 === props.item.parentItem?.children?.length)
    return 'last-in-group'
  return 'standard'
})

watchEffect((onCleanup) => {
  const currentElement = unrefElement(elRef)

  if (!currentElement)
    return

  const item = {
    ...props.item.value,
    level: props.item.level,
    id: props.item._id,
  }

  const dndFunction = combine(
    draggable({
      element: currentElement,
      getInitialData: () => item,
      onDragStart: () => {
        isDragging.value = true
      },
      onDrop: () => {
        isDragging.value = false
      },
      onGenerateDragPreview({ nativeSetDragImage }) {
        setCustomNativeDragPreview({
          getOffset: pointerOutsideOfPreview({ x: '16px', y: '8px' }),
          render: ({ container }) => {
            return render(h(
              'div',
              { class: 'bg-white text-muted-foreground rounded-md text-sm font-medium px-3 py-1.5 border' },
              node.value.name || item.id,
            ), container)
          },
          nativeSetDragImage,
        })
      },
    }),

    dropTargetForElements({
      element: currentElement,
      getData: ({ input, element }) => {
        const data = { id: item.id }

        return attachInstruction(data, {
          input,
          element,
          indentPerLevel: 16,
          currentLevel: props.item.level,
          mode: mode.value,
          block: [],
        })
      },
      canDrop: ({ source }) => {
        return source.data.id !== item.id
      },
      onDrag: ({ self }) => {
        instruction.value = extractInstruction(self.data) as typeof instruction.value
      },
      onDragEnter: ({ source }) => {
        if (source.data.id !== item.id) {
          isDraggedOver.value = true
        }
      },
      onDragLeave: () => {
        isDraggedOver.value = false
        instruction.value = null
      },
      onDrop: () => {
        isDraggedOver.value = false
        instruction.value = null
      },
      getIsSticky: () => true,
    }),

    monitorForElements({
      canMonitor: ({ source }) => {
        return source.data.id !== item.id
      },
    }),
  )

  // Cleanup dnd function
  onCleanup(() => dndFunction())
})

// Handle node selection
function handleClick(event) {
  event.preventDefault()
  emits('select-node', node.value.id)
}

// Handle node duplication
function handleDuplicate(event) {
  event.stopPropagation()
  emits('duplicate-node', node.value.id)
}

// Handle node deletion
function handleDelete(event) {
  event.stopPropagation()
  emits('delete-node', node.value.id)
}
</script>

<template>
  <TreeItem
    ref="elRef"
    :value="item.value"
    :level="item.level"
    class="outline-node group relative w-full border-none py-2 px-3 rounded-md cursor-pointer"
    :class="{
      'opacity-50': isDragging,
      'bg-accent text-accent-foreground font-medium': node.selected,
      'hover:bg-accent hover:text-accent-foreground': !node.selected,
      'text-muted-foreground': !node.selected,
    }"
    @click="handleClick"
    @select.prevent
  >
    <div class="flex items-center gap-2 w-full">
      <!-- Icon and name -->
      <div class="flex-1 flex items-center gap-2 overflow-hidden">
        <Icon :name="node.icon" class="h-4 w-4 flex-shrink-0" />
        <span class="truncate">{{ node.name }}</span>
        <span v-if="node.content" class="text-xs text-muted-foreground truncate">
          {{ node.content }}
        </span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                size="icon"
                variant="ghost"
                class="h-6 w-6"
                @click.stop="handleDuplicate"
              >
                <Icon name="mdi:content-copy" class="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Duplicate</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                size="icon"
                variant="ghost"
                class="h-6 w-6 text-destructive hover:text-destructive"
                @click.stop="handleDelete"
              >
                <Icon name="mdi:delete" class="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>

    <!-- Drag indicator -->
    <div
      v-if="instruction" class="absolute h-full w-full top-0 border-primary" :style="{
        left: `${instruction?.currentLevel * instruction?.indentPerLevel}px`,
        width: `calc(100% - ${instruction?.currentLevel * instruction?.indentPerLevel}px)`,
      }" :class="{
        '!border-b-2': instruction?.type === 'reorder-below',
        '!border-t-2': instruction?.type === 'reorder-above',
        '!border-2 rounded': instruction?.type === 'make-child',
      }"
    />
  </TreeItem>
</template>
