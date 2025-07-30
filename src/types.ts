// -----------------------------------------------------------------------------
// CLI Options
// -----------------------------------------------------------------------------

export interface InstallOptions {
  /**
   * Whether to force the operation
   */
  force?: boolean

  /**
   * Whether to show verbose output
   */
  verbose?: boolean

  /**
   * Whether to show dry run this operation
   */
  dryRun?: boolean
}

export interface UninstallOptions {
  /**
   * Whether to show verbose output
   */
  verbose?: boolean

  /**
   * Whether to show dry run this operation
   */
  dryRun?: boolean
}

export interface PasteOptions {
  /**
   * The source file name or path
   */
  source?: string

  /**
   * The target file name or path
   */
  target?: string

  /**
   * Whether to force the operation
   */
  force?: boolean

  /**
   * Whether to show verbose output
   */
  verbose?: boolean

  /**
   * Whether to show dry run this operation
   */
  dryRun?: boolean
}

// -----------------------------------------------------------------------------
// Configurations
// -----------------------------------------------------------------------------

export type Gallery = PreferenceGallery | TemplateGallery

interface BaseMatchOptions {
  /**
   * CWD, relative to `root`
   *
   * NOTE: If you want to use absolute path, you should join `root` and `cwd` by `join(root, cwd)`
   */
  cwd: string
}

interface PatternMatchOptions extends BaseMatchOptions {
  /**
   * The glob pattern to collect the preferences, relative to `PREFERENCES_PATH`
   */
  pattern: string

  /**
   * The glob pattern to ignore the preferences, relative to `PREFERENCES_PATH`
   */
  ignore?: string | string[]
}

interface PathMatchOptions extends BaseMatchOptions {
  /**
   * The path to the preference, the file or folder specified by this path will be treated as a whole preference
   */
  path: string

  /**
   * The name of the preference, determined how user could select the preference
   */
  name: string
}

interface BaseGallery {
  /**
   * The name of the gallery
   */
  name: string

  matchOptions: BaseMatchOptions
}

/**
 * The preference gallery, which collecting the preferences by glob patterns
 */
interface PreferenceGallery extends BaseGallery {
  /**
   * The type of the gallery, which could be `preference` or `template`
   */
  type: 'preference'

  matchOptions: PatternMatchOptions

  /**
   * The options for installing the preferences. If not specified, these gallery will not be installed.
   */
  installOptions?: {
    /**
     * The folder(s) the preferences are installed to
     */
    folders: string | string[]

    /**
     * The mode of preferences installation, if not specified, it will behave as `symlink`
     */
    mode?: 'symlink' | 'copy'

    /**
     * The condition for installing the preferences, if not specified, it will be treated as `true`
     */
    condition?: (() => boolean)

    // Hooks

    /**
     * The function to run after installing the preferences
     */
    afterInstall?: ((options: InstallOptions) => void) | ((options: InstallOptions) => Promise<void>)
  }
}

/**
 * The template gallery, which collecting the templates by glob patterns or paths
 */
type TemplateGallery = TemplateSeparateGallery | TemplateComposeGallery

interface TemplateSeparateGallery extends BaseGallery {
  /**
   * The type of the gallery, which could be `preference` or `template`
   */
  type: 'template-separate'

  matchOptions: PatternMatchOptions
}

interface TemplateComposeGallery extends BaseGallery {

  /**
   * The type of the gallery, which could be `preference` or `template`
   */
  type: 'template-compose'

  matchOptions: PathMatchOptions
}
