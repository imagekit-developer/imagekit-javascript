import { test as base, expect } from "@playwright/test";

/**
 * Shared fixture for browser-based SDK tests.
 *
 * Each test runs the real built SDK bundle inside Chromium. The SDK functions
 * are exposed on `window` by /test-app/index.html, so tests call them via
 * `page.evaluate` and assert on the returned values.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto("/test-app/index.html");
    await page.waitForFunction(
      () =>
        typeof (window as any).buildSrc === "function" &&
        typeof (window as any).buildTransformationString === "function" &&
        typeof (window as any).getResponsiveImageAttributes === "function",
    );
    await use(page);
  },
});

export { expect };

