import { ComponentHarness } from '@angular/cdk/testing';
import { RecipePreviewHarness } from '@whiskmate/recipe-shared/ui/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { RecipeFilterHarness } from '@whiskmate/recipe/ui/testing';

export class RecipeSearchHarness extends ComponentHarness {
  static hostSelector = 'wm-recipe-search';

  async getFilter(): Promise<RecipeFilterHarness> {
    return this.locatorFor(RecipeFilterHarness)();
  }

  async getFirstRecipeAddButton(): Promise<MatButtonHarness> {
    return this.locatorFor(
      MatButtonHarness.with({ selector: '[data-role=add-recipe]' }),
    )();
  }

  async getRecipeNames(): Promise<string[]> {
    return Promise.all(
      (await this.getRecipePreviews()).map((harness) => harness.getName()),
    );
  }

  async getRecipePreviews(): Promise<RecipePreviewHarness[]> {
    return await this.locatorForAll(RecipePreviewHarness)();
  }
}
