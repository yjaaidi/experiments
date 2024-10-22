import { test as base } from '@playwright/test';
import { Type } from '@angular/core';
export { expect } from '@playwright/test';

export const test = base.extend<{
  mount: (cmpType: Type<unknown>) => Promise<void>;
  runInBrowser: RunInBrowser<any>;
}>({
  mount: async ({}, use, testInfo) => {
    await use(() => {
      throw new Error(`test file ${testInfo.file} was not transformed.

      Please enable the 'transform-angular' babel plugin to fix this.`);
    });
  },
  page: async ({ page }, use) => {
    await page.goto('/');
    await use(page);
  },
  runInBrowser: async ({ page }, use) => {
    const runInBrowser: any = async (functionId: string) => {
      await page.waitForFunction(
        ({ functionId }) => (globalThis as any)[functionId],
        { functionId },
      );

      return await page.evaluate(
        ({ functionId }) => {
          (globalThis as any)[functionId]();
        },
        { functionId },
      );
    };
    await use(runInBrowser);
  },
});

interface RunInBrowser<T> {
  (fn: () => Promise<T>): Promise<T>;
}
