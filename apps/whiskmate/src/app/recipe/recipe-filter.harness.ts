import { RecipeFilter } from './recipe-filter';
import { ComponentHarness } from '@angular/cdk/testing';

export class RecipeFilterHarness extends ComponentHarness {
  static hostSelector = 'wm-recipe-filter';

  async setValue(filter: RecipeFilter) {
    await this._setInputValue('[data-role=keywords-input]', filter.keywords);
    await this._setInputValue(
      '[data-role=max-ingredient-count-input]',
      filter.maxIngredientCount?.toString(),
    );
    await this._setInputValue(
      '[data-role=max-step-count-input]',
      filter.maxStepCount?.toString(),
    );
  }

  private async _setInputValue(selector: string, value?: string) {
    if (value == null) {
      return;
    }
    const element = await this.locatorFor(selector)();
    await element.setInputValue(value);
    await element.dispatchEvent('input');
  }
}
