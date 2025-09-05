import type { InstallOptions, PasteOptions, UninstallOptions } from './types'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import cac from 'cac'
import consola, { LogLevels } from 'consola'
import { version } from '../package.json'
import { install } from './install'
import { paste } from './paste'
import { uninstall } from './uninstall'

const cli = cac('impurities')

const root = fileURLToPath(new URL('..', import.meta.url))

cli
  .command('install', 'Install preferences to your system')
  .alias('i')
  .option('--force, -f', 'force install')
  .option('--verbose, -v', 'verbose output')
  .option('--dry-run, -d', 'dry run')
  .action(async (options: InstallOptions) => {
    consola.warn('This package is deprecated again! See https://github.com/lumirelle/starship-butler.')
    if (options.verbose) {
      consola.level = LogLevels.debug
    }
    if (!await install(root, options)) {
      consola.warn('Some preferences are not installed successfully!')
    }
  })

cli.command('uninstall', 'Uninstall preferences from your system')
  .alias('u')
  .option('--verbose, -v', 'verbose output')
  .option('--dry-run, -d', 'dry run')
  .action((options: UninstallOptions) => {
    consola.warn('This package is deprecated again! See https://github.com/lumirelle/starship-butler.')
    if (options.verbose) {
      consola.level = LogLevels.debug
    }
    if (!uninstall(root, options)) {
      consola.warn('Some preferences are not uninstalled successfully!')
    }
  })

cli.command('paste [source] [target]', 'Paste everything to the target path')
  .alias('p')
  .option('--source, -s <source>', 'the source name')
  .option('--target, -t <target>', 'the target path')
  .option('--force, -f', 'force overwrite')
  .option('--verbose, -v', 'verbose output')
  .option('--dry-run, -d', 'dry run')
  .action(async (source: string, target: string, options: PasteOptions) => {
    consola.warn('This package is deprecated again! See https://github.com/lumirelle/starship-butler.')
    if (options.verbose) {
      consola.level = LogLevels.debug
    }
    if (!await paste(root, {
      source,
      target,
      ...options,
    })) {
      consola.warn('Some files are not pasted successfully!')
    }
  })

cli.help()

cli.version(version)

try {
  cli.parse(process.argv, { run: false })
  await cli.runMatchedCommand()
}
catch (error) {
  consola.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
