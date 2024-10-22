#!/usr/bin/env sh

set -e

PROJECT_ROOT=$(dirname $(dirname $(realpath "$0")))
GENERATED_DIR=$PROJECT_ROOT/playwright/generated

mkdir -p $GENERATED_DIR

if [ ! -f $GENERATED_DIR/tests.ts ]; then
  echo 'export {};' > $GENERATED_DIR/tests.ts
fi

ng dev -c testing
