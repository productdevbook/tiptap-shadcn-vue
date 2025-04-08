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

    <!-- Installation Section - Outside of the grid with new design -->
    <div class="my-10 relative overflow-hidden">
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div class="absolute -bottom-20 -left-20 w-56 h-56 bg-primary/15 rounded-full blur-3xl" />

      <div class="relative z-10 border border-primary/30 bg-gradient-to-r from-background via-background/95 to-background/90 rounded-xl overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

        <div class="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div class="space-y-3 max-w-lg">
            <div class="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Installation
            </div>
            <h2 class="text-2xl font-bold">
              Add Tiptap to your project
            </h2>
            <p class="text-muted-foreground">
              Easily integrate this rich text editor into your Vue project with a simple command using shadcn-vue.
            </p>
          </div>

          <div class="flex-1 min-w-0 max-w-2xl">
            <div class="relative">
              <div class="bg-black rounded-md p-1 shadow-lg">
                <div class="flex items-center gap-2 px-4 py-2 border-b border-white/10">
                  <div class="flex gap-1.5">
                    <div class="w-3 h-3 rounded-full bg-red-500" />
                    <div class="w-3 h-3 rounded-full bg-yellow-500" />
                    <div class="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div class="text-xs text-gray-400 font-mono">
                    Terminal
                  </div>
                </div>
                <div class="p-4 font-mono text-sm text-white overflow-x-auto">
                  <code>npx shadcn-vue@latest add "https://tiptap-shadcn-vue.pages.dev/r/tiptap.json"</code>
                </div>
              </div>
              <button
                onclick="navigator.clipboard.writeText('npx shadcn-vue@latest add \'https://tiptap-shadcn-vue.pages.dev/r/tiptap.json\'')"
                class="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                title="Copy to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white/70">
                  <rect width="14" height="14" x="8" y="2" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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
