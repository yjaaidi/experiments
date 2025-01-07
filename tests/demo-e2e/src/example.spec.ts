import { test, expect } from '../testing';

test('has title', async ({ page }) => {
  await page.goto('/');

  expect(await page.locator('h1').innerText()).toContain('Welcome');
});

test('says goodbye', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Quit' }).click();

  expect(await page.locator('h1').innerText()).toContain('Bye');
});
