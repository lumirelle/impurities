import type { PasteOptions } from './types'
import { basename, join, relative } from 'node:path'
import { cwd } from 'node:process'
import prompts from '@posva/prompts'
import consola from 'consola'
import { globSync } from 'tinyglobby'
import { ASSETS_PATH, GALLERIES, GLOBAL_PREFERENCES_IGNORE, GLOBAL_TEMPLATES_IGNORE } from '.'
import { copyFile, ensureDir, isDirectory } from './fs'
import { highlight } from './highlight'

/**
 * Copy & paste a preference to a target path.
 * If the target path is not specified, it will be copied to the current working directory.
 * If the target path is a directory, the preference will be copied to the directory with the same name as the preference.
 * If the target path is a file, it behaves like copy and rename.
 * If the target directory is not exists, it will be created.
 * @param root - The root path of this package
 * @param options - The paste options
 */
export async function paste(
  root: string,
  options: PasteOptions,
) {
  const { force } = options
  let { source: sourceName, target } = options

  if (!sourceName) {
    const { result } = await prompts({
      type: 'text',
      name: 'result',
      message: 'Please enter the source file (e.g. ".editorconfig" or "nodejs/.editorconfig"):',
      validate: value => value ? true : 'Source file is required',
    })
    sourceName = result as string
  }

  const source = await find(root, sourceName)
  if (!source) {
    consola.warn(`Source file not found in any preference collection: ${source}`)
    return
  }
  // true means user cancels the selection
  if (source === true) {
    return
  }

  const absoluteSource = join(root, source)

  if (!target) {
    target = cwd()
  }
  // If user does not specify the target file name, use the source file name as default
  if (isDirectory(target)) {
    consola.debug('target is a directory', target, isDirectory(target))
    target = join(target, basename(absoluteSource))
  }

  ensureDir(target)

  try {
    if (copyFile(absoluteSource, target, force)) {
      consola.success(`${highlight.green('COPY:')} ${relative(join(root, ASSETS_PATH), absoluteSource)} ${highlight.important('>>')} ${target}`)
    }
  }
  catch (error) {
    consola.error(error)
  }
}

/**
 * Find the preference in all preference collections.
 * @param root - The root path of this package
 * @param sourceName - The name of the preference to find
 * @returns A promise that resolves with the path of the preference, or `null` if not found
 */
async function find(
  root: string,
  sourceName: string,
): Promise<string | true | null> {
  const paths = []

  consola.debug('sourceName', sourceName)

  for (const gallery of GALLERIES) {
    // Limit the number of paths to avoid infinite loop
    if (paths.length > 20) {
      break
    }

    // preference
    if (gallery.type === 'preference' && gallery.matchOptions.pattern) {
      paths.push(...globSync(gallery.matchOptions.pattern, {
        cwd: gallery.matchOptions.cwd,
        dot: true,
        ignore: [
          ...GLOBAL_PREFERENCES_IGNORE,
          ...(gallery.matchOptions.ignore || []),
        ],
      })
        .map(preference => join(gallery.matchOptions.cwd, preference))
        .filter(preference => preference.includes(sourceName)),
      )
    }
    // template separate
    else if (gallery.type === 'template-separate' && gallery.matchOptions.pattern) {
      paths.push(...globSync(gallery.matchOptions.pattern, {
        cwd: gallery.matchOptions.cwd,
        dot: true,
        ignore: [
          ...GLOBAL_TEMPLATES_IGNORE,
          ...(gallery.matchOptions.ignore || []),
        ],
      })
        .map(preference => join(gallery.matchOptions.cwd, preference))
        .filter(preference => preference.includes(sourceName)),
      )
    }
    // template compose
    else if (gallery.type === 'template-compose' && gallery.matchOptions.path && gallery.matchOptions.name.includes(sourceName)) {
      paths.push(join(gallery.matchOptions.cwd, gallery.matchOptions.path))
    }
  }

  consola.debug('paths', paths)

  if (paths.length > 1) {
    const { preference } = await prompts({
      type: 'select',
      name: 'preference',
      message: `Select a certain preference named ${sourceName}:`,
      choices: paths.map(preference => ({
        title: relative(join(root, ASSETS_PATH), preference),
        value: preference,
      })),
    })
    if (!preference) {
      // true means user cancels the selection
      return Promise.resolve(true)
    }
    return Promise.resolve(preference)
  }
  else if (paths.length === 1 && paths[0]) {
    return Promise.resolve(paths[0])
  }

  return Promise.resolve(null)
}
