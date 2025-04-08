<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { shortcuts } from './tiptapTreeUtils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
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
