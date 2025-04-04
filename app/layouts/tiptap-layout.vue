<script setup lang="ts">
import { TiptapProvider, TiptapTreeStructure } from '@/components/tiptap'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import CharacterCount from '@tiptap/extension-character-count'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/vue-3'

// Editor content
const content = ref('')

// Initialize editor
const tiptapEditor = useEditor({
  content: content.value,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Write something…',
    }),
    Link.configure({
      openOnClick: false,
    }),
    CharacterCount.configure({
      limit: null,
    }),
  ],
  onUpdate: ({ editor }) => {
    content.value = editor.getHTML()
  },
  editable: true,
})

// Clean up editor on component unmount
onBeforeUnmount(() => {
  if (tiptapEditor.value) {
    tiptapEditor.value.destroy()
  }
})

// Navigation items
const navigationItems = [
  { name: 'Github Repo', icon: 'mdi:github', to: 'https://github.com/productdevbook/tiptap-shadcn-vue' },
]

// Computed properties for character and word counts
const characterCount = computed(() => {
  if (!tiptapEditor.value)
    return 0
  return tiptapEditor.value.storage.characterCount?.characters() ?? 0
})

const wordCount = computed(() => {
  if (!tiptapEditor.value)
    return 0
  return tiptapEditor.value.storage.characterCount?.words() ?? 0
})

// Add this to control keyboard shortcuts dialog
const showKeyboardShortcuts = ref(false)
</script>

<template>
  <TiptapProvider :editor="tiptapEditor">
    <div class="relative flex min-h-svh h-svh flex-col bg-background">
      <SidebarProvider>
        <div class="flex h-full w-full">
          <!-- Sidebar using shadcn-vue components -->
          <Sidebar collapsible="icon">
            <!-- Sidebar header -->
            <SidebarHeader>
              <SidebarMenuButton class="w-fit px-1.5">
                <Icon name="mdi:home" class="h-12 w-12" />
                <span class="truncate font-semibold">{{ 'Tiptap Editor' }}</span>
              </SidebarMenuButton>
            </SidebarHeader>

            <!-- Sidebar content -->
            <SidebarContent>
              <!-- Navigation group -->
              <SidebarGroup>
                <SidebarGroupLabel>
                  Navigation
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem v-for="item in navigationItems" :key="item.to">
                      <SidebarMenuButton as-child class="w-full">
                        <NuxtLink :to="item.to" target="_blank" class="flex items-center gap-2 w-full px-2 py-1.5">
                          <Icon :name="item.icon" class="h-4 w-4 flex-shrink-0" />
                          <span class="truncate">{{ item.name }}</span>
                        </NuxtLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <!-- Document structure group -->
              <SidebarGroup>
                <SidebarGroupLabel>
                  Document Structure
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <TiptapTreeStructure class="border-0 shadow-none" />
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <Button variant="ghost" size="sm" class="w-full justify-start">
                <Icon name="mdi:help-circle-outline" class="h-4 w-4 mr-2" />
                Help
              </Button>
            </SidebarFooter>
          </Sidebar>

          <!-- Main content area -->
          <div class="flex-1 flex flex-col h-full overflow-hidden">
            <header class="h-14 border-b p-2 bg-background flex items-center justify-between">
              <!-- Sidebar toggle button -->
              <div class="flex items-center gap-2">
                <SidebarTrigger />

                <h1 class="text-lg font-medium hidden sm:inline-block">
                  Tiptap Editor
                </h1>
              </div>

              <div class="flex items-center space-x-2">
                <div class="text-sm text-muted-foreground">
                  <Button variant="outline" size="sm" @click="showKeyboardShortcuts = true">
                    <Icon name="mdi:keyboard-outline" class="h-4 w-4 mr-1" />
                    Shortcuts
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icon name="mdi:help-circle-outline" class="h-4 w-4 mr-1" />
                    Help
                  </Button>
                </div>
              </div>
            </header>

            <!-- Main content (page) -->
            <main class="flex-1 overflow-auto">
              <slot />
            </main>

            <!-- Status Bar - moved from the page to the layout -->
            <div class="border-t p-2 bg-background mt-auto">
              <TiptapStatusBar :character-count="characterCount" :word-count="wordCount" />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>

    <!-- Keyboard shortcuts dialog -->
    <Dialog v-model:open="showKeyboardShortcuts">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            These shortcuts will help you use the editor more efficiently.
          </DialogDescription>
        </DialogHeader>
        <TiptapKeyboardShortcuts />
      </DialogContent>
    </Dialog>
  </TiptapProvider>
</template>

<style>
/* Dragging styles that need to be global */
body.is-dragging {
  cursor: grabbing !important;
}

body.is-dragging .outline-node {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

body.is-dragging .outline-node {
  cursor: grabbing !important;
}
</style>
