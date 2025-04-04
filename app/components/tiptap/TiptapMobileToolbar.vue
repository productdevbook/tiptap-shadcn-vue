<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { HTMLAttributes } from 'vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { computed, ref } from 'vue'
import { useTiptapContext } from '.'
import Icon from './TiptapIcon.vue'

const props = defineProps<{
  editor?: Editor | null
  class?: HTMLAttributes['class']
}>()

// Get editor from context if not provided directly
const { editor: contextEditor } = useTiptapContext()
const editor = computed(() => props.editor ?? contextEditor.value)

// Check if editor is ready
const isEditorReady = computed(() => {
  return editor.value && editor.value.isEditable
})

// Active formatting menu
const activeMenu = ref<'text' | 'paragraph' | 'list' | 'insert' | null>(null)

// Toggle active menu
function toggleMenu(menu: 'text' | 'paragraph' | 'list' | 'insert') {
  if (activeMenu.value === menu) {
    activeMenu.value = null
  }
  else {
    activeMenu.value = menu
  }
}

// Check if the current selection has an active mark
function isActive(type: string, attributes = {}) {
  if (!isEditorReady.value)
    return false

  return editor.value!.isActive(type, attributes)
}
</script>

<template>
  <div
    :class="cn(
      'tiptap-mobile-toolbar fixed bottom-0 left-0 right-0 bg-background border-t z-50',
      props.class,
    )"
    data-slot="tiptap-mobile-toolbar"
  >
    <!-- Main toolbar buttons -->
    <div class="flex items-center justify-around p-2">
      <Button
        size="sm"
        variant="ghost"
        :class="{ 'bg-accent': activeMenu === 'text' }"
        @click="toggleMenu('text')"
      >
        <Icon name="mdi:format-bold" class="h-5 w-5" />
        <span class="ml-1 text-xs">Text</span>
      </Button>

      <Button
        size="sm"
        variant="ghost"
        :class="{ 'bg-accent': activeMenu === 'paragraph' }"
        @click="toggleMenu('paragraph')"
      >
        <Icon name="mdi:format-paragraph" class="h-5 w-5" />
        <span class="ml-1 text-xs">Style</span>
      </Button>

      <Button
        size="sm"
        variant="ghost"
        :class="{ 'bg-accent': activeMenu === 'list' }"
        @click="toggleMenu('list')"
      >
        <Icon name="mdi:format-list-bulleted" class="h-5 w-5" />
        <span class="ml-1 text-xs">List</span>
      </Button>

      <Button
        size="sm"
        variant="ghost"
        :class="{ 'bg-accent': activeMenu === 'insert' }"
        @click="toggleMenu('insert')"
      >
        <Icon name="mdi:plus" class="h-5 w-5" />
        <span class="ml-1 text-xs">Insert</span>
      </Button>
    </div>

    <!-- Expandable submenus -->
    <div v-if="activeMenu" class="border-t p-2 flex overflow-x-auto gap-1 pb-safe">
      <!-- Text formatting submenu -->
      <template v-if="activeMenu === 'text'">
        <Button
          size="icon"
          variant="ghost"
          :class="{ 'bg-accent': isActive('bold') }"
          :disabled="!isEditorReady"
          @click="editor?.chain().focus().toggleBold().run()"
        >
          <Icon name="mdi:format-bold" class="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          :class="{ 'bg-accent': isActive('italic') }"
          :disabled="!isEditorReady"
          @click="editor?.chain().focus().toggleItalic().run()"
        >
          <Icon name="mdi:format-italic" class="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          :class="{ 'bg-accent': isActive('strike') }"
          :disabled="!isEditorReady"
          @click="editor?.chain().focus().toggleStrike().run()"
        >
          <Icon name="mdi:format-strikethrough" class="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          :class="{ 'bg-accent': isActive('code') }"
          :disabled="!isEditorReady"
          @click="editor?.chain().focus().toggleCode().run()"
        >
          <Icon name="mdi:code-tags" class="h-5 w-5" />
        </Button>
      </template>

      <!-- Paragraph styles submenu -->
      <template v-if="activeMenu === 'paragraph'">
        <Button
          size="icon"
          variant="ghost"
          :class="{ 'bg-accent': isActive('paragraph') }"
          :disabled="!isEditorReady"
          @click="editor?.chain().focus().setParagraph().run()"
        >
          <Icon name="mdi:format-paragraph" class="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          :class="{ 'bg-accent': isActive('heading', { level: 1 }) }"
          :disabled="!isEditorReady"
          @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
        >
          <Icon name="mdi:format-header-1" class="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          :class="{ 'bg-accent': isActive('heading', { level: 2 }) }"
          :disabled="!isEditorReady"
          @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        >
          <Icon name="mdi:format-header-2" class="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          :class="{ 'bg-accent': isActive('blockquote') }"
          :disabled="!isEditorReady"
          @click="editor?.chain().focus().toggleBlockquote().run()"
        >
          <Icon name="mdi:format-quote-close" class="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          :class="{ 'bg-accent': isActive('codeBlock') }"
          :disabled="!isEditorReady"
          @click="editor?.chain().focus().toggleCodeBlock().run()"
        >
          <Icon name="mdi:code-braces" class="h-5 w-5" />
        </Button>
      </template>

      <!-- List styles submenu -->
      <template v-if="activeMenu === 'list'">
        <Button
          size="icon"
          variant="ghost"
          :class="{ 'bg-accent': isActive('bulletList') }"
          :disabled="!isEditorReady"
          @click="editor?.chain().focus().toggleBulletList().run()"
        >
          <Icon name="mdi:format-list-bulleted" class="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          :class="{ 'bg-accent': isActive('orderedList') }"
          :disabled="!isEditorReady"
          @click="editor?.chain().focus().toggleOrderedList().run()"
        >
          <Icon name="mdi:format-list-numbered" class="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          :disabled="!editor?.can().sinkListItem('listItem')"
          @click="editor?.chain().focus().sinkListItem('listItem').run()"
        >
          <Icon name="mdi:format-indent-increase" class="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          :disabled="!editor?.can().liftListItem('listItem')"
          @click="editor?.chain().focus().liftListItem('listItem').run()"
        >
          <Icon name="mdi:format-indent-decrease" class="h-5 w-5" />
        </Button>
      </template>

      <!-- Insert submenu -->
      <template v-if="activeMenu === 'insert'">
        <Button
          size="icon"
          variant="ghost"
          :disabled="!isEditorReady"
          @click="editor?.chain().focus().setHorizontalRule().run()"
        >
          <Icon name="mdi:minus" class="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          :disabled="!isEditorReady"
          @click="$emit('open-component-selector')"
        >
          <Icon name="mdi:puzzle-outline" class="h-5 w-5" />
        </Button>
      </template>
    </div>
  </div>
</template>
