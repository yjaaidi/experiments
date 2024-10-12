import { TestBed } from '@angular/core/testing';
import { test as baseTest, expect } from '@test-bear/playwright';
import { AppComponent } from './app.component';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';


const test = baseTest.extend<{ browserStep: Step, step: Step }>({
  browserStep: async ({page}, use, testInfo) => {
    await use(async () => {
      await page.evaluate(async ({testName}) => {
        const _browserStep = async (fn: () => Promise<void>) => fn();
        await (globalThis as any)._testBearTests[testName]({browserStep: _browserStep, step: () => {}});
      }, {testName: testInfo.title});
    })
  },
  step: async ({}, use) => {
    await use(async (fn) => {
      await fn();
    });
  }
});

type Step = (fn: () => Promise<void>) => Promise<void>;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

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
