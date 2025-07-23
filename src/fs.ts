import { constants, copyFileSync, promises as fsPromises, lstatSync, mkdirSync, unlinkSync } from 'node:fs'
import { dirname } from 'node:path'
import consola from 'consola'

/**
 * Check if a file or directory exists. Does not dereference symlinks.
 * @param path - The path to check
 * @returns `true` if the file or directory exists, `false` otherwise
 */
export function existsSync(path: string): boolean {
  try {
    lstatSync(path)
    return true
  }
  catch (error) {
    if (error instanceof Error && error.message.includes('ENOENT')) {
      return false
    }
    else {
      throw error
    }
  }
}

/**
 * Check if a path is a directory. If path exists, we check the stats, if not, we check if the path ends with `/` or `\`.
 * @param path - The path to check
 * @returns `true` if the path is a directory, `false` otherwise
 */
export function isDirectory(path: string): boolean {
  return (existsSync(path) && lstatSync(path).isDirectory()) || path.match(/\/$|\\$/) !== null
}

/**
 * Ensure a directory exists.
 * If the path is not a directory, we will try to create it.
 * If the path is a file, we will create the parent directory.
 * @param dirPath - The path to ensure
 */
export function ensureDir(dirPath: string): void {
  if (!isDirectory(dirPath)) {
    dirPath = dirname(dirPath)
  }
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true })
    consola.success(`Created directory: ${dirPath}`)
  }
}

export async function createSymlink(sourcePath: string, targetPath: string, force = false): Promise<boolean> {
  if (existsSync(targetPath)) {
    if (force) {
      unlinkSync(targetPath)
    }
    else {
      consola.warn(`File already exists: ${targetPath}, skip`)
      return false
    }
  }

  await fsPromises.symlink(sourcePath, targetPath, 'file')
  return true
}

export function removeSymlink(targetPath: string): boolean {
  if (!existsSync(targetPath)) {
    consola.warn(`Target file not found: ${targetPath}, skip`)
    return false
  }

  const stats = lstatSync(targetPath)
  if (!stats.isSymbolicLink()) {
    consola.warn(`Target file is not a symlink: ${targetPath}, skip`)
    return false
  }

  unlinkSync(targetPath)
  return true
}

export function copyFile(sourcePath: string, targetPath: string, force: boolean = false): boolean {
  if (existsSync(targetPath) && !force) {
    consola.warn(`File already exists: ${targetPath}, skip`)
    return false
  }

  copyFileSync(sourcePath, targetPath, force ? constants.COPYFILE_FICLONE : 0)
  return true
}

export function removeFile(targetPath: string): boolean {
  if (!existsSync(targetPath)) {
    consola.warn(`Target file not found: ${targetPath}, skip`)
    return false
  }

  unlinkSync(targetPath)
  return true
}
