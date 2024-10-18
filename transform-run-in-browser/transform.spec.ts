import { transform as babelTransform } from '@babel/core';
import { expect, test } from 'vitest';
import transformRunInBrowser from './transform';

const BASIC_TEST = {
  filename: 'recipe-search.spec.ts',
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

test.todo(
  'replace `runInBrowser` function argument with a function identifier',
  () => {
    const result = transform(BASIC_TEST);
    expect(result).toMatch(
      /await runInBrowser('[a-z_]*_recipe-search.spec.ts-0')/,
    );
  },
);

test.todo(
  'remove specifiers that are used in `runInBrowser` but keep other imports',
);

test.todo('extract imports');

test.todo('extract `runInBrowser` function argument');

function transform({ filename, code }: { filename: string; code: string }) {
  return babelTransform(code, {
    filename: filename,
    plugins: [transformRunInBrowser],
  })?.code;
}
