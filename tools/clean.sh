#!/usr/bin/env sh

set -e

rm -Rf .angular/cache dist/apps/demo node_modules/.vite node_modules/.vitest .swc
bun jest --clearCache -c apps/demo/jest.config.ts > /dev/null
bun jest --clearCache -c apps/demo/jest-swc.config.ts > /dev/null
