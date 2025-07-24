import type { UninstallOptions } from './types'
import { join, normalize } from 'node:path'
import consola from 'consola'
import { globSync } from 'tinyglobby'
import { GALLERIES, GLOBAL_PREFERENCES_IGNORE } from '.'
import { existsSync, removeFile, removeSymlink } from './fs'
import { highlight } from './highlight'

/**
 * Uninstall preferences in all preference collections from the target path.
 * @param options - The uninstall options
 * @returns Whether the uninstallation succeeded
 */
export async function uninstall(options: UninstallOptions): Promise<boolean> {
  let hasError = false

  const { dryRun = false } = options

  for (const gallery of GALLERIES) {
    // Check if the gallery is a preference gallery and has install options
    if (gallery.type !== 'preference' || !gallery.installOptions) {
      continue
    }

    const { condition, mode, folders } = gallery.installOptions
    const { pattern, cwd, ignore } = gallery.matchOptions

    if (condition && !condition()) {
      continue
    }

    // Get the preference paths relative to the provided cwd path
    const paths = globSync(pattern, {
      cwd,
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
          if (error instanceof Error && error.message.includes('EPERM')) {
            consola.error(
              `${highlight.red('Requires administrator permission! Please rerun the command with \'sudo\'')}\n\n${highlight.red(mode === 'copy' ? 'REMOVE:' : 'UNSIML:')} ${uninstallPath}`,
            )
          }
        }
      }
    }
  }

  return !hasError
}
