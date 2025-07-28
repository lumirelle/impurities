import antfu from '@antfu/eslint-config'

export default antfu(
  // The options for generating the ESLint configurations
  {
    // Disable typescript support, if your project is not using typescript but including `typescript` packages because of the ghost dependency
    typescript: false,

    // Enable formatters for css, markdown and etc. (requires `eslint-plugin-format`)
    // If you are using `stylelint`, you can set this property to a object with `css` property set to `false`
    formatters: true,

    // `.eslintignore` is no longer supported in flat config, use `ignores` option instead
    // Build output, node_modules and other common ignored files are already included
    ignores: [
      // Assets and static files
      '**/assets/font{,s}',
      '**/assets/icon{,s}',
      '**/assets/image{,s}',
      '**/assets/lang{,s}',
      '**/assets/json{,s}',
      '**/static',
      '**/public',
      '**/theme',
      // Nuxt html templates
      '**/app/view',
      '**/app.html',
      // Add your custom ignored files here
    ],
  },
)
  // NOTE: Custom (override) rules of `@antfu/config` below
  .override('antfu/javascript/rules', {
    rules: {
      // We need to use `console` in development environment, we can use build plugin to remove it in production environment
      'no-console': 'off',
    },
  })
  .override('antfu/regexp/rules', {
    rules: {
      // A large number of none-capturing groups are less readable than the same number of capturing groups
      // Tell the true, it's not so necessary to use none-capturing groups in most cases
      // Unless performance is sensitive or there are a large number of redundant captures, readability is more important
      // When working in teams, readability is more critical than which grouping you choose
      'regexp/no-unused-capturing-group': 'off',
    },
  })
  // FIXME: Compatible with old project, these rules are not providing auto-fix operation, please reactive these rules progressively
  .override('antfu/javascript/rules', {
    rules: {
      'eqeqeq': 'warn',
      'unused-imports/no-unused-vars': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      'no-irregular-whitespace': 'warn',
      'prefer-rest-params': 'warn',
    },
  })
  .override('antfu/vue/rules', {
    rules: {
      'vue/eqeqeq': 'warn',
      // Vue 3 recommends camelCase for custom event names
      'vue/custom-event-name-casing': ['warn', 'camelCase'],
      'vue/no-reserved-component-names': 'warn',
      'vue/no-unused-refs': 'warn',
      // You'd better not mutating props directly, it will break the unidirectional data flow
      // However, humans always tend to be lazy, wish they will not be debugging in hell in the future
      'vue/no-mutating-props': 'warn',
    },
  })
  // NOTE: Append custom rules below
  .append({
    name: 'lumirelle/setup',
    languageOptions: {
      globals: {
        // Add your custom global variables here
      },
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
