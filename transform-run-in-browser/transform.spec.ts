import { transform as babelTransform } from '@babel/core';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import transformRunInBrowser from './transform';

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

test('remove imports used in `runInBrowser` only', () => {
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
  const result = transform(BASIC_TEST);
  expect(result).toContain(`import { expect, test } from '@playwright/test';`);
});

test('replace `runInBrowser` function argument with a function identifier', () => {
  const result = transform(BASIC_TEST);
  expect(result).toMatch(
    /await runInBrowser\("src_recipe-search.spec.ts-\w+"\)/,
  );
});

test.todo(
  'remove specifiers that are used in `runInBrowser` but keep other imports',
);

test.todo('extract imports');

test.todo('extract `runInBrowser` function argument');

function transform({
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
        },
      ],
    ],
  })?.code;
}
