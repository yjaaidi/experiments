import { test as base } from '@playwright/test';
import { Type } from '@angular/core';
export { expect } from '@playwright/test';

interface Fixtures {
  mount(cmpType: Type<unknown>): Promise<void>;
  runInBrowser<
    DATA extends Record<string, unknown> = {},
    CALLBACKS extends Record<string, (...args: any[]) => void> = {},
  >(
    fn: (args: { data: DATA; callbacks: CALLBACKS }) => Promise<void>,
    args?: { data?: DATA; callbacks?: CALLBACKS },
  ): Promise<void>;
}

export const test = base.extend<Fixtures>({
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
    const runInBrowser: Fixtures['runInBrowser'] = async (
      fn,
      { data = {}, callbacks = {} } = {},
    ) => {
      /* Function is replaced by functionId by babel transform. */
      const functionId: string = fn as any;

      try {
        await page.waitForFunction(
          (functionId) => (globalThis as any)[functionId],
          functionId,
        );
      } catch (e) {
        console.error(
          `Function "${functionId}" not found in the browser context.`,
        );
        throw e;
      }

      const exposedCallbacks = await Promise.all(
        Object.entries(callbacks).map(async ([prop, callback]) => {
          const callbackId = `${functionId}_${prop}`;
          await page.exposeFunction(callbackId, callback);
          return { prop, callbackId };
        }),
      );

      return await page.evaluate(
        ({ functionId, data, exposedCallbacks }) => {
          const callbacks = exposedCallbacks.reduce(
            (acc, { prop, callbackId }) => {
              acc[prop] = (globalThis as any)[callbackId];
              return acc;
            },
            {} as Record<string, unknown>,
          );

          (globalThis as any)[functionId]({ data, callbacks });
        },
        { functionId, data, exposedCallbacks },
      );
    };
    await use(runInBrowser);
  },
});
