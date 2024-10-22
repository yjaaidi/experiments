import { test as base } from '@playwright/test';
export { expect } from '@playwright/test';

export const test = base.extend<{ runInBrowser: RunInBrowser<any> }>({
  page: async ({ page }, use) => {
    await page.goto('/');
    await use(page);
  },
  runInBrowser: async ({ page }, use) => {
    const runInBrowser: any = async (functionId: string) => {
      await page.waitForFunction(functionId);
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
