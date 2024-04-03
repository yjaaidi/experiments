#!/usr/bin/env sh

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 angular-cli-jest|angular-cli-karma|angular-cli-web-test-runner|jest|jest-swc|vitest"
  exit 1
fi

TARGET=$1

# Clear all transform caches.
bun jest --clearCache -c apps/demo/jest.config.ts
bun jest --clearCache -c apps/demo/jest-swc.config.ts
rm -Rf dist node_modules/.vite

BENCHMARK_FOLDER=apps/demo/src/app/benchmark
rm -rf $BENCHMARK_FOLDER
mkdir -p $BENCHMARK_FOLDER
for i in $(seq 1 400); do
  cat apps/demo/src/app/app.component.spec.ts | sed "s/app.component/app.component.$i/g" > $BENCHMARK_FOLDER/app.component.$i.spec.ts
  cat apps/demo/src/app/app.component.ts | sed "s/app.component/app.component.$i/g" | sed "s|\./recipe|../recipe|g" > $BENCHMARK_FOLDER/app.component.$i.ts
  cp apps/demo/src/app/app.component.html $BENCHMARK_FOLDER/app.component.$i.html
done

nx "$TARGET" demo --skip-nx-cache
