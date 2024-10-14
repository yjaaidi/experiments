import { test as baseTest } from '@test-bear/playwright';
export { expect } from '@test-bear/playwright';

export const test = baseTest.extend<{ browserStep: Step, step: Step }>({
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
