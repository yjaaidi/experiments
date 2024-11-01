const scope = {
  mealPlanner: 'scope:meal-planner',
  recipe: 'scope:recipe',
  recipeShared: 'scope:recipe-shared',
  shared: 'scope:shared',
};

const type = {
  app: 'type:app',
  core: 'type:core',
  domain: 'type:domain',
  feature: 'type:feature',
  infra: 'type:infra',
  ui: 'type:ui',
  util: 'type:util',
};

const name = {
  mealPlannerFeatureAddButton: 'name:meal-planner-feature-add-button',
};

const commonAllowedExternalImports = [
  '@angular/core',
  '@angular/core/testing',
  '@angular/platform-browser-dynamic/testing',
  '@analogjs/vitest-angular/*',
  'rxjs',
  'vitest',
];

/**
 * @type {import('@nx/eslint-plugin/src/rules/enforce-module-boundaries').DepConstraint[]}
 */
module.exports = [
  /**
   * Scope boundaries.
   */
  {
    sourceTag: scope.recipe,
    onlyDependOnLibsWithTags: [
      scope.recipe,
      scope.recipeShared,
      scope.shared,
      name.mealPlannerFeatureAddButton,
    ],
  },
  {
    sourceTag: scope.mealPlanner,
    onlyDependOnLibsWithTags: [
      scope.mealPlanner,
      scope.recipeShared,
      scope.shared,
    ],
  },
  {
    sourceTag: scope.shared,
    onlyDependOnLibsWithTags: [scope.shared],
  },
  /**
   * Type boundaries.
   */
  {
    sourceTag: type.app,
    onlyDependOnLibsWithTags: [
      type.core,
      type.domain,
      type.feature,
      type.infra,
      type.ui,
      type.util,
    ],
    allowedExternalImports: [...commonAllowedExternalImports, '@angular/*'],
  },
  {
    sourceTag: type.feature,
    onlyDependOnLibsWithTags: [
      type.core,
      type.domain,
      type.feature,
      type.infra,
      type.ui,
      type.util,
    ],
    allowedExternalImports: [
      ...commonAllowedExternalImports,
      '@angular/cdk/*',
      '@angular/core/*',
      '@angular/material/*',
      '@angular/platform-browser/animations',
      '@angular/router',
      '@jscutlery/operators',
      'ngxtension/*',
    ],
  },
  {
    sourceTag: type.ui,
    onlyDependOnLibsWithTags: [type.core, type.ui, type.util],
    allowedExternalImports: [
      ...commonAllowedExternalImports,
      '@angular/cdk/*',
      '@angular/common',
      '@angular/core/*',
      '@angular/forms',
      '@angular/material/*',
      '@angular/platform-browser/animations',
      '@angular/router',
    ],
  },
  {
    sourceTag: type.domain,
    onlyDependOnLibsWithTags: [type.core, type.domain, type.infra, type.util],
    allowedExternalImports: [
      ...commonAllowedExternalImports,
      '@angular/core/rxjs-interop',
    ],
  },
  {
    sourceTag: type.infra,
    onlyDependOnLibsWithTags: [type.core, type.infra, type.util],
    allowedExternalImports: [
      ...commonAllowedExternalImports,
      '@angular/common/http',
    ],
  },
  {
    sourceTag: type.core,
    onlyDependOnLibsWithTags: [type.core, type.util],
    allowedExternalImports: [...commonAllowedExternalImports],
  },
  {
    sourceTag: type.util,
    onlyDependOnLibsWithTags: [type.util],
    allowedExternalImports: [...commonAllowedExternalImports],
  },
];
