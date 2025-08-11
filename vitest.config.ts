import process from 'node:process'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: process.platform === 'win32' ? 60000 : 30000,
  },
})
