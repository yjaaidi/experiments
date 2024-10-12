import { TestBed } from '@angular/core/testing';
import { expect, test } from '@playwright/test';
import { browserStep } from '../testing/test-bear';
import { AppComponent } from './app.component';

test('should search recipes without filtering', async ({ page }) => {
  await browserStep(async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
  });

  await expect(page.getByRole('heading', { level: 2 })).toHaveText([
    // 'Burger',
    // 'Salad',
  ]);
});
