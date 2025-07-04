/* eslint-disable no-console */
import type { Parameter } from './parse'
import process from 'node:process'
import c from 'ansis'
import { version } from '../package.json'
import { format, log } from './logger'
import { extractBoolean, parseArgs2Parameters } from './parse'

export interface RunnerContext {
  cwd: string
}

export type Runner = (context: RunnerContext, parameters: Parameter[]) => Promise<void>

/**
 * Run the CLI, handles exceptions, wrap the real `run` function
 * @param fn - The function to run
 */
export async function runCli(fn: Runner): Promise<void> {
  const args = process.argv.slice(2)
  const parameters = parseArgs2Parameters(args)
  try {
    await run(fn, parameters)
  }
  catch (error) {
    if (error instanceof Error)
      log.error(error.message)
    process.exit(1)
  }
}

/**
 * The real `run` function, handles special arguments like `-h` and `-v`
 * @param fn - The function to run
 * @param parameters - The parameters received from cli
 */
export async function run(fn: Runner, parameters: Parameter[]): Promise<void> {
  const debug = extractBoolean(parameters, { keys: ['-?'] })

  const context: RunnerContext = {
    cwd: process.cwd(),
  }

  if (debug) {
    log.debug(`Running with parameters: ${JSON.stringify(parameters, null, 2)}`)
    log.debug(`Running with context: ${JSON.stringify(context, null, 2)}`)
  }

  if (parameters[0] && ['-h', '--help'].includes(parameters[0].key)) {
    const dash = c.dim('-')
    console.log(format.title('impurities') + c.dim` It includes all kinds of impurities, preferences, docs, resources, templates, etc. v${version}\n`)
    console.log(`iip    ${dash}  install preferences`)
    console.log(`iup    ${dash}  uninstall preferences installed by iip`)
    console.log(`icp    ${dash}  copy & paste preferences`)
    console.log(`ict    ${dash}  copy & paste template`)
    console.log(`iip -h ${dash}  show help`)
    console.log(format.additional('\ncheck https://github.com/lumirelle/impurities for more documentation.'))
    return
  }

  await fn(context, parameters)
}
