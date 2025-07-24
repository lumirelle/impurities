// -----------------------------------------------------------------------------
// CLI Options
// -----------------------------------------------------------------------------

export interface InstallOptions {
  force?: boolean
  verbose?: boolean
}

export interface UninstallOptions {
  verbose?: boolean
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
}

// -----------------------------------------------------------------------------
// Configurations
// -----------------------------------------------------------------------------

export type Gallery = PreferenceGallery | TemplateGallery

/**
 * The preference gallery, which collecting the preferences by glob patterns
 */
interface PreferenceGallery {
  /**
   * The type of the gallery, which could be `preference` or `template`
   */
  type: 'preference'

  matchOptions: {
    /**
     * CWD
     */
    cwd: string

    /**
     * The glob pattern to collect the preferences, relative to `PREFERENCES_PATH`
     */
    pattern: string

    /**
     * The glob pattern to ignore the preferences, relative to `PREFERENCES_PATH`
     */
    ignore?: string | string[]
  }

  /**
   * The options for installing the preferences. If not specified, these gallery will not be installed.
   */
  installOptions?: {
    /**
     * The folder(s) the preferences are installed to
     */
    folders: string | string[]

    /**
     * The condition for installing the preferences, if not specified, it will be treated as `true`
     */
    condition?: (() => boolean)

    /**
     * The mode of preferences installation, if not specified, it will behave as `symlink`
     */
    mode?: 'symlink' | 'copy'
  }

}

/**
 * The template gallery, which collecting the templates by glob patterns or paths
 */
type TemplateGallery = TemplateSeparateGallery | TemplateComposeGallery

interface TemplateSeparateGallery {
  /**
   * The type of the gallery, which could be `preference` or `template`
   */
  type: 'template-separate'

  matchOptions: {
    /**
     * CWD
     */
    cwd: string

    /**
     * The glob pattern to collect the templates, relative to `TEMPLATES_PATH`
     */
    pattern: string

    /**
     * The glob pattern to ignore the templates, relative to `TEMPLATES_PATH`
     */
    ignore?: string | string[]
  }

}

interface TemplateComposeGallery {

  /**
   * The type of the gallery, which could be `preference` or `template`
   */
  type: 'template-compose'

  matchOptions: {
    /**
     * CWD
     */
    cwd: string

    /**
     * The path to the template, the file or folder specified by this path will be treated as a whole template
     */
    path: string

    /**
     * The name of the template, determined how user could select the template
     */
    name: string
  }
}
