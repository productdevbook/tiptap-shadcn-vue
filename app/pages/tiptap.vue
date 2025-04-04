<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
// Set the layout
definePageMeta({
  layout: 'tiptap-layout'
})

// Add this to determine if we're on mobile
const isMobile = useMediaQuery('(max-width: 768px)')
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Editor Header with Toolbar -->
    <div v-if="!isMobile" class="border-b p-2 bg-background">
      <div class="flex items-center justify-between flex-wrap gap-y-2">
        <!-- Toolbar - Only show on desktop -->
        <TiptapToolbar 
          class="flex-1"
        />
      </div>
    </div>
    
    <!-- Editor Content Area -->
    <div class="flex-1 overflow-auto">
      <TiptapContent placeholder="Start writing..." />
    </div>
    
    <!-- Mobile toolbar - Only show on mobile -->
    <TiptapMobileToolbar 
      v-if="isMobile" 
      class="pb-safe"
    />
  </div>
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
