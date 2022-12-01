import { ComponentFixtures, expect, test } from '../../playwright-ct-angular';
import type { Page } from '@playwright/test';
import { RecipeFilterComponent } from './recipe-filter.component';

test.describe('<wm-recipe-filter>', () => {
  test('should search recipes without keyword on load', async ({
    page,
    mount,
  }) => {
    const { filterChangeSpy, updateFilter } = await renderRecipeFilter({
      page,
      mount,
    });

    await updateFilter({ keywords: 'Burger' });

    expect(filterChangeSpy).toBeCalledTimes(6);
    expect(filterChangeSpy).lastCalledWith(
      expect.objectContaining({
        keywords: 'Burger',
      })
    );
  });

  async function renderRecipeFilter({
    page,
    mount,
  }: {
    page: Page;
  } & ComponentFixtures) {
    const result = await mount(RecipeFilterComponent, {
      spyOutputs: ['filterChange'],
    });

    return {
      filterChangeSpy: result.spies.filterChange,
      async updateFilter({ keywords }: { keywords: string }) {
        await page.getByLabel('Keywords').type(keywords);
      },
    };
  }
});
