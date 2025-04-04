<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const shortcuts = [
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
</script>

<template>
  <div
    :class="cn('tiptap-keyboard-shortcuts p-4', props.class)"
    data-slot="tiptap-keyboard-shortcuts"
  >
    <h3 class="text-lg font-medium mb-2">
      Keyboard Shortcuts
    </h3>
    <div class="grid gap-2">
      <div v-for="(shortcut, index) in shortcuts" :key="index" class="flex items-center justify-between">
        <div class="flex gap-1">
          <kbd
            v-for="(key, kIndex) in shortcut.keys"
            :key="kIndex"
            class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
          >
            {{ key }}
          </kbd>
        </div>
        <span class="text-sm text-muted-foreground">{{ shortcut.description }}</span>
      </div>
    </div>
  </div>
</template>
