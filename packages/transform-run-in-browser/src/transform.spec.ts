import { transform as babelTransform } from '@babel/core';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import transformRunInBrowser, { TestingOptions } from './transform';
import { FileRepositoryFake } from './testing';

test('remove imports used in `runInBrowser` only', () => {
  const { transform } = setUp();
  const result = transform(BASIC_TEST);
  expect
    .soft(result)
    .not.toContain(`import { TestBed } from '@angular/core/testing';`);
  expect
    .soft(result)
    .not.toContain(
      `import { RecipeSearchComponent } from './recipe-search.component';`,
    );
});

test('keep imports that are used outside `runInBrowser`', () => {
  const { transform } = setUp();

  const result = transform(BASIC_TEST);

  expect(result).toContain(`import { expect, test } from '@playwright/test';`);
});

test('replace `runInBrowser` function argument with a function identifier', () => {
  const { transform } = setUp();

  const result = transform(BASIC_TEST);

  expect(result).toMatch(
    /await runInBrowser\("src_recipe_search_spec_ts_mPLWHe"\)/,
  );
});

test.todo(
  'remove specifiers that are used in `runInBrowser` but keep other imports',
);

test.fails('extract imports', () => {
  const { transform, readRelativeFile } = setUp();

  transform(BASIC_TEST);

  expect(readRelativeFile('playwright-test-server/src/recipe-search.spec.ts'))
    .toContain(`
  import { TestBed } from '@angular/core/testing';
  import { RecipeSearchComponent } from './recipe-search.component';
  `);
});

test('extract `runInBrowser` function', () => {
  const { transform, readRelativeFile } = setUp();

  transform(BASIC_TEST);

  expect.soft(readRelativeFile('playwright-test-server/main.ts')).toContain(`
// src/recipe-search.spec.ts start

globalThis.src_recipe_search_spec_ts_mPLWHe = async () => {
  const { src_recipe_search_spec_ts_mPLWHe } = await import('./src/recipe-search.spec.ts');
  return src_recipe_search_spec_ts_mPLWHe();
};
// src/recipe-search.spec.ts end`);
  expect.soft(
    readRelativeFile('playwright-test-server/src/recipe-search.spec.ts'),
  ).toContain(`export const src_recipe_search_spec_ts_mPLWHe = async () => {
  TestBed.createComponent(RecipeSearchComponent);
}`);
});

test.todo('do not inject the same function (same hash) twice');

const BASIC_TEST = {
  relativeFilePath: 'src/recipe-search.spec.ts',
  code: `
  import { TestBed } from '@angular/core/testing';
  import { expect, test } from '@playwright/test';
  import { RecipeSearchComponent } from './recipe-search.component';

  test('...', async ({page, expect}) => {
    await runInBrowser(async () => {
      TestBed.createComponent(RecipeSearchComponent);
    });

    await expect(page.getByRole('listitem')).toHaveText(['Burger', 'Salad']);
  });
`,
};

function setUp() {
  const projectRoot = '/path/to/project';
  const fileRepository = new FileRepositoryFake();

  return {
    readRelativeFile(relativeFilePath: string) {
      return fileRepository.readFile(join(projectRoot, relativeFilePath));
    },
    transform({
      relativeFilePath,
      code,
    }: {
      relativeFilePath: string;
      code: string;
    }) {
      return babelTransform(code, {
        filename: join(projectRoot, relativeFilePath),
        plugins: [
          [
            transformRunInBrowser,
            {
              projectRoot,
              fileRepository,
            } as TestingOptions,
          ],
        ],
      })?.code;
    },
  };
}
