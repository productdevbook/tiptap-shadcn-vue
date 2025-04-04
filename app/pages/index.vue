<script setup lang="ts">
// Using Nuxt 4 with Vue 3 Composition API
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-4xl font-bold mb-6">
      Tiptap Editor with shadcn-vue
    </h1>
    <p class="mb-4">
      A modern, extensible rich text editor built with Tiptap, shadcn-vue components, and Nuxt 4.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <!-- Tiptap Example 1 Card -->
      <NuxtLink to="/tiptap" class="border-2 border-primary rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 bg-primary/5">
        <div class="flex flex-col items-center text-center">
          <div class="text-3xl mb-3">
            ✏️
          </div>
          <h2 class="text-2xl font-bold mb-2">
            Example 1
          </h2>
          <p class="mb-4">
            Full-screen WYSIWYG editor with responsive toolbar and mobile support.
          </p>
          <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md mt-2">
            Try Example
          </button>
        </div>
      </NuxtLink>

      <!-- Add Your Example Card -->
      <div class="border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors duration-300 flex flex-col items-center justify-center text-center">
        <div class="text-3xl mb-3">
          ➕
        </div>
        <h2 class="text-2xl font-bold mb-2">
          Add Your Example
        </h2>
        <p class="mb-4">
          Contribute your own Tiptap editor example to showcase different configurations and use cases.
        </p>
        <a
          href="https://github.com/productdevbook/tiptap-shadcn-vue#contributing" target="_blank" rel="noopener noreferrer"
          class="bg-muted hover:bg-muted/80 text-muted-foreground px-4 py-2 rounded-md mt-2 inline-block"
        >
          How to Contribute
        </a>
      </div>

      <!-- Contribute Card -->
      <div class="border rounded-lg p-6 shadow-sm bg-card">
        <h2 class="text-xl font-semibold mb-2">
          Contribute to the Project
        </h2>
        <p class="mb-4">
          This project is open source and MIT licensed. We welcome your contributions!
        </p>

        <div class="flex flex-col space-y-3 mt-4">
          <a
            href="https://github.com/productdevbook/tiptap-shadcn-vue" target="_blank" rel="noopener noreferrer"
            class="flex items-center space-x-2 text-primary hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-github">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            <span>GitHub Repository</span>
          </a>

          <a
            href="https://x.com/productdevbook" target="_blank" rel="noopener noreferrer"
            class="flex items-center space-x-2 text-primary hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
            <span>Follow on X</span>
          </a>
        </div>

        <div class="mt-6 text-sm text-muted-foreground">
          <p>This project is available under the MIT License.</p>
        </div>
      </div>
    </div>
  </div>
</template>
