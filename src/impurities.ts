import { basename, dirname, join, normalize, relative } from 'node:path'
import prompts from '@posva/prompts'
import { globSync } from 'tinyglobby'
import { PREFERENCE_COLLECTIONS, TEMPLATE_COLLECTIONS } from '.'
import { copyFile, createSymlink, ensureDir, existsSync, isDirectory, removeFile, removeSymlink } from './fs'
import { format, log } from './logger'
import { isAdmin } from './permission'

// ------------------------------------------------------------
// Preferences
// ------------------------------------------------------------

/**
 * Install preferences in all preference collections to the target path.
 * @param root - The root path of this package
 * @param force - Whether to force the existing preference
 * @returns A promise that resolves when the preference collections are installed, or rejects with an error
 */
export async function installPreferences(
  root: string,
  force = false,
): Promise<void> {
  // Check if require administrator permission
  if (force) {
    if (!isAdmin()) {
      return Promise.reject(new Error('Force mode requires administrator permission'))
    }
  }

  for (const collection of PREFERENCE_COLLECTIONS) {
    const collectionPath = join(root, collection.source)
    if (!existsSync(collectionPath)) {
      log.warn(`Preference collection path not found: ${format.path(collectionPath)}, skip`)
      return Promise.resolve()
    }

    for (const matcher of collection.installMatchers) {
      log.progress(`Processing matcher ${format.highlight(matcher.pattern)} in ${format.highlight(matcher.mode || 'symlink')} mode ...`)

      const installablePreferencePaths = globSync(matcher.pattern, {
        cwd: collectionPath,
        absolute: true,
        dot: true,
      }).map(preference => normalize(preference))

      for (const preferencePath of installablePreferencePaths) {
        const preferenceName = basename(preferencePath)

        // Support multiple install folders
        let installFolders
        if (!Array.isArray(matcher.folder)) {
          installFolders = [matcher.folder]
        }
        else {
          installFolders = matcher.folder
        }

        for (const installFolderPath of installFolders) {
          if (!existsSync(installFolderPath)) {
            log.warn(`Install folder ${format.path(installFolderPath)} not exists, may be you haven't install the program who uses preference ${format.path(preferenceName)} yet, skip`)
            continue
          }

          const installPreferencePath = join(installFolderPath, preferenceName)
          // Copy mode
          if (matcher.mode === 'copy') {
            try {
              if (copyFile(preferencePath, installPreferencePath, force)) {
                log.success(`Copied file: ${format.path(relative(root, preferencePath))} >> ${format.path(installPreferencePath)}`)
              }
            }
            catch (error) {
              return Promise.reject(new Error(`Failed to copy file: ${error}`))
            }
          }
          // Symlink mode
          else {
            try {
              if (await createSymlink(preferencePath, installPreferencePath, force)) {
                log.success(`Created symlink: ${format.path(installPreferencePath)} -> ${format.path(relative(root, preferencePath))}`)
              }
            }
            catch (error) {
              return Promise.reject(new Error(`Failed to create symlink: ${error}`))
            }
          }
        }
      }
    }
  }

  return Promise.resolve()
}

/**
 * Uninstall preferences in all preference collections from the target path.
 * @param root - The root path of this package
 * @returns A promise that resolves when the preference collections are uninstalled, or rejects with an error
 */
export async function uninstallPreferences(
  root: string,
): Promise<void> {
  for (const collection of PREFERENCE_COLLECTIONS) {
    const collectionPath = join(root, collection.source)
    if (!existsSync(collectionPath)) {
      log.warn(`Preference collection path not found: ${format.path(collectionPath)}, skip`)
      return Promise.resolve()
    }

    for (const matcher of collection.installMatchers) {
      log.progress(`Processing matcher ${format.highlight(matcher.pattern)} in ${format.highlight(matcher.mode || 'symlink')} mode ...`)

      const uninstallablePreferencePaths = globSync(matcher.pattern, {
        cwd: collectionPath,
        absolute: true,
        dot: true,
      }).map(preference => normalize(preference))

      for (const preferencePath of uninstallablePreferencePaths) {
        const preferenceName = basename(preferencePath)

        // Support multiple install folders
        let uninstallFolders
        if (!Array.isArray(matcher.folder)) {
          uninstallFolders = [matcher.folder]
        }
        else {
          uninstallFolders = matcher.folder
        }

        for (const uninstallFolderPath of uninstallFolders) {
          if (!existsSync(uninstallFolderPath)) {
            continue
          }

          const uninstallPreferencePath = join(uninstallFolderPath, preferenceName)

          // Copy mode
          if (matcher.mode === 'copy') {
            try {
              if (removeFile(uninstallPreferencePath)) {
                log.success(`Removed file: ${format.path(uninstallPreferencePath)}`)
              }
            }
            catch (error) {
              return Promise.reject(new Error(`Failed to remove file: ${error}`))
            }
          }
          // Symlink mode
          else {
            try {
              if (removeSymlink(uninstallPreferencePath)) {
                log.success(`Removed symlink: ${format.path(uninstallPreferencePath)}`)
              }
            }
            catch (error) {
              return Promise.reject(new Error(`Failed to remove symlink: ${error}`))
            }
          }
        }
      }
    }
  }

  return Promise.resolve()
}

/**
 * Find the preference in all preference collections.
 * @param root - The root path of this package
 * @param sourceName - The name of the preference to find
 * @returns A promise that resolves with the path of the preference, or `null` if not found
 */
export async function findPreference(root: string, sourceName: string): Promise<string | null> {
  for (const collection of PREFERENCE_COLLECTIONS) {
    const collectionPath = join(root, collection.source)
    if (!existsSync(collectionPath)) {
      log.warn(`Preference collection path not found: ${format.path(collectionPath)}, skip`)
      return Promise.resolve(null)
    }

    const matchedPreferencePaths = globSync(`**/${sourceName}`, {
      cwd: collectionPath,
      absolute: true,
      dot: true,
      ignore: collection.copyPasteIgnoreMatchers.map(matcher => matcher.pattern),
    }).map(preference => normalize(preference))

    if (matchedPreferencePaths.length > 1) {
      const { preference } = await prompts({
        type: 'select',
        name: 'preference',
        message: `Select a certain preference named ${format.highlight(sourceName)}:`,
        choices: matchedPreferencePaths.map(preference => ({
          title: relative(collectionPath, preference),
          value: preference,
        })),
      })
      return Promise.resolve(preference)
    }
    else if (matchedPreferencePaths.length === 1 && matchedPreferencePaths[0]) {
      return Promise.resolve(matchedPreferencePaths[0])
    }
  }

  return Promise.resolve(null)
}

/**
 * Copy & paste a preference to a target path.
 *
 * If the target path is not specified, it will be copied to the current working directory.
 *
 * If the target path is a directory, the preference will be copied to the directory with the same name as the preference.
 *
 * If the target path is a file, it behaves like copy and rename.
 *
 * If the target directory is not exists, it will be created.
 *
 * @param root - The root path of this package
 * @param cwd - The current working directory
 * @param sourceName - The name of the preference to copy
 * @param targetPath - The target path to copy the preference to
 * @param force - Whether to force the existing preference
 * @returns A promise that resolves when the preference is copied, or rejects with an error
 */
export async function copyPastePreference(root: string, cwd: string, sourceName: string | null, targetPath: string | null, force: boolean): Promise<void> {
  if (!sourceName) {
    const { source } = await prompts({
      type: 'text',
      name: 'source',
      message: 'Please enter the source file (e.g. ".editorconfig" or "nodejs/.editorconfig"):',
    })
    sourceName = source
  }
  if (!sourceName) {
    return Promise.reject(new Error('No source file provided, operation cancelled'))
  }

  const sourcePath = await findPreference(root, sourceName)
  if (!sourcePath) {
    return Promise.reject(new Error(`Source file not found in any preference collection: ${format.highlight(sourceName)}`))
  }

  if (!targetPath) {
    targetPath = cwd
  }
  if (isDirectory(targetPath)) {
    targetPath = join(targetPath, basename(sourcePath))
  }
  ensureDir(dirname(targetPath))

  if (copyFile(sourcePath, targetPath, force)) {
    log.success(`Copied file: ${format.path(relative(root, sourcePath))} >> ${format.path(targetPath)}`)
  }

  return Promise.resolve()
}

// ------------------------------------------------------------
// Templates
// ------------------------------------------------------------

/**
 * Find the template in all template collections.
 * @param root - The root path of this package
 * @param sourceName - The name of the template to find
 * @returns A promise that resolves with the path of the template, or `null` if not found
 */
export async function findTemplate(root: string, sourceName: string): Promise<string | null> {
  for (const collection of TEMPLATE_COLLECTIONS) {
    const collectionPath = join(root, collection.source)
    if (!existsSync(collectionPath)) {
      log.warn(`Template collection path not found: ${format.path(collectionPath)}, skip`)
      return Promise.resolve(null)
    }

    const matchedTemplatePaths = globSync(`**/${sourceName}`, {
      cwd: collectionPath,
      absolute: true,
      dot: true,
      ignore: collection.copyPasteIgnoreMatchers.map(matcher => matcher.pattern),
    }).map(template => normalize(template))

    if (matchedTemplatePaths.length > 1) {
      const { template } = await prompts({
        type: 'select',
        name: 'template',
        message: `Select a certain template named ${format.highlight(sourceName)}:`,
        choices: matchedTemplatePaths.map(template => ({
          title: relative(collectionPath, template),
          value: template,
        })),
      })
      return Promise.resolve(template)
    }
    else if (matchedTemplatePaths.length === 1 && matchedTemplatePaths[0]) {
      return Promise.resolve(matchedTemplatePaths[0])
    }
  }

  return Promise.resolve(null)
}

/**
 * Copy & paste a template to a target path.
 *
 * If the target path is not specified, it will be copied to the current working directory.
 *
 * If the target path is a directory, the template will be copied to the directory with the same name as the template.
 *
 * If the target path is a file, it behaves like copy and rename.
 *
 * If the target directory is not exists, it will be created.
 *
 * @param root - The root path of this package
 * @param cwd - The current working directory
 * @param sourceName - The name of the template to copy
 * @param targetPath - The target path to copy the template to
 * @param force - Whether to force the existing template
 * @returns A promise that resolves when the template is copied, or rejects with an error
 */
export async function copyPasteTemplate(root: string, cwd: string, sourceName: string | null, targetPath: string | null, force: boolean): Promise<void> {
  if (!sourceName) {
    const { source } = await prompts({
      type: 'text',
      name: 'source',
      message: 'Please enter the source file (e.g. "LICENSE" or "README.md"):',
    })
    sourceName = source
  }
  if (!sourceName) {
    return Promise.reject(new Error('No source file provided, operation cancelled'))
  }

  const sourcePath = await findTemplate(root, sourceName)
  if (!sourcePath) {
    return Promise.reject(new Error(`Source file not found in any template collection: ${format.highlight(sourceName)}`))
  }

  if (!targetPath) {
    targetPath = cwd
  }
  if (isDirectory(targetPath)) {
    targetPath = join(targetPath, basename(sourcePath))
  }
  ensureDir(dirname(targetPath))

  if (copyFile(sourcePath, targetPath, force)) {
    log.success(`Copied file: ${format.path(relative(root, sourcePath))} >> ${format.path(targetPath)}`)
  }

  return Promise.resolve()
}
