import { expect, test } from '@jscutlery/playwright-ct-angular';
import { RecipeSearchTestContainerComponent } from './recipe-search.test-container';

test('should search recipes without filtering', async ({ mount }) => {
  const locator = await mount(RecipeSearchTestContainerComponent);

  await expect(locator.getByRole('heading', { level: 2 })).toHaveText([
    'Burger',
    'Salad',
  ]);
});

test('should filter recipes by keyword', async ({ mount }) => {
  const locator = await mount(RecipeSearchTestContainerComponent);

  await locator.getByLabel('Keywords').fill('Bur');

  await expect(locator.getByRole('heading', { level: 2 })).toHaveText([
    'Burger',
  ]);
});
