export interface Parameter {
  key: string
  position: number
  value: string | boolean
}

export class UnsupportedCommandError extends Error {
  constructor(command: string) {
    super(`Unsupported command: ${command}`)
  }
}

export class MissingParameterValueError extends Error {
  constructor(parameter: string) {
    super(`Missing parameter value: ${parameter}`)
  }
}

export class MissingParameterError extends Error {
  constructor(parameter: string) {
    super(`Missing parameter: ${parameter}`)
  }
}

export class InvalidParameterValueTypeError extends Error {
  constructor(parameter: string) {
    super(`Invalid parameter value type: ${parameter}`)
  }
}

/**
 * Parse the arguments to parameters
 * @param args - The arguments received from `process.argv`
 * @returns The parsed parameters
 * @throws If a string value parameter is provided without a value
 */
export function parseArgs2Parameters(args: string[]): Parameter[] {
  const parameters: Parameter[] = []

  let parameterPosition = 0
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (!arg) {
      continue
    }

    // specify parameter, arg is a key
    if (arg.startsWith('-')) {
      // If next argument is not exist or is a parameter, set value to true
      const nextArg = args[i + 1]
      if (!nextArg || nextArg.startsWith('-')) {
        parameters.push({ key: arg, value: true, position: -1 })
      }
      // Otherwise, set value to the next argument
      else {
        parameters.push({ key: arg, value: nextArg, position: -1 })
      }
      i++
    }
    // position parameter, arg is a value
    else {
      parameters.push({ key: '', value: arg, position: parameterPosition })
      parameterPosition++
    }
  }
  return parameters
}

export interface ExtractOptions {
  keys: string[]
  position?: number
}

/**
 * Extract specified parameter value from parameter list
 * @param parameters - The parameter list to extract from
 * @param extractOptions - The options to extract
 * @returns The extracted value
 * @throws If the required parameter is not provided
 */
function extract(parameters: Parameter[], extractOptions: ExtractOptions): string | boolean | null {
  const { keys, position } = extractOptions

  let result: string | boolean | null = null

  // Process all parameters
  for (let i = 0; i < parameters.length; i++) {
    const parameter = parameters[i]
    if (!parameter) {
      continue
    }

    // Key parameter
    if (parameter.key !== '' && keys.includes(parameter.key)) {
      result = parameter.value
      parameters.splice(i, 1)
    }
    // Position parameter
    else if (parameter.position >= 0 && parameter.position === position) {
      result = parameter.value
      parameters.splice(i, 1)
    }
  }

  return result
}

export function extractString(parameters: Parameter[], extractOptions: ExtractOptions): string | null {
  const { keys } = extractOptions
  const result = extract(parameters, extractOptions)
  // Throw if the parameter is not null and not a string
  if (result !== null && typeof result !== 'string')
    throw new InvalidParameterValueTypeError(`${keys.join(', ')} expected string, but got ${typeof result}: ${result}`)
  return String(result)
}

export function extractBoolean(parameters: Parameter[], extractOptions: ExtractOptions): boolean {
  const { keys } = extractOptions
  const result = extract(parameters, extractOptions)
  // Throw if the parameter is not null and not a boolean
  if (result !== null && typeof result !== 'boolean')
    throw new InvalidParameterValueTypeError(`${keys.join(', ')} expected boolean, but got ${typeof result}: ${result}`)
  return Boolean(result)
}
