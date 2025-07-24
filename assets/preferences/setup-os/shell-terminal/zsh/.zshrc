# Zsh plugins
source ~/.zshplugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
source ~/.zshplugins/zsh-autosuggestions/zsh-autosuggestions.zsh

# ENVIRONMENT SETUP
# fnm
eval "$(fnm env --use-on-cd --corepack-enabled --shell zsh)"

# UI
eval "$(.oh-my-posh/oh-my-posh init zsh --config ~/the-unnamed.omp.json)"

# COMMAND SHORTCUTS
# COMMAND SHORTCUTS
# dev, build, stub, start, release, lint, fix, typecheck:
# Run npm scripts quickly while we are in a directory that has a `package.json`
if [ -f package.json ]; then
  alias dev='nr dev'
  alias build='nr build'
  alias stub='nr stub'
  alias start='nr start'
  alias release='nr release'
  alias lint='nr lint'
  alias fix='nr fix'
  alias typecheck='nr typecheck'
fi
