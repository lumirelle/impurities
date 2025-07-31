#!/usr/bin/env nu
use '../../../../../assets/preferences/setup-os/shell-terminal/nushell/defs.nu' *

def main [] {
  print "--------------------------------"
  print "Testing Start..."
  print "--------------------------------"

  mut total_tests = 0
  mut passed_tests = 0
  mut failed_tests = 0

  if (['not-exists-file'] | any-path-exists) {
    print $"(ansi red)Test failed: any-path-exists 'not-exists-file' is true(ansi reset)"
    $failed_tests += 1
  } else {
    print $"(ansi green)Test passed: any-path-exists 'not-exists-file' is false(ansi reset)"
    $passed_tests += 1
  }
  $total_tests += 1

  if (['not-exists-file'] | any-path-exists-parent) {
    print $"(ansi red)Test failed: any-path-exists-parent 'not-exists-file' is true(ansi reset)"
    $failed_tests += 1
  } else {
    print $"(ansi green)Test passed: any-path-exists-parent 'not-exists-file' is false(ansi reset)"
    $passed_tests += 1
  }
  $total_tests += 1

  if (['test.nu'] | any-path-exists) {
    print $"(ansi green)Test passed: any-path-exists 'test.nu' is true(ansi reset)"
    $passed_tests += 1
  } else {
    print $"(ansi red)Test failed: any-path-exists 'test.nu' is false(ansi reset)"
    $failed_tests += 1
  }
  $total_tests += 1

  if (['test.nu'] | any-path-exists-parent) {
    print $"(ansi green)Test passed: any-path-exists-parent 'test.nu' is true(ansi reset)"
    $passed_tests += 1
  } else {
    print $"(ansi red)Test failed: any-path-exists-parent 'test.nu' is false(ansi reset)"
    $failed_tests += 1
  }
  $total_tests += 1

  print "--------------------------------"
  print $"Total tests: ($total_tests)"
  print $"(ansi green)Passed tests: ($passed_tests)(ansi reset)"
  print $"(ansi red)Failed tests: ($failed_tests)(ansi reset)"
  print "--------------------------------"
}


