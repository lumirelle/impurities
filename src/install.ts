import type { InstallOptions } from './types'
import { join, normalize } from 'node:path'
import consola from 'consola'
import { globSync } from 'tinyglobby'
import { GALLERIES, GLOBAL_PREFERENCES_IGNORE } from '.'
import { copyFile, createSymlink, ensureDir } from './fs'
import { highlight } from './highlight'

/**
 * Install preferences in all preference collections to the target path.
 * @param options - The install options
 * @returns A promise that resolves when the preference collections are installed, or rejects with an error
 */
export async function install(
  root: string,
  options: InstallOptions,
) {
  const { force = false, verbose = false } = options

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
      const absolutePath = join(root, matchOptions.cwd, path)

      for (const folder of Array.isArray(installOptions.folders) ? installOptions.folders : [installOptions.folders]) {
        const installPath = join(folder, path)

        // Ensure the parent directory of install path exists
        ensureDir(installPath)

        // Copy if mode = 'copy'
        try {
          if (installOptions.mode === 'copy' && copyFile(absolutePath, installPath, force)) {
            // Only show the absolute path when verbose mode is enabled
            consola.success(`${highlight.red('COPY:')} ${verbose ? absolutePath : path} ${highlight.important('>>')} ${installPath}`)
          }
          // Create symlink if mode = 'symlink' or else
          else if (await createSymlink(absolutePath, installPath, force)) {
            // Only show the absolute path when verbose mode is enabled
            consola.success(`${highlight.green('SYML:')} ${verbose ? absolutePath : path} ${highlight.important('<-')} ${installPath}`)
          }
        }
        catch (error) {
          consola.error(error)
        }
      }
    }
  }
}
