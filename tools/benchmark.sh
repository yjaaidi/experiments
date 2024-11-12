#!/usr/bin/env sh

set -e

TOOLS_DIR=$(dirname "$0")
WORKSPACE_DIR="$TOOLS_DIR/.."
BENCHMARKS_DIR="$WORKSPACE_DIR/dist/benchmarks"

# Make sure dist folder exists for reports.
mkdir -p $BENCHMARKS_DIR

HYPERFINE_OPTIONS="--ignore-failure --sort mean-time"
for target in $($TOOLS_DIR/list-test-targets.sh); do
  command="nx $target demo --skip-nx-cache"
  HYPERFINE_OPTIONS="$HYPERFINE_OPTIONS --command-name $target '$command'"
done

$TOOLS_DIR/clean.sh

rm -Rf apps/demo/src/app/benchmark

# Measure cold start by running one test module.
eval hyperfine --export-markdown $BENCHMARKS_DIR/benchmark-cold-start.md --prepare "$TOOLS_DIR/clean.sh" $HYPERFINE_OPTIONS

$TOOLS_DIR/generate-tests.sh 100

# Run with cache by running a warmup run first.
eval hyperfine --export-markdown $BENCHMARKS_DIR/benchmark-cache.md --warmup 1 $HYPERFINE_OPTIONS

# Run without cache by clearing caches before each run.
eval hyperfine --export-markdown $BENCHMARKS_DIR/benchmark-no-cache.md --prepare "$TOOLS_DIR/clean.sh" $HYPERFINE_OPTIONS
