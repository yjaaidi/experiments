import { expect } from '@jscutlery/playwright-ct-angular';
import type { Page } from '@playwright/test';

export async function verifyScreenshot(page: Page) {
  /* Wait for images to load.
   * Checking the `complete` property
   * because `page.waitForLoadState('networkidle');`
   * doesn't seem to be reliable on Firefox & Webkit on Github Actions
   * (or is it because of linux?). */
  await expect
    .poll(async () => {
      const imgCompleteList = await page
        .locator('img')
        .evaluateAll((imgs) =>
          imgs.map((img) => (img as HTMLImageElement).complete)
        );
      return imgCompleteList.every((imgComplete) => imgComplete);
    })
    .toBe(true);

  /* Prefer using whole page screenshot for two reasons:
   * 1. it's the same resolution and the Playwright reporter diff will show slider.
   * 2. we make sure that there's no extra overlay in the DOM (e.g. dialog). */
  await expect(page).toHaveScreenshot();
}
