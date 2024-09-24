import { expect, test } from '@jscutlery/playwright-ct-angular';
import RecipeSearchComponent from './recipe-search.component';

test('should search recipes without filtering', async ({ mount }) => {
  const locator = await mount(RecipeSearchComponent);

  await expect(locator.getByRole('heading', { level: 2 })).toHaveText([
    'Burger',
    'Salad',
  ]);
});

test('should filter recipes by keyword', async ({ mount }) => {
  const locator = await mount(RecipeSearchComponent);

  await locator.getByLabel('Keywords').fill('Bur');

  await expect(locator.getByRole('heading', { level: 2 })).toHaveText([
    'Burger',
  ]);
});

test('should show "no results" message when no recipes match', async ({
  mount,
}) => {
  const locator = await mount(RecipeSearchComponent);

  await locator.getByLabel('Keywords').fill('arecipethatdoesnotexist');

  await expect(locator).toContainText('no results', {
    ignoreCase: true,
  });
});
