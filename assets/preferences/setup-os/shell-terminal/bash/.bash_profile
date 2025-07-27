# ENCODING
# Setting the encoding to UTF-8
export LANG=en_US.UTF-8

# VARIABLES
# $PATH:
# Add current node_modules/.bin to PATH if it exists, so we can run npm scripts without `npx`
if [ -d node_modules ]; then
  export PATH="$PWD/node_modules/.bin:$PATH"
fi

# ENVIRONMENT SETUP
# fnm
eval "$(fnm env --use-on-cd --corepack-enabled --shell bash)"

# UI
eval "$(oh-my-posh init bash --config ~/the-unnamed.omp.json)"

# COMMAND SHORTCUTS
# dev, build, stub, start, release, lint, typecheck:
# Run npm scripts quickly while we are in a directory that has a `package.json`
if [ -f package.json ]; then
  alias dev='nr dev'
  alias build='nr build'
  alias stub='nr stub'
  alias start='nr start'
  alias release='nr release'
  alias lint='nr lint'
  alias typecheck='nr typecheck'
fi
