import { test, expect } from "./fixtures";

async function getResponsiveImageAttributes(page: import("@playwright/test").Page, opts: any) {
  return page.evaluate((o) => (window as any).getResponsiveImageAttributes(o), opts);
}

test.describe("getResponsiveImageAttributes", () => {
  test("bare minimum input", async ({ page }) => {
    const out = await getResponsiveImageAttributes(page, {
      src: "sample.jpg",
      urlEndpoint: "https://ik.imagekit.io/demo",
    });
    expect(out).toEqual({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max",
      srcSet:
        "https://ik.imagekit.io/demo/sample.jpg?tr=w-640,c-at_max 640w, https://ik.imagekit.io/demo/sample.jpg?tr=w-750,c-at_max 750w, https://ik.imagekit.io/demo/sample.jpg?tr=w-828,c-at_max 828w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1080,c-at_max 1080w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1200,c-at_max 1200w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1920,c-at_max 1920w, https://ik.imagekit.io/demo/sample.jpg?tr=w-2048,c-at_max 2048w, https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max 3840w",
      sizes: "100vw",
    });
  });

  test("sizes provided (100vw)", async ({ page }) => {
    const out = await getResponsiveImageAttributes(page, {
      src: "sample.jpg",
      urlEndpoint: "https://ik.imagekit.io/demo",
      sizes: "100vw",
    });
    expect(out).toEqual({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max",
      srcSet:
        "https://ik.imagekit.io/demo/sample.jpg?tr=w-640,c-at_max 640w, https://ik.imagekit.io/demo/sample.jpg?tr=w-750,c-at_max 750w, https://ik.imagekit.io/demo/sample.jpg?tr=w-828,c-at_max 828w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1080,c-at_max 1080w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1200,c-at_max 1200w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1920,c-at_max 1920w, https://ik.imagekit.io/demo/sample.jpg?tr=w-2048,c-at_max 2048w, https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max 3840w",
      sizes: "100vw",
    });
  });

  test("width only – DPR strategy", async ({ page }) => {
    const out = await getResponsiveImageAttributes(page, {
      src: "sample.jpg",
      urlEndpoint: "https://ik.imagekit.io/demo",
      width: 400,
    });
    expect(out).toEqual({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=w-828,c-at_max",
      srcSet:
        "https://ik.imagekit.io/demo/sample.jpg?tr=w-640,c-at_max 1x, https://ik.imagekit.io/demo/sample.jpg?tr=w-828,c-at_max 2x",
      width: 400,
    });
  });

  test("custom breakpoints", async ({ page }) => {
    const out = await getResponsiveImageAttributes(page, {
      src: "sample.jpg",
      urlEndpoint: "https://ik.imagekit.io/demo",
      deviceBreakpoints: [200, 400, 800],
      imageBreakpoints: [100],
    });
    expect(out).toEqual({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=w-800,c-at_max",
      srcSet:
        "https://ik.imagekit.io/demo/sample.jpg?tr=w-200,c-at_max 200w, https://ik.imagekit.io/demo/sample.jpg?tr=w-400,c-at_max 400w, https://ik.imagekit.io/demo/sample.jpg?tr=w-800,c-at_max 800w",
      sizes: "100vw",
    });
  });

  test("preserves caller transformations", async ({ page }) => {
    const out = await getResponsiveImageAttributes(page, {
      src: "sample.jpg",
      urlEndpoint: "https://ik.imagekit.io/demo",
      width: 500,
      transformation: [{ height: 300 }],
    });
    expect(out).toEqual({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=h-300:w-1080,c-at_max",
      srcSet:
        "https://ik.imagekit.io/demo/sample.jpg?tr=h-300:w-640,c-at_max 1x, https://ik.imagekit.io/demo/sample.jpg?tr=h-300:w-1080,c-at_max 2x",
      width: 500,
    });
  });

  test("both sizes and width passed", async ({ page }) => {
    const out = await getResponsiveImageAttributes(page, {
      src: "sample.jpg",
      urlEndpoint: "https://ik.imagekit.io/demo",
      sizes: "50vw",
      width: 600,
    });
    expect(out).toEqual({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max",
      srcSet:
        "https://ik.imagekit.io/demo/sample.jpg?tr=w-384,c-at_max 384w, https://ik.imagekit.io/demo/sample.jpg?tr=w-640,c-at_max 640w, https://ik.imagekit.io/demo/sample.jpg?tr=w-750,c-at_max 750w, https://ik.imagekit.io/demo/sample.jpg?tr=w-828,c-at_max 828w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1080,c-at_max 1080w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1200,c-at_max 1200w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1920,c-at_max 1920w, https://ik.imagekit.io/demo/sample.jpg?tr=w-2048,c-at_max 2048w, https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max 3840w",
      sizes: "50vw",
      width: 600,
    });
  });

  test("multiple transformations", async ({ page }) => {
    const out = await getResponsiveImageAttributes(page, {
      src: "sample.jpg",
      urlEndpoint: "https://ik.imagekit.io/demo",
      width: 450,
      transformation: [{ height: 300 }, { aiRemoveBackground: true }],
    });
    expect(out).toEqual({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=h-300:e-bgremove:w-1080,c-at_max",
      srcSet:
        "https://ik.imagekit.io/demo/sample.jpg?tr=h-300:e-bgremove:w-640,c-at_max 1x, https://ik.imagekit.io/demo/sample.jpg?tr=h-300:e-bgremove:w-1080,c-at_max 2x",
      width: 450,
    });
  });

  test("sizes causes breakpoint pruning (33vw path)", async ({ page }) => {
    const out = await getResponsiveImageAttributes(page, {
      src: "sample.jpg",
      urlEndpoint: "https://ik.imagekit.io/demo",
      sizes: "(min-width: 800px) 33vw, 100vw",
    });
    expect(out).toEqual({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max",
      srcSet:
        "https://ik.imagekit.io/demo/sample.jpg?tr=w-256,c-at_max 256w, https://ik.imagekit.io/demo/sample.jpg?tr=w-384,c-at_max 384w, https://ik.imagekit.io/demo/sample.jpg?tr=w-640,c-at_max 640w, https://ik.imagekit.io/demo/sample.jpg?tr=w-750,c-at_max 750w, https://ik.imagekit.io/demo/sample.jpg?tr=w-828,c-at_max 828w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1080,c-at_max 1080w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1200,c-at_max 1200w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1920,c-at_max 1920w, https://ik.imagekit.io/demo/sample.jpg?tr=w-2048,c-at_max 2048w, https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max 3840w",
      sizes: "(min-width: 800px) 33vw, 100vw",
    });
  });

  test("Using queryParameters and transformationPosition", async ({ page }) => {
    const out = await getResponsiveImageAttributes(page, {
      src: "sample.jpg",
      urlEndpoint: "https://ik.imagekit.io/demo",
      width: 450,
      transformation: [{ height: 300 }, { aiRemoveBackground: true }],
      queryParameters: { key: "value" },
      transformationPosition: "path",
    });
    expect(out).toEqual({
      src: "https://ik.imagekit.io/demo/tr:h-300:e-bgremove:w-1080,c-at_max/sample.jpg?key=value",
      srcSet:
        "https://ik.imagekit.io/demo/tr:h-300:e-bgremove:w-640,c-at_max/sample.jpg?key=value 1x, https://ik.imagekit.io/demo/tr:h-300:e-bgremove:w-1080,c-at_max/sample.jpg?key=value 2x",
      width: 450,
    });
  });

  test("fallback when no usable vw tokens", async ({ page }) => {
    const out = await getResponsiveImageAttributes(page, {
      src: "sample.jpg",
      urlEndpoint: "https://ik.imagekit.io/demo",
      sizes: "100%",
    });
    expect(out).toEqual({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max",
      srcSet:
        "https://ik.imagekit.io/demo/sample.jpg?tr=w-16,c-at_max 16w, https://ik.imagekit.io/demo/sample.jpg?tr=w-32,c-at_max 32w, https://ik.imagekit.io/demo/sample.jpg?tr=w-48,c-at_max 48w, https://ik.imagekit.io/demo/sample.jpg?tr=w-64,c-at_max 64w, https://ik.imagekit.io/demo/sample.jpg?tr=w-96,c-at_max 96w, https://ik.imagekit.io/demo/sample.jpg?tr=w-128,c-at_max 128w, https://ik.imagekit.io/demo/sample.jpg?tr=w-256,c-at_max 256w, https://ik.imagekit.io/demo/sample.jpg?tr=w-384,c-at_max 384w, https://ik.imagekit.io/demo/sample.jpg?tr=w-640,c-at_max 640w, https://ik.imagekit.io/demo/sample.jpg?tr=w-750,c-at_max 750w, https://ik.imagekit.io/demo/sample.jpg?tr=w-828,c-at_max 828w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1080,c-at_max 1080w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1200,c-at_max 1200w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1920,c-at_max 1920w, https://ik.imagekit.io/demo/sample.jpg?tr=w-2048,c-at_max 2048w, https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max 3840w",
      sizes: "100%",
    });
  });
});
