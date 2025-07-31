#!/usr/bin/env bash
source ../../../assets/preferences/setup-os/shell-terminal/bash/.bash_profile > /dev/null 2>&1

total_tests=0
passed_tests=0
failed_tests=0
silent=false

if [ "$1" == "--silent" ]; then
  silent=true
fi

if [ "$silent" == false ]; then
  echo "--------------------------------"
  echo "Testing Start..."
  echo "--------------------------------"
fi

if any-path-exists 'not-exists-file'; then
  if [ "$silent" == false ]; then
    echo "Test failed: any-path-exists 'not-exists-file' is true"
  fi
  failed_tests=$((failed_tests + 1))
else
  if [ "$silent" == false ]; then
    echo "Test passed: any-path-exists 'not-exists-file' is false"
  fi
  passed_tests=$((passed_tests + 1))
fi
total_tests=$((total_tests + 1))

if any-path-exists-parent 'not-exists-file'; then
  if [ "$silent" == false ]; then
    echo "Test failed: any-path-exists-parent 'not-exists-file' is true"
  fi
  failed_tests=$((failed_tests + 1))
else
  if [ "$silent" == false ]; then
    echo "Test passed: any-path-exists-parent 'not-exists-file' is false"
  fi
  passed_tests=$((passed_tests + 1))
fi
total_tests=$((total_tests + 1))

if any-path-exists 'test.sh'; then
  if [ "$silent" == false ]; then
    echo "Test passed: any-path-exists 'test.sh' is true"
  fi
  passed_tests=$((passed_tests + 1))
else
  if [ "$silent" == false ]; then
    echo "Test failed: any-path-exists 'test.sh' is false"
  fi
  failed_tests=$((failed_tests + 1))
fi
total_tests=$((total_tests + 1))

if any-path-exists-parent 'test.sh'; then
  if [ "$silent" == false ]; then
    echo "Test passed: any-path-exists-parent 'test.sh' is true"
  fi
  passed_tests=$((passed_tests + 1))
else
  if [ "$silent" == false ]; then
    echo "Test failed: any-path-exists-parent 'test.sh' is false"
  fi
  failed_tests=$((failed_tests + 1))
fi
total_tests=$((total_tests + 1))

if [ "$silent" == false ]; then
  echo "--------------------------------"
  echo "Total tests: $total_tests"
  echo "Passed tests: $passed_tests"
  echo "Failed tests: $failed_tests"
  echo "--------------------------------"
fi

if [ "$silent" == true ]; then
  echo $total_tests
  echo $passed_tests
  echo $failed_tests
fi
