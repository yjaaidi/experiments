#!/usr/bin/env sh

set -e

rm -Rf .angular/cache dist node_modules/.vite node_modules/.vitest
bun jest --clearCache -c apps/demo/jest.config.ts
bun jest --clearCache -c apps/demo/jest-swc.config.ts
