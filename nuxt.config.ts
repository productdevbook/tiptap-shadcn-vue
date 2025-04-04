// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'


export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  css: [
    '~/assets/css/tailwind.css',
    'notivue/notification.css',
    'notivue/animations.css',
  ],
  modules: [
    '@nuxt/icon', 
    'notivue/nuxt', 
    'shadcn-nuxt',
  ],
  icon: {
    serverBundle: 'remote',
    mode: 'svg',
  },
  notivue: {
    notifications: {
      global: {
        duration: 2000,
      },
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: [
        '@vueuse/core',
        'clsx',
        'tailwind-merge',
        'reka-ui',
        'class-variance-authority',
        '@iconify/vue',
        '@atlaskit/pragmatic-drag-and-drop/element/adapter',
        '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item',
        '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview',
        '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview',
        '@atlaskit/pragmatic-drag-and-drop/combine',
        'lucide-vue-next',
        '@tiptap/vue-3',
        '@tiptap/starter-kit',
        '@tiptap/extension-placeholder',
        '@tiptap/extension-link',
        '@tiptap/extension-character-count'
      ],
    },
  },
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },
})