<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { HTMLAttributes } from 'vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { computed } from 'vue'
import { useTiptapContext } from '.'
import Icon from './TiptapIcon.vue'

const props = defineProps<{
  editor?: Editor | null
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{}>()

// Get editor from context if not provided directly
const { editor: contextEditor } = useTiptapContext()
const editor = computed(() => props.editor ?? contextEditor.value)

// Check if editor is ready
const isEditorReady = computed(() => {
  return editor.value && editor.value.isEditable
})

// Check if the current selection has an active mark
function isActive(type: string, attributes = {}) {
  if (!isEditorReady.value)
    return false

  return editor.value!.isActive(type, attributes)
}

// Character and word count
const wordCount = computed(() => {
  if (!isEditorReady.value)
    return { characters: 0, words: 0 }
  const text = editor.value?.state.doc.textContent || ''
  return {
    characters: text.length,
    words: text.split(/\s+/).filter(word => word.length > 0).length,
  }
})
</script>

<template>
  <div
    :class="cn(
      'tiptap-toolbar flex flex-wrap gap-1 items-center',
      props.class,
    )"
    data-slot="tiptap-toolbar"
  >
    <!-- History controls -->
    <div class="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              :disabled="!editor?.can().undo()"
              @click="editor?.chain().focus().undo().run()"
            >
              <Icon name="mdi:undo" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              :disabled="!editor?.can().redo()"
              @click="editor?.chain().focus().redo().run()"
            >
              <Icon name="mdi:redo" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <Separator orientation="vertical" class="h-6" />

    <!-- Basic Text Formatting -->
    <div class="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              :class="{ 'bg-accent': isActive('bold') }"
              :disabled="!isEditorReady"
              @click="editor?.chain().focus().toggleBold().run()"
            >
              <Icon name="mdi:format-bold" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              :class="{ 'bg-accent': isActive('italic') }"
              :disabled="!isEditorReady"
              @click="editor?.chain().focus().toggleItalic().run()"
            >
              <Icon name="mdi:format-italic" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              :class="{ 'bg-accent': isActive('strike') }"
              :disabled="!isEditorReady"
              @click="editor?.chain().focus().toggleStrike().run()"
            >
              <Icon name="mdi:format-strikethrough" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Strike Through</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              :class="{ 'bg-accent': isActive('code') }"
              :disabled="!isEditorReady"
              @click="editor?.chain().focus().toggleCode().run()"
            >
              <Icon name="mdi:code-tags" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Inline Code</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <Separator orientation="vertical" class="h-6" />

    <!-- Headings -->
    <div class="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              :class="{ 'bg-accent': isActive('heading', { level: 1 }) }"
              :disabled="!isEditorReady"
              @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
            >
              <Icon name="mdi:format-header-1" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 1</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              :class="{ 'bg-accent': isActive('heading', { level: 2 }) }"
              :disabled="!isEditorReady"
              @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
            >
              <Icon name="mdi:format-header-2" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 2</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              :class="{ 'bg-accent': isActive('heading', { level: 3 }) }"
              :disabled="!isEditorReady"
              @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
            >
              <Icon name="mdi:format-header-3" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 3</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              :class="{ 'bg-accent': isActive('paragraph') }"
              :disabled="!isEditorReady"
              @click="editor?.chain().focus().setParagraph().run()"
            >
              <Icon name="mdi:format-paragraph" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Paragraph</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <Separator orientation="vertical" class="h-6" />

    <!-- Lists -->
    <div class="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              :class="{ 'bg-accent': isActive('bulletList') }"
              :disabled="!isEditorReady"
              @click="editor?.chain().focus().toggleBulletList().run()"
            >
              <Icon name="mdi:format-list-bulleted" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bullet List</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              :class="{ 'bg-accent': isActive('orderedList') }"
              :disabled="!isEditorReady"
              @click="editor?.chain().focus().toggleOrderedList().run()"
            >
              <Icon name="mdi:format-list-numbered" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Numbered List</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <Separator orientation="vertical" class="h-6" />

    <!-- Special Elements -->
    <div class="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              :class="{ 'bg-accent': isActive('blockquote') }"
              :disabled="!isEditorReady"
              @click="editor?.chain().focus().toggleBlockquote().run()"
            >
              <Icon name="mdi:format-quote-close" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Quote</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              :disabled="!isEditorReady"
              @click="editor?.chain().focus().setHorizontalRule().run()"
            >
              <Icon name="mdi:minus" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Horizontal Divider</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              size="icon"
              variant="ghost"
              :class="{ 'bg-accent': isActive('codeBlock') }"
              :disabled="!isEditorReady"
              @click="editor?.chain().focus().setCodeBlock().run()"
            >
              <Icon name="mdi:code-braces" class="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Code Block</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <Separator orientation="vertical" class="h-6" />

    <!-- Word count -->
    <div class="ml-auto flex items-center text-xs text-muted-foreground">
      <span>{{ wordCount.words }} words</span>
      <Separator orientation="vertical" class="h-4 mx-2" />
      <span>{{ wordCount.characters }} characters</span>
    </div>
  </div>
</template>
