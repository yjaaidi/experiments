import { TestBed } from '@angular/core/testing';
import { test, expect } from '../testing/test-bear';
import { AppComponent } from './app.component';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

test('should search recipes without filtering', async ({ page, browserStep, step }) => {
  await browserStep(async () => {
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
  });

  await step(async () => {
    await expect(page.getByRole('listitem')).toHaveText([
      'Burger',
      'Salad',
    ]);
  })
});
