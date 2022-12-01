import { ComponentFixtures, expect, test } from '../../playwright-ct-angular';
import { RecipeSearchTestContainerComponent } from './recipe-search-test-container.component';
import { recipeMother } from './testing/recipe.mother';
import type { Page } from '@playwright/test';

test.describe('<wm-recipe-search>', () => {
  test('should search recipes without keyword on load', async ({
    page,
    mount,
  }) => {
    const { recipeTitleLocator, verifyScreenshot } =
      await renderSearchComponent({ page, mount });

    await expect(recipeTitleLocator).toHaveText(['Beer', 'Burger']);

    await verifyScreenshot();
  });

  test('should search recipes using given filter', async ({ page, mount }) => {
    const { recipeTitleLocator, updateFilter } = await renderSearchComponent({
      page,
      mount,
    });

    await updateFilter({
      keywords: 'Bur',
    });

    await expect(recipeTitleLocator).toHaveText(['Burger']);
  });

  async function renderSearchComponent({
    page,
    mount,
  }: { page: Page } & ComponentFixtures) {
    await mount(RecipeSearchTestContainerComponent, {
      inputs: {
        recipes: [
          recipeMother.withBasicInfo('Beer').build(),
          recipeMother.withBasicInfo('Burger').build(),
        ],
      },
    });

    return {
      recipeTitleLocator: page.getByRole('heading', {
        name: "Recipe's Name",
      }),
      async updateFilter({ keywords }: { keywords: string }) {
        await page.getByLabel('Keywords').type(keywords);
      },
      async verifyScreenshot() {
        /* Wait for images to load. */
        await page.waitForLoadState('networkidle');
        /* jpg rendering might change a bit so let's reduce the threshold. */
        await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.05 });
      },
    };
  }
});
