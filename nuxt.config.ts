// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  css: [
    'notivue/notification.css',
    'notivue/animations.css',
  ],
  modules: [
    '@nuxt/icon',
    'notivue/nuxt',
  ],
  icon: {
    serverBundle: 'remote',
    mode: 'svg',
  },
})