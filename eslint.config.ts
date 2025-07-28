import antfu from '@antfu/eslint-config'

export default antfu({
  pnpm: true,
  formatters: true,
})
  .override('antfu/yaml/pnpm-workspace', {
    rules: {
      'pnpm/yaml-no-duplicate-catalog-item': 'off',
    },
  })
  .append({
    name: 'lumirelle/tsconfig/rules',
    files: [
      '**/{t,j}sconfig.json',
    ],
    rules: {
      'jsonc/sort-keys': 'off',
    },
  })
