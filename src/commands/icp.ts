/**
 * Copy & Paste specific preference.
 *
 * @example
 *
 * Copy `eslint.config.mjs` to current directory.
 *
 * ```shell
 * icp eslint.config.mjs
 * ```
 *
 * @example
 *
 * Copy `eslint.config.mjs` to `./src`
 *
 * ```shell
 * icp eslint.config.mjs ./src
 * ```
 *
 * @example
 *
 * Copy `eslint.config.mjs` & rename it to `./src/my.eslint.config.mjs`
 *
 * ```shell
 * icp eslint.config.mjs ./src/my.eslint.config.mjs
 * ```
 */

import type { Parameter } from '../parse'
import type { RunnerContext } from '../runner'
import { getRoot } from '../fs'
import { copyPastePreference } from '../impurities'
import { extractBoolean, extractString } from '../parse'
import { runCli } from '../runner'

runCli(async (context: RunnerContext, parameters: Parameter[]) => {
  const { cwd } = context

  const root = getRoot(import.meta.url)

  const sourceName = extractString(parameters, { keys: ['-s', '--source'], position: 0 })
  const targetPath = extractString(parameters, { keys: ['-t', '--target'], position: 1 })
  const force = extractBoolean(parameters, { keys: ['-f', '--force'] })

  await copyPastePreference(root, cwd, sourceName, targetPath, force)
})
