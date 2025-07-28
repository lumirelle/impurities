# BANNER
$env.config.show_banner = 'short'

# EDITOR
$env.config.buffer_editor = 'cursor'

# COMMAND SHORTCUTS
# dev, build, stub, start, release, lint, typecheck:
# Run npm scripts quickly while we are in a directory that has a `package.json`
# FIXME: That's pity that nushell doesn't support conditional alias right now.
# if (['package.json'] | any {|el| $el | path exists}) {
alias dev = nr dev
alias build = nr build
alias stub = nr stub
alias start = nr start
alias release = nr release
alias lint = nr lint
alias typecheck = nr typecheck
# }
