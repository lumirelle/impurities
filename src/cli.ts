import type { InstallOptions, PasteOptions, UninstallOptions } from './types'
import { fileURLToPath } from 'node:url'
import cac from 'cac'
import consola, { LogLevels } from 'consola'
import { version } from '../package.json'
import { install } from './install'
import { paste } from './paste'
import { isAdmin } from './permission'
import { uninstall } from './uninstall'

const cli = cac('impurities')

const root = fileURLToPath(new URL('..', import.meta.url))

cli
  .command('install', 'Install preferences to your system')
  .alias('i')
  .option('--force, -f', 'force install')
  .option('--verbose, -v', 'verbose output')
  .option('--dry-run, -d', 'dry run')
  .action((options: InstallOptions) => {
    if (options.verbose) {
      consola.level = LogLevels.debug
    }
    // Check if require administrator permission
    if (!isAdmin()) {
      consola.error('Install requires administrator permission!')
      return
    }
    install(root, options)
  })

cli.command('uninstall', 'Uninstall preferences from your system')
  .alias('u')
  .option('--verbose, -v', 'verbose output')
  .option('--dry-run, -d', 'dry run')
  .action((options: UninstallOptions) => {
    if (options.verbose) {
      consola.level = LogLevels.debug
    }
    // Check if require administrator permission
    if (!isAdmin()) {
      consola.error('Uninstall requires administrator permission!')
      return
    }
    uninstall(options)
  })

cli.command('paste [source] [target]', 'Paste everything to the target path')
  .alias('p')
  .option('--source, -s <source>', 'the source name')
  .option('--target, -t <target>', 'the target path')
  .option('--force, -f', 'force overwrite')
  .option('--verbose, -v', 'verbose output')
  .option('--dry-run, -d', 'dry run')
  .action(async (source: string, target: string, options: PasteOptions) => {
    if (options.verbose) {
      consola.level = LogLevels.debug
    }
    paste(root, {
      source,
      target,
      ...options,
    })
  })

cli.help()

cli.version(version)

cli.parse()
