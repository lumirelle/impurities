/* eslint-disable no-console */
import { bold, cyan, dim, green, magenta, red, reset, yellow } from 'ansis'

const LOG_CHARACTERS = {
  success: '\uEAB2',
  warn: '\uEA6C',
  progress: '\uDB82\uDD96', // Nerd Font Progress
  error: '\uEA87',
  debug: '\uEAD8',
}

function getCharacter(key: keyof typeof LOG_CHARACTERS): string {
  return LOG_CHARACTERS[key]
}

export interface Log {
  info: (message: string) => void
  success: (message: string) => void
  warn: (message: string) => void
  progress: (message: string) => void
  error: (message: string) => void
  debug: (message: string) => void
}

export const log: Log = {
  info: (message: string): void => {
    console.log(`${message}`)
  },
  success: (message: string): void => {
    console.log(green(`${getCharacter('success')} ${message}`))
  },
  warn: (message: string): void => {
    console.warn(yellow(`${getCharacter('warn')} ${message}`))
  },
  progress: (message: string): void => {
    console.log(`${getCharacter('progress')} ${message}`)
  },
  error: (message: string): void => {
    console.error(red(`${getCharacter('error')} ${message}`))
  },
  debug: (message: string): void => {
    console.log(magenta(`${getCharacter('debug')} ${dim(message)}`))
  },
}

export interface Format {
  path: (path: string) => string
  title: (title: string) => string
  highlight: (text: string) => string
  additional: (text: string) => string
}

export const format: Format = {
  path: (path: string): string => {
    // Replace backslashes with forward slashes
    return bold(cyan(path.replace(/\\/g, '/')))
  },
  title: (title: string): string => {
    return bold(green(title))
  },
  highlight: (text: string): string => {
    return bold(magenta(text))
  },
  additional: (text: string): string => {
    return yellow(text)
  },
}

export const resetStyle = reset
