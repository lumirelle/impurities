/**
 * Copy & Paste specific template.
 *
 * @example
 *
 * Copy `LICENSE` to current directory.
 *
 * ```shell
 * ict LICENSE
 * ```
 *
 * @example
 *
 * Copy `LICENSE` to `./src`
 *
 * ```shell
 * ict LICENSE ./src
 * ```
 *
 * @example
 *
 * Copy `LICENSE` & rename it to `./src/MY_LICENSE`
 *
 * ```shell
 * ict LICENSE ./src/MY_LICENSE
 * ```
 */

import type { Parameter } from '../parse'
import type { RunnerContext } from '../runner'
import { getRoot } from '../fs'
import { copyPasteTemplate } from '../impurities'
import { extractBoolean, extractString } from '../parse'
import { runCli } from '../runner'

runCli(async (context: RunnerContext, parameters: Parameter[]) => {
  const { cwd } = context

  const root = getRoot(import.meta.url)

  const sourceName = extractString(parameters, { keys: ['-s', '--source'], position: 0 })
  const targetPath = extractString(parameters, { keys: ['-t', '--target'], position: 1 })
  const force = extractBoolean(parameters, { keys: ['-f', '--force'] })

  await copyPasteTemplate(root, cwd, sourceName, targetPath, force)
})
