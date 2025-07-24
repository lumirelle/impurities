import antfu from '@antfu/eslint-config'

export default antfu({
  pnpm: true,
  formatters: true,
})
  .append({
    name: 'lumirelle/jsonc/rules',
    files: [
      '**/{t,j}sconfig.json',
    ],
    rules: {
      'jsonc/sort-keys': 'off',
    },
  })
