import process from 'node:process'
import { x } from 'tinyexec'

/**
 * Check if the current process is running with administrator permission.
 * @returns `true` if the current process is running with administrator permission, `false` otherwise
 */
export async function isAdmin(): Promise<boolean> {
  try {
    if (process.platform === 'win32') {
      // Windows: Try to execute the command that requires administrator permission
      // It's welcome to have a sync version of `x`, hope it will be implemented in the future: https://github.com/tinylibs/tinyexec/issues/33
      return (await x('net', ['session'])).exitCode === 0
    }
    else {
      // POSIX: Check if the user ID is 0 (root)
      return process.getuid?.() === 0
    }
  }
  catch {
    return false
  }
}
