/**
 * Uninstall all the preferences installed by `iip`.
 *
 * @example
 *
 * ```shell
 * iup
 * ```
 */

import { getRoot } from '../fs'
import { uninstallPreferences } from '../impurities'
import { log } from '../logger'
import { runCli } from '../runner'

runCli(async () => {
  const root = getRoot(import.meta.url)

  log.info('Starting to remove preferences...')
  await uninstallPreferences(root)
})
