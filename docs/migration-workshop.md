
<!-- TOC -->
* [0. Set Up](#0-set-up)
* [1. Automated Migrations](#1-automated-migrations)
  * [1.1. List Migration Generators](#11-list-migration-generators)
  * [1.2. Migrate to Standalone](#12-migrate-to-standalone)
  * [1.3. Migrate to Control Flow](#13-migrate-to-control-flow)
    * [Resources](#resources)
  * [1.4 Migrate to Signals](#14-migrate-to-signals)
* [2. Migrate to Zoneless](#2-migrate-to-zoneless)
* [3. Migrate Two-Way Bindings to `model`](#3-migrate-two-way-bindings-to-model)
    * [Resources](#resources-1)
* [4. Migrate `Paginator` to Signals](#4-migrate-paginator-to-signals)
    * [Resources](#resources-2)
* [5. Migrate `RecipeSearch` to Signals](#5-migrate-recipesearch-to-signals)
    * [Resources](#resources-3)
    * [Tips](#tips)
* [6. Implement "Reset Pattern"](#6-implement-reset-pattern)
    * [Resources](#resources-4)
* [7. Migrate to `rxResource`](#7-migrate-to-rxresource)
    * [Resources](#resources-5)
* [8. Defer Paginator](#8-defer-paginator)
    * [Resources](#resources-6)
<!-- TOC -->

# 0. Set Up

Install Bun & Nx globally:

```sh
npm install -g bun nx
```

# 1. Automated Migrations

## 1.1. List Migration Generators

```sh
nx list @angular/core

# Or

ng g @angular/core: --help
```

## 1.2. Migrate to Standalone

```sh
nx g standalone-migration --mode convert-to-standalone
nx g standalone-migration --mode prune-ng-modules
```

## 1.3. Migrate to Control Flow

```sh
nx g control-flow-migration
```

Then simplify [`@for`](https://angular.dev/api/core/@for) loop tracking in `RecipeSearch`.

### Resources
- https://angular.dev/api/core/@for

## 1.4 Migrate to Signals

```sh
nx g signals
```

# 2. Migrate to Zoneless

1. Replace `provideZoneChangeDetection` with `provideExperimentalZonelessChangeDetection` in [`app.config.ts`](../apps/whiskmate/src/app/app.config.ts).
2. Remove `zone.js` from `project.json`.

# 3. Migrate Two-Way Bindings to `model`

- Replace inputs and outputs with `model` in `RecipeFilter`.
- Simplify `ngModel` in `RecipeFilter`.

### Resources
- https://angular.dev/api/core/model

# 4. Migrate `Paginator` to Signals

### Resources
- https://angular.dev/guide/signals#computed-signals
- https://angular.dev/api/core/@let

# 5. Migrate `RecipeSearch` to Signals

Think of migrating progressively with [`toObservable`](https://angular.dev/api/core/rxjs-interop/toObservable) & [`toSignal`](https://angular.dev/api/core/rxjs-interop/toSignal).

### Resources
- https://angular.dev/api/core/rxjs-interop/toObservable
- https://angular.dev/api/core/rxjs-interop/toSignal

### Tips

- Migrate progressively.
- Note that `toSignal` has an `initialValue` option.

# 6. Implement "Reset Pattern"

We want to reset the `offset` when the `keywords` signal change.

### Resources
- https://angular.dev/api/core/linkedSignal

# 7. Migrate to `rxResource`

Use [`rxResource`](https://angular.dev/api/core/rxjs-interop/rxResource#) to manage calls to the `RecipeRepository`.

### Resources
- https://angular.dev/api/core/rxjs-interop/rxResource

# 8. Defer Paginator

Use [`defer`](https://angular.dev/api/core/@defer) block to defer the loading of the paginator block.

### Resources
- https://angular.dev/api/core/@defer#

