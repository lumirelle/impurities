# BANNER
$env.config.show_banner = 'short'

# EDITOR
$env.config.buffer_editor = 'cursor'

# COMMAND SHORTCUTS
# dev, build, stub, start, release, lint, typecheck:
def nr-agent [...rest] {
  if (['package.json'] | any {|el| $el | path exists}) {
    if (which nr | is-empty) {
      echo $'(ansi y)Warning: @antfu/ni is not installed as a global node package.(ansi reset)'
    } else {
      nr ...$rest
    }
  }
}
# Run npm scripts quickly while we are in a directory that has a `package.json`
# FIXME: That's pity that nushell doesn't support conditional alias right now.
# if (['package.json'] | any {|el| $el | path exists}) {
alias dev = nr-agent dev
alias build = nr-agent build
alias stub = nr-agent stub
alias start = nr-agent start
alias release = nr-agent release
alias lint = nr-agent lint
alias typecheck = nr-agent typecheck
# }
