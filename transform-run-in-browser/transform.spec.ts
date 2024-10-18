import { transform as babelTransform } from '@babel/core';
import { expect, test } from 'vitest';
import transformRunInBrowser from './transform';

const BASIC_TEST = `
  import { TestBed } from '@angular/core/testing';
  import { expect, test } from '@playwright/test';
  import { RecipeSearchComponent } from './recipe-search.component';

  test('...', async ({page, expect}) => {
    await runInBrowser(async () => {
      TestBed.createComponent(RecipeSearchComponent);
    });

    await expect(page.getByRole('listitem')).toHaveText(['Burger', 'Salad']);
  });
`;

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

test.todo(
  'replace `runInBrowser` function argument with a function identifier',
);

test.todo(
  'remove specifiers that are used in `runInBrowser` but keep other imports',
);

test.todo('extract imports');

test.todo('extract `runInBrowser` function argument');

function transform(code: string) {
  return babelTransform(code, {
    plugins: [transformRunInBrowser],
  })?.code;
}
