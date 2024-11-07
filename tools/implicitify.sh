#!/usr/bin/env sh

set -e

for LIB in libs/*/*;
do
  rm $LIB/*.mjs
  git rm $LIB/*.* $LIB/src/test-setup.ts
  git mv $LIB/src/* $LIB
  rmdir $LIB/src
  sed -i '' 's|src/||g' tsconfig.base.json
done
