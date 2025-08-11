import type { UninstallOptions } from './types'
import { join, normalize } from 'node:path'
import consola from 'consola'
import { globSync } from 'tinyglobby'
import { GALLERIES, GLOBAL_PREFERENCES_IGNORE } from '.'
import { handleErrors } from './error'
import { existsSync, removeFile, removeSymlink } from './fs'
import { highlight } from './highlight'

/**
 * Uninstall preferences in all preference collections from the target path.
 * @param root - The root path
 * @param options - The uninstall options
 * @returns Whether the uninstallation succeeded
 */
export async function uninstall(
  root: string,
  options: UninstallOptions,
): Promise<boolean> {
  let hasError = false

  const { dryRun = false } = options

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

    const { condition, mode, folders } = gallery.installOptions
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
      for (const folder of Array.isArray(folders) ? folders : [folders]) {
        const uninstallPath = join(folder, path)

        // Skip if the uninstall path does not exist
        if (!existsSync(uninstallPath)) {
          consola.debug(`Ignore path: ${highlight.info(uninstallPath)}, reason: not exists`)
          continue
        }

        try {
        // Remove file if mode = 'copy'
          if (mode === 'copy') {
            if (dryRun || removeFile(uninstallPath)) {
              consola.success(`${highlight.red(dryRun ? 'WILL REMOVE:' : 'REMOVE:')} ${uninstallPath}`)
            }
          }
          // Remove symlink if mode = 'symlink' or else
          else if (mode === 'symlink' || !mode) {
            if (dryRun || removeSymlink(uninstallPath)) {
              consola.success(`${highlight.green(dryRun ? 'WILL UNSIML:' : 'UNSIML:')} ${uninstallPath}`)
            }
          }
        }
        catch (error) {
          hasError = true
          handleErrors(error, `${highlight.green(mode === 'copy' ? 'REMOVE:' : 'UNSIML:')} ${uninstallPath}`)
        }
      }
    }
  }

  return !hasError
}
