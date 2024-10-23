import { test as base } from '@playwright/test';
import { Type } from '@angular/core';
export { expect } from '@playwright/test';

export const test = base.extend<{
  mount(cmpType: Type<unknown>): Promise<void>;
  runInBrowser<ARGS extends Record<string, unknown>>(
    fn: (args: ARGS) => Promise<void>,
    args: ARGS,
  ): Promise<void>;
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
    const runInBrowser: any = async (
      runInBrowserFunctionId: string,
      args: Record<string, unknown> = {},
    ) => {
      try {
        await page.waitForFunction(
          (functionId) => (globalThis as any)[functionId],
          runInBrowserFunctionId,
        );
      } catch (e) {
        console.error(
          `Function "${runInBrowserFunctionId}" not found in the browser context.`,
        );
        throw e;
      }

      const normalizedArgs: NormalizedValue[] = await Promise.all(
        Object.entries(args).map(async ([prop, value]) => {
          if (typeof value === 'function') {
            const functionId = `${runInBrowserFunctionId}_${prop}`;
            await page.exposeFunction(functionId, value);
            return { prop, type: 'function', functionId };
          }
          return { prop, type: 'value', value };
        }),
      );

      return await page.evaluate(
        ({ runInBrowserFunctionId, normalizedArgs }) => {
          const args = normalizedArgs.reduce(
            (acc, normalizedValue) => {
              if (normalizedValue.type === 'function') {
                acc[normalizedValue.prop] = (globalThis as any)[
                  normalizedValue.functionId
                ];
              } else {
                acc[normalizedValue.prop] = normalizedValue.value;
              }

              return acc;
            },
            {} as Record<string, unknown>,
          );
          (globalThis as any)[runInBrowserFunctionId](args);
        },
        { runInBrowserFunctionId, normalizedArgs },
      );
    };
    await use(runInBrowser);
  },
});

type NormalizedValue = { prop: string } & (
  | { type: 'value'; value: unknown }
  | { type: 'function'; functionId: string }
);
