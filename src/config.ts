import type { Output } from 'tinyexec'
import type { Gallery } from './types'
import { appendFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { env, platform } from 'node:process'
import consola from 'consola'
import { x } from 'tinyexec'
import { isAdmin } from './permission'

// -------------------------------------------------------------------------------------------------
// Paths
// -------------------------------------------------------------------------------------------------

export const ASSETS_PATH = './assets'

export const PREFERENCES_PATH = `${ASSETS_PATH}/preferences`

export const GLOBAL_PREFERENCES_IGNORE = [
  'README.md',
]

export const TEMPLATE_PATH = `${ASSETS_PATH}/templates`

export const GLOBAL_TEMPLATES_IGNORE = [
]

// -------------------------------------------------------------------------------------------------
// Galleries
// TODO: POSIX supports
// -------------------------------------------------------------------------------------------------

export const GALLERIES: Gallery[] = [

  // Setup OS

  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-os', 'vpn', 'clash-for-windows'),
      pattern: 'cfw-settings.yaml',
    },
    installOptions: {
      folders: [join(homedir(), '.config', 'clash')],
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-os', 'vcs', 'git'),
      pattern: '.gitconfig',
    },
    installOptions: {
      folders: [homedir()],
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-os', 'shell-terminal', 'bash'),
      pattern: '.bash_profile',
    },
    installOptions: {
      folders: [homedir()],
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-os', 'shell-terminal', 'cmd'),
      pattern: 'autorun.cmd',
    },
    installOptions: {
      folders: [join(homedir() || '', 'Documents', 'CMD')],
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-os', 'shell-terminal', 'nushell'),
      pattern: '*.nu',
    },
    installOptions: {
      folders: [join(env.APPDATA || '', 'nushell')],
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-os', 'shell-terminal', 'powershell'),
      pattern: 'Microsoft.PowerShell_profile.ps1',
    },
    installOptions: {
      folders: [join(homedir() || '', 'Documents', 'PowerShell')],
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-os', 'shell-terminal', 'windows-terminal'),
      pattern: 'settings.json',
    },
    installOptions: {
      folders: [join(env.LOCALAPPDATA || '', 'Packages', 'Microsoft.WindowsTerminal_8wekyb3d8bbwe', 'LocalState')],
    },
  },

  // Setup Env

  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-env', 'package-manager', 'maven'),
      pattern: 'settings.xml',
    },
    installOptions: {
      folders: [join(homedir(), '.m2')],
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-env', 'package-manager', 'miniconda'),
      pattern: '*.lnk',
    },
    installOptions: {
      folders: [join(env.ProgramData || '', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Anaconda (miniconda3)')],
      mode: 'copy',
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-env', 'project-creator', 'nodejs'),
      pattern: 'create.config.yml',
    },
    installOptions: {
      folders: [join(homedir(), '.config')],
    },
  },

  // Setup Tools

  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-tools', 'editor'),
      pattern: '.editorconfig',
    },
    installOptions: {
      folders: [homedir()],
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-tools', 'editor', 'neovim'),
      pattern: '**/*',
    },
    installOptions: {
      folders: [join(env.LOCALAPPDATA || '', 'nvim')],
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-tools', 'editor', 'vscode'),
      pattern: '*.json',
    },
    installOptions: {
      folders: [
        join(env.APPDATA || '', 'Code', 'User'),
        join(env.APPDATA || '', 'Cursor', 'User'),
      ],
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-tools', 'editor', 'vscode', 'snippets'),
      pattern: '**/*',
    },
    installOptions: {
      folders: [
        join(env.APPDATA || '', 'Code', 'User', 'snippets'),
        join(env.APPDATA || '', 'Cursor', 'User', 'snippets'),
      ],
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-tools', 'git-tools', 'commitizen'),
      pattern: '.czrc',
    },
    installOptions: {
      folders: [homedir()],
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-tools', 'git-tools', 'simple-git-hooks'),
      pattern: '.simple-git-hooks.rc',
    },
    installOptions: {
      // TODO: Improving the code robustness
      folders: [homedir()],
      afterInstall: async ({ dryRun }) => {
        if (!await isAdmin()) {
          throw new Error('Required admin permission')
        }

        const rcPath = join(homedir(), '.simple-git-hooks.rc')

        if (dryRun) {
          return
        }

        let result: Output | null = null
        // Windows
        if (platform === 'win32') {
          result = await x('setx', ['SIMPLE_GIT_HOOKS_RC', rcPath, '/M'])
          consola.debug('[Windows] Ensure SIMPLE_GIT_HOOKS_RC environment variable is setting.')
        }
        // POSIX
        else {
          const isExist = await x('cat', ['/etc/environment']).pipe('grep', ['SIMPLE_GIT_HOOKS_RC'])
          // Is exist
          if (isExist.stdout.length > 0) {
            result = await x('sed', ['-i', `s/^SIMPLE_GIT_HOOKS_RC=.*/SIMPLE_GIT_HOOKS_RC=${rcPath}/`, '/etc/environment'])
            consola.debug('[POSIX] Replace SIMPLE_GIT_HOOKS_RC environment variable.')
          }
          // Is not exist
          else {
            try {
              appendFileSync('/etc/environment', `SIMPLE_GIT_HOOKS_RC=${rcPath}\n`, 'utf-8')
              result = { exitCode: 0, stdout: 'Success', stderr: '' }
              consola.debug('[POSIX] Add SIMPLE_GIT_HOOKS_RC environment variable.')
            }
            catch (error) {
              consola.error(error)
              result = { exitCode: 1, stdout: '', stderr: error instanceof Error ? error.message : 'Unknown error' }
            }
          }
        }
        if (!result || result.exitCode !== 0) {
          consola.error('Failed to set SIMPLE_GIT_HOOKS_RC environment variable')
        }
      },
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-tools', 'linter', 'cspell'),
      pattern: '*.txt',
    },
    installOptions: {
      folders: [homedir()],
    },
  },

  // Setup Project

  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-project', 'common'),
      pattern: '**/*',
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-project', 'js'),
      pattern: '**/*',
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-project', 'vue'),
      pattern: '**/*',
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-project', 'vue2'),
      pattern: '**/*',
    },
  },
  {
    type: 'preference',
    matchOptions: {
      cwd: join(PREFERENCES_PATH, 'setup-project', 'vue3'),
      pattern: '**/*',
    },
  },

  // Templates

  {
    type: 'template-separate',
    matchOptions: {
      cwd: join(TEMPLATE_PATH, 'license'),
      pattern: '**/*',
    },
  },
  {
    type: 'template-separate',
    matchOptions: {
      cwd: join(TEMPLATE_PATH, 'log'),
      pattern: '**/*',
    },
  },
  {
    type: 'template-separate',
    matchOptions: {
      cwd: join(TEMPLATE_PATH, 'readme'),
      pattern: '**/*',
    },
  },
  {
    type: 'template-compose',
    matchOptions: {
      cwd: join(TEMPLATE_PATH, 'scss'),
      path: 'scss',
      name: 'scss',
    },
  },
  {
    type: 'template-compose',
    matchOptions: {
      cwd: join(TEMPLATE_PATH, 'vue', 'common', 'components', 'gradient-border'),
      path: 'gradient-border',
      name: 'vue-gradient-border',
    },
  },
  {
    type: 'template-compose',
    matchOptions: {
      cwd: join(TEMPLATE_PATH, 'vue', 'common', 'components', 'image-viewer'),
      path: 'image-viewer',
      name: 'vue-image-viewer',
    },
  },
  {
    type: 'template-separate',
    matchOptions: {
      cwd: join(TEMPLATE_PATH, 'vue', 'common', 'composable'),
      pattern: '**/*',
    },
  },
  {
    type: 'template-separate',
    matchOptions: {
      cwd: join(TEMPLATE_PATH, 'vue', 'v2', 'composables'),
      pattern: '**/*',
    },
  },
]
