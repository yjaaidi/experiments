import { test, expect } from '@jscutlery/playwright-ct-angular';
import { RecipeSearchTestContainer } from './recipe-search.test-container';

test('should search recipes without filtering', async ({ mount }) => {
  const locator = await mount(RecipeSearchTestContainer);

  await expect(locator.getByRole('heading', { level: 2 })).toHaveText([
    'Burger',
    'Salad',
  ]);
});
