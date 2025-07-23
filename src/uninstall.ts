import { join, normalize } from 'node:path'
import consola from 'consola'
import { globSync } from 'tinyglobby'
import { GALLERIES, GLOBAL_PREFERENCES_IGNORE } from '.'
import { existsSync, removeFile, removeSymlink } from './fs'
import { highlight } from './highlight'

/**
 * Uninstall preferences in all preference collections from the target path.
 * @param options - The uninstall options
 * @returns A promise that resolves when the preference collections are uninstalled, or rejects with an error
 */
export function uninstall() {
  for (const gallery of GALLERIES) {
    // Check if the gallery is a preference gallery and has install options
    if (gallery.type !== 'preference' || !gallery.installOptions) {
      continue
    }

    const installOptions = gallery.installOptions
    const matchOptions = gallery.matchOptions

    if (installOptions.condition && !installOptions.condition()) {
      continue
    }

    // Get the preference paths relative to the provided cwd path
    const paths = globSync(matchOptions.pattern, {
      cwd: matchOptions.cwd,
      ignore: [
        ...GLOBAL_PREFERENCES_IGNORE,
        ...(matchOptions.ignore || []),
      ],
      dot: true,
    }).map(path => normalize(path))

    for (const path of paths) {
      for (const folder of Array.isArray(installOptions.folders) ? installOptions.folders : [installOptions.folders]) {
        const uninstallPath = join(folder, path)

        // Skip if the uninstall path does not exist
        if (!existsSync(uninstallPath)) {
          continue
        }

        try {
          // Copy if mode = 'copy'
          if (installOptions.mode === 'copy' && removeFile(uninstallPath)) {
            consola.success(`${highlight.red('REMOVE:')} ${uninstallPath}`)
          }
          // Create symlink if mode = 'symlink' or else
          else if (removeSymlink(uninstallPath)) {
            consola.success(`${highlight.green('UNSIML:')} ${uninstallPath}`)
          }
        }
        catch (error) {
          consola.error(error)
        }
      }
    }
  }
}
