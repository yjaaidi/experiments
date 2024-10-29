#!/usr/bin/env sh

for LIB in libs/*/*;
do
  git rm $LIB/*.*
  git mv $LIB/src/* $LIB
  sed -i '' 's|src/||g' tsconfig.base.json
done
