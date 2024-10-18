import { test as base } from '@playwright/test';
export { expect } from '@playwright/test';

export const test = base.extend<{ runInBrowser: RunInBrowser<any> }>({
  runInBrowser: async ({ page }, use) => {
    const runInBrowser: RunInBrowser<unknown> = async (fn) => {
      return await page.evaluate(fn);
    };
    await use(runInBrowser);
  },
});

interface RunInBrowser<T> {
  (fn: () => Promise<T>): Promise<T>;
}
