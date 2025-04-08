<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { computed } from 'vue'
import { useTiptapContext } from '.'

const props = defineProps<{
  editor: Editor | null
  class?: HTMLAttributes['class']
  fullScreen?: boolean
}>()

// Try to use the existing context from a parent TiptapProvider
let editorContext
try {
  editorContext = useTiptapContext()
}
catch (e) {
  // No provider found, this editor will manage its own state
  editorContext = null
}

// If there's a provider context, we'll use that
// Otherwise we'll render our own provider
const useExternalProvider = computed(() => !!editorContext)
</script>

<template>
  <div
    :class="cn(
      'tiptap-editor',
      props.fullScreen && 'fixed inset-0 z-50',
      props.class,
    )"
    data-slot="tiptap-editor"
  >
    <TiptapProvider v-if="!useExternalProvider" :editor="props.editor">
      <slot />
    </TiptapProvider>
    <template v-else>
      <slot />
    </template>
  </div>
</template>
