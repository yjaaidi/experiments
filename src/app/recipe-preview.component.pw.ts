import { test } from '@jscutlery/playwright-ct-angular';
import { RecipePreviewComponent } from './recipe-preview.component';
import { verifyScreenshot } from './testing/verify-screenshot';

const burger = {
  id: `rec_burger`,
  name: 'Burger',
  description: `A delicious Burger.`,
  ingredients: [],
  pictureUri:
    'https://www.ninkasi.fr/wp-content/uploads/2022/06/header_burger.jpg',
  steps: [],
};

test('<wm-recipe-preview> should be beautiful', async ({ mount }) => {
  const locator = await mount(RecipePreviewComponent, {
    inputs: {
      recipe: burger,
    },
  });
  /* Prefer using whole page screenshot for two reasons:
   * 1. it's the same resolution and the Playwright reporter diff will show slider.
   * 2. we make sure that there's no extra overlay in the DOM (e.g. dialog). */
  await verifyScreenshot(locator.page());
});
