# I remove this alias in profile, but powershell tell me it is still there
# Fucking PowerShell!
Remove-Item Alias:start -Force -ErrorAction Ignore
# Load if our profile is not loaded or if it is not the same as the one in the assets
if (-not (Test-Path $PROFILE) -or (Get-FileHash $PROFILE).Hash -ne (Get-FileHash ../../../assets/preferences/setup-os/shell-terminal/powershell/Microsoft.PowerShell_profile.ps1).Hash) {
  . ../../../assets/preferences/setup-os/shell-terminal/powershell/Microsoft.PowerShell_profile.ps1
}

$silent = $false

if ($args[0] -eq '--silent') {
  $silent = $true
}

if ($silent -eq $false) {
  Write-Host "--------------------------------"
  Write-Host "Testing Start..."
  Write-Host "--------------------------------"
}

$TotalTests = 0
$PassedTests = 0
$FailedTests = 0

if (any-path-exists 'not-exists-file') {
  if ($silent -eq $false) {
    Write-Host "Test failed: any-path-exists 'not-exists-file' is true"
  }
  $FailedTests++
} else {
  if ($silent -eq $false) {
    Write-Host "Test passed: any-path-exists 'not-exists-file' is false"
  }
  $PassedTests++
}
$TotalTests++

if (any-path-exists-parent 'not-exists-file') {
  if ($silent -eq $false) {
    Write-Host "Test failed: any-path-exists-parent 'not-exists-file' is true"
  }
  $FailedTests++
} else {
  if ($silent -eq $false) {
    Write-Host "Test passed: any-path-exists-parent 'not-exists-file' is false"
  }
  $PassedTests++
}
$TotalTests++

if (any-path-exists 'test.ps1') {
  if ($silent -eq $false) {
    Write-Host "Test passed: any-path-exists 'test.ps1' is true"
  }
  $PassedTests++
} else {
  if ($silent -eq $false) {
    Write-Host "Test failed: any-path-exists 'test.ps1' is false"
  }
  $FailedTests++
}
$TotalTests++

if (any-path-exists-parent 'test.ps1') {
  if ($silent -eq $false) {
    Write-Host "Test passed: any-path-exists-parent 'test.ps1' is true"
  }
  $PassedTests++
} else {
  if ($silent -eq $false) {
    Write-Host "Test failed: any-path-exists-parent 'test.ps1' is false"
  }
  $FailedTests++
}
$TotalTests++

if ($silent -eq $false) {
  Write-Host "--------------------------------"
  Write-Host "Total tests: $TotalTests"
  Write-Host "Passed tests: $PassedTests"
  Write-Host "Failed tests: $FailedTests"
  Write-Host "--------------------------------"
}

if ($silent -eq $true) {
  Write-Host $TotalTests
  Write-Host $PassedTests
  Write-Host $FailedTests
}
