# ENVIRONMENT SETUP
# fnm
eval "$(fnm env --use-on-cd --corepack-enabled --shell bash)"

# UI
eval "$(oh-my-posh init bash --config ~/the-unnamed.omp.json)"

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
