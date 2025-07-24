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
  const { force = false, verbose = false, dryRun = false } = options

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
      const absolutePath = join(root, cwd, path)

      for (const folder of Array.isArray(folders) ? folders : [folders]) {
        const installPath = join(folder, path)

        // Ensure the parent directory of install path exists
        if (!dryRun) {
          ensureDir(installPath)
        }

        // Copy if mode = 'copy'
        if (mode === 'copy') {
          if (dryRun || copyFile(absolutePath, installPath, force)) {
            // Only show the absolute path when verbose mode is enabled
            consola.success(`${highlight.red(dryRun ? 'WILL COPY:' : 'COPY:')} ${verbose ? absolutePath : path} ${highlight.important('>>')} ${installPath}`)
          }
        }
        // Create symlink if mode = 'symlink' or else
        else if (mode === 'symlink' || !mode) {
          if (dryRun || await createSymlink(absolutePath, installPath, force)) {
            // Only show the absolute path when verbose mode is enabled
            consola.success(`${highlight.green(dryRun ? 'WILL SYML:' : 'SYML:')} ${verbose ? absolutePath : path} ${highlight.important('<-')} ${installPath}`)
          }
        }
      }
    }
  }
}
