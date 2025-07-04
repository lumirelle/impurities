/**
 * Generate `catalogs.json` from impurities
 *
 * @example
 *
 * ```bash
 * tsx scripts/catalogs.ts
 * ```
 */

import { writeFileSync } from 'node:fs'
import process from 'node:process'
import { globSync } from 'tinyglobby'
import { IMPURITIES_PATH } from '../src/config'
import { log } from '../src/logger'

interface CatalogItem {
  [key: string]: CatalogItem | ''
}

/**
 * This will ignore the empty directories
 */
const paths = globSync(`${IMPURITIES_PATH}/**/*`, {
  cwd: process.cwd(),
  dot: true,
  absolute: false,
  ignore: [`${IMPURITIES_PATH}/work/**/*`],
})

/**
 * Transform path list to nested catalog format
 *
 * @example
 *
 * from:
 *
 * [
 *  'docs/life/life.md',
 *  'docs/docs.md',
 *  'docs/test/',
 *  'docs/technique/computer.md',
 *  'preferences/editor.md',
 *  'preferences/formatter.md',
 *  'preferences/linter.md',
 * ]
 *
 * to:
 *
 * {
 *   'docs': {
 *     'life': {
 *       'life.md': null,
 *     },
 *     'docs.md': null,
 *     'technique': {
 *       'computer.md': null,
 *     },
 *   },
 *   'preferences': {
 *     'editor.md': null,
 *     'formatter.md': null,
 *     'linter.md': null,
 *   }
 * }
 */
function transformPathList2Catalog(paths: string[]) {
  const catalogs: CatalogItem = paths.reduce((acc, path) => {
    const pathParts = path.split('/')

    // Process path parts recursively
    let curCatalogItem: CatalogItem | '' = acc
    pathParts.forEach((part, index) => {
      // If the current catalog is a string, it means it's the last part of the path, just return
      if (typeof curCatalogItem === 'string') {
        return
      }

      // If the current path is the last part, set the current catalog item to an empty string to mark it as a leaf node
      if (index === pathParts.length - 1) {
        curCatalogItem[part] = ''
      }
      else {
        // If the current catalog has not key `part`, create an empty object
        curCatalogItem[part] = curCatalogItem[part] ?? {}
        curCatalogItem = curCatalogItem[part]
      }
    })
    return acc
  }, {})

  try {
    writeFileSync('CATALOGS.json', `${JSON.stringify(catalogs, null, 2)}\n`)
    log.success('Catalogs generated successfully')
  }
  catch (error) {
    if (error instanceof Error) {
      log.error(`Failed to generate catalogs: ${error.message}`)
    }
    process.exit(1)
  }
}

transformPathList2Catalog(paths)
