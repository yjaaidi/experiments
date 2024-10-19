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
    /await runInBrowser\("src_recipe-search.spec.ts-mPLWHe"\)/,
  );
});

test.todo(
  'remove specifiers that are used in `runInBrowser` but keep other imports',
);

test.fails('extract imports', () => {
  const { transform, fileRepository } = setUp();

  transform(BASIC_TEST);

  expect(
    fileRepository.readFile('playwright-dev-server/src/recipe-search.spec.ts'),
  ).toContain(`
  import { TestBed } from '@angular/core/testing';
  import { RecipeSearchComponent } from './recipe-search.component';
  `);
});

test.fails('generate runInBrowserFunctions object', () => {
  const { transform, fileRepository } = setUp();

  transform(BASIC_TEST);

  expect
    .soft(fileRepository.readFile('playwright-dev-server/main.ts'))
    .toContain(`globalThis.runInBrowserFuntions = {}`);
});

test.fails('extract `runInBrowser` function', () => {
  const { transform, fileRepository } = setUp();

  transform(BASIC_TEST);

  expect.soft(fileRepository.readFile('playwright-dev-server/main.ts'))
    .toContain(`
    globalThis.runInBrowserFuntions['src_recipe-search.spec.ts-mPLWHe'] = async () => {
      const { runInBrowser⁠_mPLWHe } = await import('./src/recipe-search.spec.ts');
      return runInBrowser⁠_mPLWHe();
    };
  `);
  expect.soft(
    fileRepository.readFile('playwright-dev-server/src/recipe-search.spec.ts'),
  ).toContain(`
  export const runInBrowser⁠_mPLWHe = async () => {
    TestBed.createComponent(RecipeSearchComponent);
  }
  `);
});

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
  const fileRepository = new FileRepositoryFake();

  return {
    fileRepository,
    transform({
      relativeFilePath,
      code,
    }: {
      relativeFilePath: string;
      code: string;
    }) {
      const projectRoot = '/path/to/project';
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
