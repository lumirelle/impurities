import consola from 'consola'
import { highlight } from './highlight'

export class HooksError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'HooksError'
  }
}

export function handleErrors(error: any, action?: string) {
  const actionMessage = action ?? 'Unknown action'
  const sep = '\n\n'
  if (error instanceof HooksError) {
    consola.error(`${highlight.red('Hooks error')}${sep}${highlight.red(error.message)}${sep}${actionMessage}`)
  }
  else if (error instanceof Error) {
    if (error.message.includes('EPERM')) {
      consola.error(
        `${highlight.red('Requires administrator permission! Please rerun the command with \'sudo\'')}${sep}${actionMessage}`,
      )
    }
    else {
      consola.error(`${highlight.red('Unknown Error:')}${sep}${highlight.red(error.message)}${sep}${actionMessage}`)
    }
  }
  else {
    consola.error(`${highlight.red('Unknown error')}${sep}${highlight.red(error)}${sep}${actionMessage}`)
  }
}
