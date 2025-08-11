import { x } from 'tinyexec'
import { assert, it } from 'vitest'

it('powershell', async () => {
  const proc = x('powershell', ['./test.ps1', '--silent'], {
    nodeOptions: {
      cwd: import.meta.dirname,
    },
  })
  const result: string[] = []
  for await (const line of proc) {
    result.push(line)
  }
  if (result.some(i => i.includes('PSSecurityException'))) {
    throw new Error('PSSecurityException detected. Please run "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" in PowerShell.')
  }
  const numericResult = result.map(i => +i)

  // Result[0] = total tests
  // Result[1] = passed tests
  // Result[2] = failed tests
  assert.equal(numericResult[0], numericResult[1])
  assert.equal(numericResult[2], 0)
})
