/**
 * Generate `catalogs.json` from impurities
 *
 * @example
 *
 * ```bash
 * tsx scripts/catalogs.ts
 * ```
 */

// ------------------------------------------------------------
// Imports
// ------------------------------------------------------------

import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { globSync } from 'tinyglobby'
import { IMPURITIES_PATH } from '../src/config'
import { log } from '../src/logger'

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

interface CatalogItem {
  [key: string]: CatalogItem | ''
}

// ------------------------------------------------------------
// Functions
// ------------------------------------------------------------

/**
 * Transform paths to nested catalogs
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
function transformPaths2Catalogs(paths: string[]): CatalogItem {
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

  return catalogs
}

/**
 * Write catalogs to `CATALOGS.json`
 */
function writeCatalogsIfChanged(catalogs: CatalogItem) {
  try {
    const currentCatalogs = readFileSync('CATALOGS.json', 'utf-8')
    const currentCatalogsHash = createHash('md5').update(currentCatalogs).digest('hex')

    const newCatalogs = `${JSON.stringify(catalogs, null, 2)}\n`
    const newCatalogsHash = createHash('md5').update(newCatalogs).digest('hex')

    if (currentCatalogsHash === newCatalogsHash) {
      log.success('Catalogs are up to date')
      return
    }

    writeFileSync('CATALOGS.json', newCatalogs)
    // run git add CATALOGS.json
    if (execSync('git status --porcelain CATALOGS.json').toString().trim().length > 0) {
      execSync('git add CATALOGS.json', { stdio: 'inherit' })
    }
    log.success('Catalogs generated / updated successfully')
  }
  catch (error) {
    if (error instanceof Error) {
      log.error(`Failed to generate catalogs: ${error.message}`)
    }
    process.exit(1)
  }
}

// ------------------------------------------------------------
// Main
// ------------------------------------------------------------

/**
 * This will ignore the empty directories
 */
const paths = globSync(`${IMPURITIES_PATH}/**/*`, {
  cwd: process.cwd(),
  dot: true,
  absolute: false,
  ignore: [`${IMPURITIES_PATH}/work/**/*`, '**/node_modules/**/*'],
})

const catalogs = transformPaths2Catalogs(paths)

writeCatalogsIfChanged(catalogs)
