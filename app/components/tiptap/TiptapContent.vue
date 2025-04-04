<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { computed, onMounted, ref, watch } from 'vue'
import { useTiptapContext } from '.'

const props = defineProps<{
  editor?: Editor | null
  class?: HTMLAttributes['class']
  placeholder?: string
}>()

// Get editor from context if not provided directly
const { editor: contextEditor } = useTiptapContext()
const editor = computed(() => props.editor ?? contextEditor.value)

// Editor is ready when it's available and initialized
const isEditorReady = computed(() => {
  return editor.value && editor.value.isEditable
})

// Reference to the editor element
const editorElement = ref<HTMLElement | null>(null)

// Mount editor to DOM when editor is available or element changes
watch([editor, editorElement], ([currentEditor, element]) => {
  if (currentEditor && element && !element.firstChild) {
    // If editor is ready but not yet mounted to this element
    element.append(currentEditor.view.dom)
  }
}, { immediate: true })

// Also mount on component mount in case both are already available
onMounted(() => {
  if (isEditorReady.value && editorElement.value && !editorElement.value.firstChild) {
    editorElement.value.append(editor.value!.view.dom)
  }

  if (isEditorReady.value && editorElement.value && editorElement.value.firstChild) {
    // Add appropriate ARIA attributes
    const editorDOM = editorElement.value.firstChild as HTMLElement
    editorDOM.setAttribute('role', 'textbox')
    editorDOM.setAttribute('aria-multiline', 'true')
    editorDOM.setAttribute('aria-label', 'Rich text editor')

    // Add content description for screen readers
    const srDescription = document.createElement('span')
    srDescription.className = 'sr-only'
    srDescription.textContent = 'Use keyboard shortcuts like Ctrl+B for bold, Ctrl+I for italic. Press Alt+F10 for the toolbar.'
    editorElement.value.appendChild(srDescription)
  }
})
</script>

<template>
  <div
    :class="cn(
      'tiptap-editor-wrapper relative',
      props.class,
    )"
    data-slot="tiptap-content"
    aria-label="Rich text editor"
  >
    <div
      v-if="isEditorReady"
      ref="editorElement"
      class="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert h-full w-full focus:outline-none max-w-none px-4 py-6"
      role="region"
    />

    <div
      v-else
      class="tiptap-editor-placeholder h-full w-full flex items-center justify-center text-muted-foreground text-sm italic"
      aria-live="polite"
    >
      {{ placeholder || 'Loading editor...' }}
    </div>
  </div>
</template>

<style>
/* Editor styles */
.tiptap-editor-wrapper .ProseMirror {
  min-height: 100px;
  height: 100%;
  border: none;
  outline: none;
}

.tiptap-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* Component styles */
.tiptap-editor-wrapper .component-node {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.tiptap-editor-wrapper .component-selected {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Heading styles */
.tiptap-editor-wrapper h1 {
  font-size: 2em;
  margin-top: 0.67em;
  margin-bottom: 0.67em;
}

.tiptap-editor-wrapper h2 {
  font-size: 1.5em;
  margin-top: 0.83em;
  margin-bottom: 0.83em;
}

.tiptap-editor-wrapper h3 {
  font-size: 1.17em;
  margin-top: 1em;
  margin-bottom: 1em;
}

/* Node selection styles */
.tiptap-editor-wrapper .ProseMirror .is-node-selected {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Placeholder for empty nodes */
.tiptap-editor-wrapper .ProseMirror p.is-empty::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* Focus indicators for accessibility */
.tiptap-editor-wrapper .ProseMirror:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

/* Better focus styles for interactive elements */
.tiptap-editor-wrapper .ProseMirror *[data-interactive]:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}

/* High contrast mode support */
@media (forced-colors: active) {
  .tiptap-editor-wrapper .ProseMirror:focus-visible {
    outline: 3px solid CanvasText;
  }

  .tiptap-editor-wrapper .component-selected {
    outline: 3px solid Highlight;
  }
}
</style>
