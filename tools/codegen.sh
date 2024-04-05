#!/usr/bin/env sh

set -e

TOOLS_DIR=$(dirname "$0")
TARGETS=$($TOOLS_DIR/list-test-targets.sh)

TARGET_ARRAY=$(echo "$TARGETS" | jq -ncR '[inputs]')

# Update the test matrix in the GitHub Actions workflow file.
yq e ".jobs.*.strategy.matrix.test = $TARGET_ARRAY" -i "$TOOLS_DIR/../.github/workflows/test.yml"
