<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { HTMLAttributes } from 'vue'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { computed, ref, watch } from 'vue'
import { useTiptapContext } from '.'

const props = defineProps<{
  editor?: Editor | null
  class?: HTMLAttributes['class']
  showWordCount?: boolean
  showCharCount?: boolean
  showSelection?: boolean
}>()

// Get editor from context if not provided directly
const { editor: contextEditor } = useTiptapContext()
const editor = computed(() => props.editor ?? contextEditor.value)

// Editor is ready when it's available and initialized
const isEditorReady = computed(() => {
  return editor.value && editor.value.isEditable
})

// Calculate word and character count
const wordCount = ref(0)
const charCount = ref(0)
const selection = ref({ from: 0, to: 0, text: '' })

// Update counts based on editor content
function updateCounts() {
  if (!isEditorReady.value)
    return

  const text = editor.value!.state.doc.textContent
  charCount.value = text.length
  wordCount.value = text.split(/\s+/).filter(word => word.length > 0).length

  // Get selection info
  const { from, to } = editor.value!.state.selection
  selection.value = {
    from,
    to,
    text: editor.value!.state.doc.textBetween(from, to, ' '),
  }
}

// Watch for editor changes and update counts
watch(() => editor.value, (newEditor) => {
  if (newEditor) {
    updateCounts()

    // Set up transaction handler for real-time updates
    newEditor.on('transaction', () => {
      updateCounts()
    })
  }
}, { immediate: true })
</script>

<template>
  <div
    :class="cn(
      'tiptap-status-bar flex items-center justify-between px-3 py-1 text-xs',
      props.class,
    )"
    data-slot="tiptap-status-bar"
  >
    <!-- Document stats -->
    <div class="flex items-center gap-3">
      <span v-if="props.showWordCount" class="text-muted-foreground">
        {{ wordCount }} words
      </span>
      <span v-if="props.showCharCount" class="text-muted-foreground">
        {{ charCount }} characters
      </span>
    </div>

    <!-- Selection info -->
    <div v-if="props.showSelection && selection.from !== selection.to" class="text-muted-foreground">
      {{ selection.to - selection.from }} characters selected
    </div>

    <!-- Editor mode -->
    <div class="flex items-center gap-2">
      <Badge v-if="isEditorReady" variant="outline">
        {{ editor?.isEditable ? 'Editing' : 'Reading' }}
      </Badge>
    </div>
  </div>
</template>
