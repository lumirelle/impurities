import type { InstallOptions } from './types'
import { join, normalize } from 'node:path'
import consola from 'consola'
import { globSync } from 'tinyglobby'
import { GALLERIES, GLOBAL_PREFERENCES_IGNORE } from '.'
import { copyFile, createSymlink, ensureDir } from './fs'
import { highlight } from './highlight'

/**
 * Install preferences in all preference collections to the target path.
 * @param root - The root path of the project
 * @param options - The install options
 * @returns A promise that returns whether the installation succeeded
 */
export async function install(
  root: string,
  options: InstallOptions,
): Promise<boolean> {
  let hasError = false

  const { force = false, verbose = false, dryRun = false } = options

  consola.debug(`Root: ${highlight.info(root)}\n`)

  consola.debug('Galleries:')
  for (let i = 0; i < GALLERIES.length; i++) {
    consola.debug(`- ${highlight.info(GALLERIES[i]?.name || 'unknown')}${i < GALLERIES.length - 1 ? '' : '\n'}`)
  }

  for (const gallery of GALLERIES) {
    consola.debug(`Processing gallery: ${JSON.stringify(gallery, null, 2)}\n`)

    // Check if the gallery is a preference gallery and has install options
    if (gallery.type !== 'preference' || !gallery.installOptions) {
      consola.debug(`Ignore gallery: ${highlight.info(gallery.name)}, reason: ${highlight.important(gallery.type !== 'preference' ? 'not preference' : 'no install options')}\n`)
      continue
    }

    const { mode, folders, condition, afterInstall } = gallery.installOptions
    const { pattern, cwd, ignore } = gallery.matchOptions

    if (condition && !condition()) {
      consola.debug(`Ignore gallery: ${highlight.info(gallery.name)}, reason: ${highlight.important('condition not met')}\n`)
      continue
    }

    // Get the preference paths relative to the provided cwd path
    const paths = globSync(pattern, {
      cwd: join(root, cwd),
      ignore: [
        ...GLOBAL_PREFERENCES_IGNORE,
        ...(ignore || []),
      ],
      dot: true,
    }).map(path => normalize(path))

    for (const path of paths) {
      const absolutePath = join(root, cwd, path)

      for (const folder of Array.isArray(folders) ? folders : [folders]) {
        const installPath = join(folder, path)

        // Ensure the parent directory of install path exists
        if (!dryRun) {
          ensureDir(installPath)
        }

        try {
        // Copy if mode = 'copy'
          if (mode === 'copy') {
            if (dryRun || copyFile(absolutePath, installPath, force)) {
              // Only show the absolute path when verbose mode is enabled
              consola.success(`${highlight.red(dryRun ? 'WILL COPY:' : 'COPY:')} ${verbose ? absolutePath : path} ${highlight.important('>>')} ${installPath}`)
            }
            if (afterInstall) {
              await afterInstall(options)
            }
          }
          // Create symlink if mode = 'symlink' or else
          else if (mode === 'symlink' || !mode) {
            if (dryRun || await createSymlink(absolutePath, installPath, force)) {
              // Only show the absolute path when verbose mode is enabled
              consola.success(`${highlight.green(dryRun ? 'WILL SYML:' : 'SYML:')} ${verbose ? absolutePath : path} ${highlight.important('<-')} ${installPath}`)
            }
            if (afterInstall) {
              await afterInstall(options)
            }
          }
        }
        catch (error) {
          hasError = true
          if (error instanceof Error && error.message.includes('EPERM')) {
            consola.error(
              `${highlight.red('Requires administrator permission! Please rerun the command with \'sudo\'')}\n\n${highlight.red(mode === 'copy' ? 'COPY:' : 'SYML:')} ${verbose ? absolutePath : path} ${highlight.important(mode === 'copy' ? '>>' : '<-')} ${installPath}`,
            )
          }
        }
      }
    }
  }

  return Promise.resolve(!hasError)
}
