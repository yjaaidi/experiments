# Angular [standalone migration's `prune-ng-modules` bug](https://github.com/angular/angular/issues/51420) repro

This is a repro of a bug where `prune-ng-modules` removes imported modules without replacing them with standalone imports.

## Steps to reproduce

1. Clone this repo
2. Run `pnpm install`
3. Run `pnpm ng g @angular/core:standalone --mode convert-to-standalone --path ./`
4. Run `pnpm ng g @angular/core:standalone --mode prune-ng-modules --path ./`

