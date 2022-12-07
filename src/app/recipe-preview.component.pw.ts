import { expect, test } from '@jscutlery/playwright-ct-angular';
import { RecipePreviewComponent } from './recipe-preview.component';

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

  await expect(locator.page()).toHaveScreenshot();
});
