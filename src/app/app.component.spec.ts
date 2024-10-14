import { TestBed } from '@angular/core/testing';
import { expect, test } from '../testing/test-bear';
import { AppComponent } from './app.component';

test('should search recipes without filtering', async ({ page, browserStep, step }) => {
  await browserStep(async () => {
    TestBed.createComponent(AppComponent)
  });

  await step(async () => {
    await expect(page.getByRole('listitem')).toHaveText([
      'Burger',
      'Salad',
    ]);
  });
});
