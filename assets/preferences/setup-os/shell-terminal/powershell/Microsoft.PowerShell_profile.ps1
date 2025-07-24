# ENCODING
# Setting the encoding to UTF-8
$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [Text.Encoding]::UTF8

# VARIABLES
# $env:PATH:
# Add current node_modules/.bin to PATH if it exists, so we can run npm scripts without `npx`
if (Test-Path -Path "node_modules") {
  $env:PATH = "{0}{1}node_modules{1}.bin;{2}" -f (Get-Location), [System.IO.Path]::DirectorySeparatorChar, $env:PATH
}
# $HISTORY: Path to the PowerShell history file
$HISTORY = Join-Path $env:APPDATA "Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt"

# ENVIRONMENT SETUP
# fnm
fnm env --use-on-cd --corepack-enabled --shell powershell | Out-String | Invoke-Expression

# UI
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH/the-unnamed.omp.json" | Invoke-Expression

# COMMANDS ENHANCEMENTS
# Clear-AllHistory: Clear all history
function Clear-AllHistory {
  [Microsoft.PowerShell.PSConsoleReadLine]::ClearHistory()
  if (Test-Path $HISTORY) {
    Clear-Content $HISTORY -Force
  }
}

# COMMAND ALIASES
# which: Show the path of commands
New-Alias -Name which -Value where.exe
# touch: Create a file, using `touch` instead of `ni` (We use `ni` for `@antfu/ni`)
Remove-Item Alias:ni -Force -ErrorAction Ignore
New-Alias -Name touch -Value New-Item
# grep
New-Alias -Name grep -Value Select-String

# COMMAND SHORTCUTS
# clh: Clear All History
New-Alias -Name clh -Value Clear-AllHistory
# dev, build, stub, start, release, lint, fix, typecheck:
# Run npm scripts quickly while we are in a directory that has a `package.json`
if (Test-Path -Path "package.json") {
  New-Alias -Name dev -Value 'nr dev'
  New-Alias -Name build -Value 'nr build'
  New-Alias -Name stub -Value 'nr stub'
  New-Alias -Name start -Value 'nr start'
  New-Alias -Name release -Value 'nr release'
  New-Alias -Name lint -Value 'nr lint'
  New-Alias -Name fix -Value 'nr fix'
  New-Alias -Name typecheck -Value 'nr typecheck'
}

