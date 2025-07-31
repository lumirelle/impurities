#!/usr/bin/env bash
source ../../../../../assets/preferences/setup-os/shell-terminal/bash/.bash_profile

total_tests=0
passed_tests=0
failed_tests=0

echo "--------------------------------"
echo "Testing Start..."
echo "--------------------------------"

if any-path-exists 'not-exists-file'; then
  echo "Test failed: any-path-exists 'not-exists-file' is true"
  failed_tests=$((failed_tests + 1))
else
  echo "Test passed: any-path-exists 'not-exists-file' is false"
  passed_tests=$((passed_tests + 1))
fi
total_tests=$((total_tests + 1))

if any-path-exists-parent 'not-exists-file'; then
  echo "Test failed: any-path-exists-parent 'not-exists-file' is true"
  failed_tests=$((failed_tests + 1))
else
  echo "Test passed: any-path-exists-parent 'not-exists-file' is false"
  passed_tests=$((passed_tests + 1))
fi
total_tests=$((total_tests + 1))

if any-path-exists 'test.sh'; then
  echo "Test passed: any-path-exists 'test.sh' is true"
  passed_tests=$((passed_tests + 1))
else
  echo "Test failed: any-path-exists 'test.sh' is false"
  failed_tests=$((failed_tests + 1))
fi
total_tests=$((total_tests + 1))

if any-path-exists-parent 'test.sh'; then
  echo "Test passed: any-path-exists-parent 'test.sh' is true"
  passed_tests=$((passed_tests + 1))
else
  echo "Test failed: any-path-exists-parent 'test.sh' is false"
  failed_tests=$((failed_tests + 1))
fi
total_tests=$((total_tests + 1))

echo "--------------------------------"
echo "Total tests: $total_tests"
echo "Passed tests: $passed_tests"
echo "Failed tests: $failed_tests"
echo "--------------------------------"
