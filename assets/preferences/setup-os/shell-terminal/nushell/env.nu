# LANGUAGE & ENCODING
# TODO: Setting the language to English and the encoding to UTF-8, is it correct?
$env.LANG = 'en_US.UTF-8'
$env.LC_ALL = 'en_US.UTF-8'

# $PATH
# >> Setting up fnm
# NOTE: fnm does not support nushell officially, so we need to use a workaround
# See: https://github.com/Schniz/fnm/issues/463
if not (which fnm | is-empty) {
  ^fnm env --json | from json | load-env
  $env.PATH = $env.PATH | prepend ($env.FNM_MULTISHELL_PATH | path join (if $nu.os-info.name == 'windows' {''} else {'bin'}))
  $env.config.hooks.env_change.PWD = (
    $env.config.hooks.env_change.PWD? | append {
      condition: {|| ['.nvmrc' '.node-version', 'package.json'] | any {|el| $el | path exists}}
      code: {|| ^fnm use --install-if-missing --corepack-enabled}
    }
  )
}
# >> Add current node_modules/.bin to PATH if this is a npm project, so we can run npm scripts without `npx`
if (['package.json'] | any {|el| $el | path exists}) {
  $env.PATH = ($env.PATH | prepend (pwd | path join 'node_modules' | path join '.bin'))
}

# UI
^oh-my-posh init nu --config $'($env.POSH_THEMES_PATH)/the-unnamed.omp.json'


