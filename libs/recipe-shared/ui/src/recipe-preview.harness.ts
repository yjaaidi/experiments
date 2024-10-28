import { ComponentHarness } from '@angular/cdk/testing';

export class RecipePreviewHarness extends ComponentHarness {
  static hostSelector = 'wm-recipe-preview';

  async getName(): Promise<string> {
    return await (await this.locatorFor('[data-role=recipe-name]')()).text();
  }
}
