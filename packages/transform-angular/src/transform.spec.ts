import { PluginItem, transformSync } from '@babel/core';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import transformAngular from './transform';

describe('test transform', () => {
  test('replace mount with runInBrowser', () => {
    const { transform } = setUp();

    const result = transform(RECIPE_SEARCH_TEST);

    expect.soft(result).toContain(`\
test('...', async ({
  page,
  expect,
  runInBrowser
}) => {
  await runInBrowser(async () => {
    await pwMount(RecipeSearchComponent);
  });
`);
  });

  test('do not add runInBrowser twice if already used', () => {
    const { transform } = setUp();

    const result = transform({
      relativeFilePath: `src/recipe-search.spec.ts`,
      code: `\
import { RecipeSearchComponent } from './recipe-search.component';

test('...', async ({page, expect, mount, runInBrowser}) => {
  await mount(RecipeSearchComponent);

  await runInBrowser(async () => {});
});`,
    });

    expect.soft(result).toContain(`\
test('...', async ({
  page,
  expect,
  runInBrowser
}) => {`);
  });
});

const RECIPE_SEARCH_TEST = {
  relativeFilePath: 'src/recipe-search.spec.ts',
  code: `
  import { TestBed } from '@angular/core/testing';
  import { expect, test } from '@playwright/test';
  import { RecipeSearchComponent } from './recipe-search.component';

  test('...', async ({page, expect, mount}) => {
    await mount(RecipeSearchComponent);

    await expect(page.getByRole('listitem')).toHaveText(['Burger', 'Salad']);
  });
`,
};

function setUp() {
  const projectRoot = '/path/to/project';

  /* Keep this here to reuse the same plugin instance when multiple files are transformed
   * to make sure the context is reset properly.
   * Cf. "reset context between files" test */
  const plugin: PluginItem = [transformAngular];

  return {
    transform({
      relativeFilePath,
      code,
    }: {
      relativeFilePath: string;
      code: string;
    }) {
      return transformSync(code, {
        filename: join(projectRoot, relativeFilePath),
        plugins: [plugin],
      })?.code;
    },
  };
}
