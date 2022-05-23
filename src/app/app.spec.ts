import { expect, test } from "@playwright/test";

test.describe("pages", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  test("should display dashboard", async ({ page }) => {
    const content = page.locator("main");
    await expect(content).toHaveText("Hello Dashboard");
  });

  test("should navigate to customer", async ({ page }) => {
    await page.click("text=Customer");
    const content = page.locator("main");
    await expect(content).toHaveText("Hello Customer");
  });

  test("should navigate to admin", async ({ page }) => {
    await page.click("text=Admin");
    const content = page.locator("main");
    await expect(content).toHaveText("Hello Admin");
  });
});
