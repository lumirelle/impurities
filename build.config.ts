import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index.ts',
    'src/cli.ts',
  ],
  clean: true,
  declaration: 'node16',
  rollup: {
    inlineDependencies: [
      '@posva/prompts',

      'ansi-escapes',
      'isexe',
      'supports-color',
      'has-flag',
      'kleur',
      'sisteransi',
    ],
  },
})
