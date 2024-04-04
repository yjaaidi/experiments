#!/usr/bin/env sh

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <target>"

  # Check if jq is installed...
  which jq || exit 1

  # ...and display the available targets.
  echo
  echo "The target to benchmark which can be any of:"
  nx show project demo \
    | jq -r '.targets | to_entries[] | .key' \
    | grep -v -e build -e lint -e serve -e extract-i18n \
    | sed 's|^|  |'
  exit 1
fi

TARGET=$1

# Clear all transform caches.
bun jest --clearCache -c apps/demo/jest.config.ts
bun jest --clearCache -c apps/demo/jest-swc.config.ts
rm -Rf .angular/cache dist node_modules/.vite node_modules/.vitest

BENCHMARK_FOLDER=apps/demo/src/app/benchmark
rm -rf $BENCHMARK_FOLDER
mkdir -p $BENCHMARK_FOLDER
for i in $(seq 1 400); do
  cat apps/demo/src/app/app.component.spec.ts | sed "s/app.component/app.component.$i/g" > $BENCHMARK_FOLDER/app.component.$i.spec.ts
  cat apps/demo/src/app/app.component.ts | sed "s/app.component/app.component.$i/g" | sed "s|\./recipe|../recipe|g" > $BENCHMARK_FOLDER/app.component.$i.ts
  cp apps/demo/src/app/app.component.html $BENCHMARK_FOLDER/app.component.$i.html
done

nx "$TARGET" demo --skip-nx-cache
