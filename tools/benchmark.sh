#!/usr/bin/env sh

set -e

# Make sure dist folder exists for reports.
mkdir -p dist

TOOLS_DIR=$(dirname "$0")

TARGETS=$(nx show project demo | jq -r '.targets | to_entries[] | .key' | grep -v -e build -e lint -e serve -e extract-i18n)
HYPERFINE_OPTIONS="--ignore-failure"
for target in $TARGETS; do
  command="nx $target demo --skip-nx-cache"
  HYPERFINE_OPTIONS="$HYPERFINE_OPTIONS --command-name $target '$command'"
done

$TOOLS_DIR/clean.sh

rm -Rf apps/demo/src/app/benchmark

# Measure cold start by running one test module.
eval hyperfine --export-markdown dist/benchmark-cold-start.md --prepare "$TOOLS_DIR/clean.sh" $HYPERFINE_OPTIONS

$TOOLS_DIR/generate-tests.sh

# Run with cache by running a warmup run first.
eval hyperfine --export-markdown dist/benchmark-cache.md --warmup 1 $HYPERFINE_OPTIONS

# Run without cache by clearing caches before each run.
eval hyperfine --export-markdown dist/benchmark-no-cache.md --prepare "$TOOLS_DIR/clean.sh" $HYPERFINE_OPTIONS
