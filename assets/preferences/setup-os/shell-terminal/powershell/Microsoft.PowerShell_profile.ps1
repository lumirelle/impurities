# FUNCTIONS
function Any-Path-Exists {
  foreach ($p in $args) {
    if (Test-Path -Path $p) {
      return $true
    }
  }
  return $false
}

function Any-Path-Exists-Parent {
  foreach ($p in $args) {
    $abs = Join-Path -Path $pwd -ChildPath $p
    $level = $abs.Split([System.IO.Path]::DirectorySeparatorChar) | Measure-Object | Select-Object -ExpandProperty Count
    for ($i = 1; $i -lt $level; $i++) {
      $dir = ($abs.Split([System.IO.Path]::DirectorySeparatorChar) | Select-Object -SkipLast $i) -Join [System.IO.Path]::DirectorySeparatorChar | Join-Path -ChildPath $p
      if (Test-Path -Path $dir) {
        return $true
      }
    }
  }
  return $false
}

function Nr-Agent {
  if (Any-Path-Exists-Parent "package.json") {
    if (Get-Command -Name nr -ErrorAction SilentlyContinue) {
      nr @args
    } else {
      Write-Warning "Warning: @antfu/ni is not installed as a global node package."
    }
  }
}

# LANGUAGE & ENCODING
# Setting the encoding to UTF-8
$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [Text.Encoding]::UTF8

# $PATH
# >> Setting up fnm
fnm env --use-on-cd --corepack-enabled --shell powershell | Out-String | Invoke-Expression
# >> Add current node_modules/.bin to PATH if it exists, so we can run npm scripts without `npx`.
if (Any-Path-Exists-Parent "package.json") {
  $env:PATH = "{0}{1}node_modules{1}.bin;{2}" -f (Get-Location), [System.IO.Path]::DirectorySeparatorChar, $env:PATH
}

# UI
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH/the-unnamed.omp.json" | Invoke-Expression

# COMMAND ALIASES
# which: Show the path of commands
New-Alias -Name which -Value where.exe
# touch: Create a file, using `touch` instead of `ni` (We use `ni` for `@antfu/ni`)
Remove-Item Alias:ni -Force -ErrorAction Ignore
New-Alias -Name touch -Value New-Item
# grep
New-Alias -Name grep -Value Select-String

# COMMAND SHORTCUTS
# dev, test, build, stub, start, release, lint, typecheck:
# Run npm scripts quickly while we are in a directory that has a `package.json`
function Nr-Dev {
  Nr-Agent dev @args
}
function Nr-Test {
  Nr-Agent test @args
}
function Nr-Build {
  Nr-Agent build @args
}
function Nr-Stub {
  Nr-Agent stub @args
}
function Nr-Start {
  Nr-Agent start @args
}
function Nr-Release {
  Nr-Agent release @args
}
function Nr-Lint {
  Nr-Agent lint @args
}
function Nr-Typecheck {
  Nr-Agent typecheck @args
}
New-Alias -Name dev -Value Nr-Dev
New-Alias -Name test -Value Nr-Test
New-Alias -Name build -Value Nr-Build
New-Alias -Name stub -Value Nr-Stub
Remove-Item Alias:start -Force -ErrorAction Ignore
New-Alias -Name start -Value Nr-Start
New-Alias -Name release -Value Nr-Release
New-Alias -Name lint -Value Nr-Lint
New-Alias -Name typecheck -Value Nr-Typecheck

