#!/usr/bin/env sh

# check first arg is jest or jest-swc or jest-esbuild
TARGET=$1
if [ "$TARGET" != "jest" ] \
  && [ "$TARGET" != "jest-swc" ] \
  && [ "$TARGET" != "jest-ng" ] \
  && [ "$TARGET" != "vitest" ] \
  && [ "$TARGET" != "vitest-swc" ]; then
  echo "First argument must be 'jest' or 'jest-swc' or 'jest-ng' or 'vitest' or 'vitest-swc'"
  exit 1
fi

bun jest --clearCache
rm -Rf dist node_modules/.vite

BENCHMARK_FOLDER=apps/demo/src/app/benchmark
rm -rf $BENCHMARK_FOLDER
mkdir -p $BENCHMARK_FOLDER
for i in $(seq 1 500); do
  cat apps/demo/src/app/app.component.spec.ts | sed "s/app.component/app.component.$i/g" > $BENCHMARK_FOLDER/app.component.$i.spec.ts
  cat apps/demo/src/app/app.component.ts | sed "s/app.component/app.component.$i/g" | sed "s|\./recipe|../recipe|g" > $BENCHMARK_FOLDER/app.component.$i.ts
done

nx $TARGET demo --skip-nx-cache
