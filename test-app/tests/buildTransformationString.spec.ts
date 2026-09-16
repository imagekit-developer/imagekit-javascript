import { test, expect } from "./fixtures";

test.describe("buildTransformationString", () => {
  test("should return an empty string when no transformations are provided", async ({ page }) => {
    const result = await page.evaluate(() => (window as any).buildTransformationString([{}]));
    expect(result).toBe("");
  });

  test("should generate a transformation string for width only", async ({ page }) => {
    const result = await page.evaluate(() => (window as any).buildTransformationString([{ width: 300 }]));
    expect(result).toBe("w-300");
  });

  test("should generate a transformation string for multiple transformations", async ({ page }) => {
    const result = await page.evaluate(() =>
      (window as any).buildTransformationString([
        {
          overlay: {
            type: "text",
            text: "Hello",
          },
        },
      ]),
    );
    expect(result).toBe("l-text,i-Hello,l-end");
  });

  test("should generate a transformation string for density as a number", async ({ page }) => {
    const result = await page.evaluate(() => (window as any).buildTransformationString([{ density: 72 }]));
    expect(result).toBe("dn-72");
  });

  test("should generate a transformation string for density as an arithmetic expression", async ({ page }) => {
    const result = await page.evaluate(() => (window as any).buildTransformationString([{ density: "idn_mul_2" }]));
    expect(result).toBe("dn-idn_mul_2");
  });
});
