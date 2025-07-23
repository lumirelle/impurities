import type { UserConfig } from '@commitlint/types'

/**
 * @see https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional for more details.
 */
const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // <type>, based on the conventional commit spec, add 'merge' and 'wip' to the list.
    'type-enum': [
      2,
      'always',
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'merge', 'wip'],
    ],
  },
}

export default config
