/**
 * Install all the preferences supported install operations.
 *
 * @example
 *
 * ```shell
 * iip
 * ```
 *
 * @example
 *
 * Force install, requires admin privileges.
 *
 * ```shell
 * iip -f
 * ```
 */

import type { Parameter } from '../parse'
import type { RunnerContext } from '../runner'
import { getRoot } from '../fs'
import { installPreferences } from '../impurities'
import { format, log } from '../logger'
import { extractBoolean } from '../parse'
import { runCli } from '../runner'

runCli(async (context: RunnerContext, parameters: Parameter[]) => {
  const root = getRoot(import.meta.url)

  const force = extractBoolean(parameters, { keys: ['-f', '--force'] })

  log.info(`Starting to install preferences ${force ? format.highlight('in force mode ') : ''}...`)
  await installPreferences(root, force)
})
