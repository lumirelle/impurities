import { homedir } from 'node:os'
import { join } from 'node:path'
import { env } from 'node:process'

// -------------------------------------------------------------------------------------------------
// Basic
// -------------------------------------------------------------------------------------------------

export const IMPURITIES_PATH = './impurities'

// -------------------------------------------------------------------------------------------------
// Preferences
// -------------------------------------------------------------------------------------------------

/**
 * The preference collection
 */
interface PreferenceCollection {
  /**
   * The source path of the preference collection, relative to project root
   */
  source: string

  /**
   * The matchers for installing & uninstalling preferences in the collection.
   *
   * NOTE: Preferences not matched by any matcher will not be installed.
   */
  installMatchers: PreferenceInstallMatcher[]

  /**
   * The matchers for ignoring preferences when copying
   */
  copyPasteIgnoreMatchers: PreferenceCopyPasteIgnoreMatcher[]
}

/**
 * The matcher for installing & uninstalling preferences in the collection
 */
interface PreferenceInstallMatcher {
  /**
   * The glob pattern to match the preferences in the collection, relative to the `source` path
   */
  pattern: string

  /**
   * The folder(s) the preferences are installed to
   */
  folder: string | string[]

  /**
   * The mode of installing preferences, if not specified, it will behave as `symlink`
   */
  mode?: 'symlink' | 'copy'
}

/**
 * The matcher for ignoring preferences when copying & pasting
 */
interface PreferenceCopyPasteIgnoreMatcher {
  /**
   * The glob pattern to match the preferences in the collection, relative to the `source` path
   */
  pattern: string
}

export const PREFERENCE_COLLECTIONS: PreferenceCollection[] = [
  {
    source: `${IMPURITIES_PATH}/personal/preferences`,
    installMatchers: [
      {
        pattern: 'editor/neovim/**/*',
        folder: join(env.LOCALAPPDATA || '', 'nvim'),
      },
      {
        pattern: 'editor/vscode/{settings,keybindings,mcp}.json',
        folder: [
          join(env.APPDATA || '', 'Code', 'User'),
          join(env.APPDATA || '', 'Cursor', 'User'),
        ],
      },
      {
        pattern: 'editor/vscode/snippets/**/*.json',
        folder: [
          join(env.APPDATA || '', 'Code', 'User', 'snippets'),
          join(env.APPDATA || '', 'Cursor', 'User', 'snippets'),
        ],
      },
      {
        pattern: 'editor/.editorconfig',
        folder: homedir(),
      },
      {
        pattern: 'formatter/prettier/.prettierrc.yaml',
        folder: homedir(),
      },
      {
        pattern: 'linter/cspell/.cspell.common.txt',
        folder: homedir(),
      },
      {
        pattern: 'package-manager/maven/settings.xml',
        folder: join(homedir(), '.m2'),
      },
      {
        pattern: 'package-manager/miniconda/*.lnk',
        folder: join(env.ProgramData || '', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Anaconda (miniconda3)'),
        mode: 'copy',
      },
      {
        pattern: 'terminal/bash/.bash_profile',
        folder: homedir(),
      },
      {
        pattern: 'terminal/cmd/autorun.cmd',
        folder: join(homedir() || '', 'Documents', 'CMD'),
      },
      {
        pattern: 'terminal/powershell/Microsoft.PowerShell_profile.ps1',
        folder: join(homedir() || '', 'Documents', 'PowerShell'),
      },
      {
        pattern: 'terminal/windows-terminal/settings.json',
        folder: join(env.LOCALAPPDATA || '', 'Packages', 'Microsoft.WindowsTerminal_8wekyb3d8bbwe', 'LocalState'),
      },
      {
        pattern: 'vcs/git/.gitconfig',
        folder: homedir(),
      },
      {
        pattern: 'vpn/clash-for-windows/cfw-settings.yaml',
        folder: join(homedir(), '.config', 'clash'),
      },
    ],
    copyPasteIgnoreMatchers: [
      {
        pattern: '**/outdated',
      },
      {
        pattern: '**/placeholder',
      },
      {
        pattern: '**/*.md',
      },
    ],
  },
  {
    source: `${IMPURITIES_PATH}/work/preferences`,
    installMatchers: [
      {
        pattern: 'linter/cspell/.cspell.wrk.txt',
        folder: homedir(),
      },
    ],
    copyPasteIgnoreMatchers: [
      {
        pattern: '**/outdated',
      },
      {
        pattern: '**/placeholder',
      },
      {
        pattern: '**/*.md',
      },
    ],
  },
]

// -------------------------------------------------------------------------------------------------
// Templates
// -------------------------------------------------------------------------------------------------

interface TemplateCollection {
  /**
   * The source path of the template collection, relative to project root
   */
  source: string

  /**
   * The matchers for ignoring templates when copying
   */
  copyPasteIgnoreMatchers: TemplateCopyPasteIgnoreMatcher[]
}

/**
 * The matcher for ignoring templates when copying
 */
interface TemplateCopyPasteIgnoreMatcher {
  /**
   * The glob pattern to match the templates in the collection, relative to the `source` path
   */
  pattern: string
}

export const TEMPLATE_COLLECTIONS: TemplateCollection[] = [
  {
    source: `${IMPURITIES_PATH}/personal/templates`,
    copyPasteIgnoreMatchers: [
      {
        pattern: '**/example/**/*',
      },
    ],
  },
]
