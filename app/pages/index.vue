<script setup lang="ts">
// Using Nuxt 4 with Vue 3 Composition API
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-4xl font-bold mb-6">Welcome to your Nuxt 4 App</h1>
    <p class="mb-4">This is your homepage powered by Nuxt 4 and shadcn-vue components.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <div class="border rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-semibold mb-2">UI Components</h2>
        <p>Explore the shadcn-vue components in your app.</p>
      </div>
      
      <div class="border rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-semibold mb-2">Markdown Content</h2>
        <p>Use MDC for rich content with Vue components.</p>
      </div>
      
      <div class="border rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-semibold mb-2">Tailwind CSS</h2>
        <p>Style your application with utility-first CSS.</p>
      </div>
    </div>
  </div>
</template>