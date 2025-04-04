import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '**/.output',
    '**/.nitro',
    '**/.netlify',
    '**/.nuxt',
    '**/dist',
    '**/components/ui',
  ],
}, {
  rules: {
    'node/prefer-global/process': 'off',
  },
})
