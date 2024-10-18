import { transform as babelTransform } from '@babel/core';
import { expect, test } from 'vitest';
import transformRunInBrowser from './transform';

test.todo('remove imports used in `runInBrowser` only', () => {
  const result = transform(`
import { TestBed } from '@angular/core/testing';
import { expect, test } from '../testing/test';
import { AppComponent } from './app.component';

test('should search recipes without filtering', async ({
  page,
  runInBrowser,
}) => {
  await runInBrowser(async () => {
    TestBed.createComponent(AppComponent);
  });

  await expect(page.getByRole('listitem')).toHaveText(['Burger', 'Salad']);
});
`);

  expect
    .soft(result)
    .not.toContain(`import { TestBed } from '@angular/core/testing';`);
  expect
    .soft(result)
    .not.toContain(`import { AppComponent } from './app.component';`);
});

test.todo('keep imports that are used outside `runInBrowser`');

test.todo(
  'replace `runInBrowser` function argument with a function identifier',
);

test.todo('extract imports');

test.todo('extract `runInBrowser` function argument');

function transform(code: string) {
  return babelTransform(code, {
    plugins: [transformRunInBrowser],
  })?.code;
}
