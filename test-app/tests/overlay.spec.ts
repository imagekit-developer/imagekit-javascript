import { test, expect } from "./fixtures";

async function buildSrc(page: import("@playwright/test").Page, opts: any): Promise<string> {
  return page.evaluate((o) => (window as any).buildSrc(o), opts);
}

test.describe("Overlay Transformation Test Cases", () => {
  test("Ignore invalid values if text is missing", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
      src: "/base-image.jpg",
      transformation: [{ overlay: { type: "text" } }],
    });
    expect(url).toBe("https://ik.imagekit.io/test_url_endpoint/base-image.jpg");
  });

  test("Ignore if type is missing", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
      src: "/base-image.jpg",
      transformation: [{ overlay: {} }],
    });
    expect(url).toBe("https://ik.imagekit.io/test_url_endpoint/base-image.jpg");
  });

  test("Ignore invalid values if input (image)", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
      src: "/base-image.jpg",
      transformation: [{ overlay: { type: "image" } }],
    });
    expect(url).toBe("https://ik.imagekit.io/test_url_endpoint/base-image.jpg");
  });

  test("Ignore invalid values if input (video)", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
      src: "/base-image.jpg",
      transformation: [{ overlay: { type: "video" } }],
    });
    expect(url).toBe("https://ik.imagekit.io/test_url_endpoint/base-image.jpg");
  });

  test("Ignore invalid values if input (subtitle)", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
      src: "/base-image.jpg",
      transformation: [{ overlay: { type: "subtitle" } }],
    });
    expect(url).toBe("https://ik.imagekit.io/test_url_endpoint/base-image.jpg");
  });

  test("Ignore invalid values if color is missing (solidColor)", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
      src: "/base-image.jpg",
      transformation: [{ overlay: { type: "solidColor" } }],
    });
    expect(url).toBe("https://ik.imagekit.io/test_url_endpoint/base-image.jpg");
  });

  test("Text overlay generates correct URL with encoded overlay text", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
      src: "/base-image.jpg",
      transformation: [{ overlay: { type: "text", text: "Minimal Text" } }],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/test_url_endpoint/tr:l-text,i-Minimal%20Text,l-end/base-image.jpg",
    );
  });

  test("Image overlay generates correct URL with input logo.png", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
      src: "/base-image.jpg",
      transformation: [{ overlay: { type: "image", input: "logo.png" } }],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/test_url_endpoint/tr:l-image,i-logo.png,l-end/base-image.jpg",
    );
  });

  test("Video overlay generates correct URL with input play-pause-loop.mp4", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
      src: "/base-video.mp4",
      transformation: [{ overlay: { type: "video", input: "play-pause-loop.mp4" } }],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/test_url_endpoint/tr:l-video,i-play-pause-loop.mp4,l-end/base-video.mp4",
    );
  });

  test("Subtitle overlay generates correct URL with input subtitle.srt", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
      src: "/base-video.mp4",
      transformation: [{ overlay: { type: "subtitle", input: "subtitle.srt" } }],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/test_url_endpoint/tr:l-subtitles,i-subtitle.srt,l-end/base-video.mp4",
    );
  });

  test("Solid color overlay generates correct URL with background color FF0000", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
      src: "/base-image.jpg",
      transformation: [{ overlay: { type: "solidColor", color: "FF0000" } }],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/test_url_endpoint/tr:l-image,i-ik_canvas,bg-FF0000,l-end/base-image.jpg",
    );
  });

  test("Combined overlay transformations generate correct URL including nested overlays", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
      src: "/base-image.jpg",
      transformation: [
        {
          overlay: {
            type: "text",
            text: "Every thing",
            position: { x: "10", y: "20", focus: "center" },
            timing: { start: 5, duration: "10", end: 15 },
            transformation: [
              {
                width: "bw_mul_0.5",
                fontSize: 20,
                fontFamily: "Arial",
                fontColor: "0000ff",
                innerAlignment: "left",
                padding: 5,
                alpha: 7,
                typography: "b",
                background: "red",
                radius: 10,
                rotation: "N45",
                flip: "h",
                lineHeight: 20,
              },
            ],
          },
        },
        {
          overlay: {
            type: "image",
            input: "logo.png",
            position: { x: "10", y: "20", focus: "center" },
            timing: { start: 5, duration: "10", end: 15 },
            transformation: [
              {
                width: "bw_mul_0.5",
                height: "bh_mul_0.5",
                rotation: "N45",
                flip: "h",
                overlay: { type: "text", text: "Nested text overlay" },
              },
            ],
          },
        },
        {
          overlay: {
            type: "video",
            input: "play-pause-loop.mp4",
            position: { x: "10", y: "20", focus: "center" },
            timing: { start: 5, duration: "10", end: 15 },
            transformations: [
              { width: "bw_mul_0.5", height: "bh_mul_0.5", rotation: "N45", flip: "h" },
            ],
          },
        },
        {
          overlay: {
            type: "subtitle",
            input: "subtitle.srt",
            position: { x: "10", y: "20", focus: "center" },
            timing: { start: 5, duration: "10", end: 15 },
            transformations: [
              { width: "bw_mul_0.5", height: "bh_mul_0.5", rotation: "N45", flip: "h" },
            ],
          },
        },
        {
          overlay: {
            type: "solidColor",
            color: "FF0000",
            position: { x: "10", y: "20", focus: "center" },
            timing: { start: 5, duration: "10", end: 15 },
            transformation: [
              { width: "bw_mul_0.5", height: "bh_mul_0.5", rotation: "N45", flip: "h" },
            ],
          },
        },
      ],
    });

    expect(url).toBe(
      "https://ik.imagekit.io/test_url_endpoint/tr:l-text,i-Every%20thing,lx-10,ly-20,lfo-center,lso-5,leo-15,ldu-10,w-bw_mul_0.5,fs-20,ff-Arial,co-0000ff,ia-left,pa-5,al-7,tg-b,bg-red,r-10,rt-N45,fl-h,lh-20,l-end:l-image,i-logo.png,lx-10,ly-20,lfo-center,lso-5,leo-15,ldu-10,w-bw_mul_0.5,h-bh_mul_0.5,rt-N45,fl-h,l-text,i-Nested%20text%20overlay,l-end,l-end:l-video,i-play-pause-loop.mp4,lx-10,ly-20,lfo-center,lso-5,leo-15,ldu-10,l-end:l-subtitles,i-subtitle.srt,lx-10,ly-20,lfo-center,lso-5,leo-15,ldu-10,l-end:l-image,i-ik_canvas,bg-FF0000,lx-10,ly-20,lfo-center,lso-5,leo-15,ldu-10,w-bw_mul_0.5,h-bh_mul_0.5,rt-N45,fl-h,l-end/base-image.jpg",
    );
  });
});

test.describe("Overlay encoding test cases", () => {
  test("Nested simple path, should use i instead of ie, handle slash properly", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/demo",
      src: "/medium_cafe_B1iTdD0C.jpg",
      transformation: [{ overlay: { type: "image", input: "/customer_logo/nykaa.png" } }],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/demo/tr:l-image,i-customer_logo@@nykaa.png,l-end/medium_cafe_B1iTdD0C.jpg",
    );
  });

  test("Nested non-simple path, should use ie instead of i", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/demo",
      src: "/medium_cafe_B1iTdD0C.jpg",
      transformation: [{ overlay: { type: "image", input: "/customer_logo/Ñykaa.png" } }],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/demo/tr:l-image,ie-Y3VzdG9tZXJfbG9nby9OzIN5a2FhLnBuZw%3D%3D,l-end/medium_cafe_B1iTdD0C.jpg",
    );
  });

  test("Simple text overlay, should use i instead of ie", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/demo",
      src: "/medium_cafe_B1iTdD0C.jpg",
      transformation: [{ overlay: { type: "text", text: "Manu" } }],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/demo/tr:l-text,i-Manu,l-end/medium_cafe_B1iTdD0C.jpg",
    );
  });

  test("Simple text overlay with spaces and other safe characters, should use i instead of ie", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/demo",
      src: "/medium_cafe_B1iTdD0C.jpg",
      transformation: [{ overlay: { type: "text", text: "alnum123-._ " } }],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/demo/tr:l-text,i-alnum123-._%20,l-end/medium_cafe_B1iTdD0C.jpg",
    );
  });

  test("Non simple text overlay, should use ie instead of i", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/demo",
      src: "/medium_cafe_B1iTdD0C.jpg",
      transformation: [{ overlay: { type: "text", text: "Let's use ©, ®, ™, etc" } }],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/demo/tr:l-text,ie-TGV0J3MgdXNlIMKpLCDCriwg4oSiLCBldGM%3D,l-end/medium_cafe_B1iTdD0C.jpg",
    );
  });

  test("Text overlay with explicit plain encoding", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/demo",
      src: "/sample.jpg",
      transformation: [{ overlay: { type: "text", text: "HelloWorld", encoding: "plain" } }],
    });
    expect(url).toBe("https://ik.imagekit.io/demo/tr:l-text,i-HelloWorld,l-end/sample.jpg");
  });

  test("Text overlay with explicit base64 encoding", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/demo",
      src: "/sample.jpg",
      transformation: [{ overlay: { type: "text", text: "HelloWorld", encoding: "base64" } }],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/demo/tr:l-text,ie-SGVsbG9Xb3JsZA%3D%3D,l-end/sample.jpg",
    );
  });

  test("Image overlay with explicit plain encoding", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/demo",
      src: "/sample.jpg",
      transformation: [{ overlay: { type: "image", input: "/customer/logo.png", encoding: "plain" } }],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/demo/tr:l-image,i-customer@@logo.png,l-end/sample.jpg",
    );
  });

  test("Image overlay with explicit base64 encoding", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/demo",
      src: "/sample.jpg",
      transformation: [{ overlay: { type: "image", input: "/customer/logo.png", encoding: "base64" } }],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/demo/tr:l-image,ie-Y3VzdG9tZXIvbG9nby5wbmc%3D,l-end/sample.jpg",
    );
  });

  test("Video overlay with explicit base64 encoding", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/demo",
      src: "/sample.mp4",
      transformation: [{ overlay: { type: "video", input: "/path/to/video.mp4", encoding: "base64" } }],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/demo/tr:l-video,ie-cGF0aC90by92aWRlby5tcDQ%3D,l-end/sample.mp4",
    );
  });

  test("Subtitle overlay with explicit plain encoding", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/demo",
      src: "/sample.mp4",
      transformation: [{ overlay: { type: "subtitle", input: "/sub.srt", encoding: "plain" } }],
    });
    expect(url).toBe("https://ik.imagekit.io/demo/tr:l-subtitles,i-sub.srt,l-end/sample.mp4");
  });

  test("Subtitle overlay with explicit base64 encoding", async ({ page }) => {
    const url = await buildSrc(page, {
      transformationPosition: "path",
      urlEndpoint: "https://ik.imagekit.io/demo",
      src: "/sample.mp4",
      transformation: [{ overlay: { type: "subtitle", input: "sub.srt", encoding: "base64" } }],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/demo/tr:l-subtitles,ie-c3ViLnNydA%3D%3D,l-end/sample.mp4",
    );
  });

  test("Avoid double encoding when transformation string is in query params", async ({ page }) => {
    const url = await buildSrc(page, {
      urlEndpoint: "https://ik.imagekit.io/demo",
      src: "/sample.jpg",
      transformation: [{ overlay: { type: "text", text: "Minimal Text" } }],
      transformationPosition: "query",
    });
    expect(url).toBe("https://ik.imagekit.io/demo/sample.jpg?tr=l-text,i-Minimal%20Text,l-end");
  });

  test.describe("Layer Mode Tests", () => {
    test("should generate correct URL with multiply layer mode", async ({ page }) => {
      const url = await buildSrc(page, {
        transformationPosition: "path",
        urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
        src: "/base-image.jpg",
        transformation: [{ overlay: { type: "image", input: "overlay-image.jpg", layerMode: "multiply" } }],
      });
      expect(url).toBe(
        "https://ik.imagekit.io/test_url_endpoint/tr:l-image,i-overlay-image.jpg,lm-multiply,l-end/base-image.jpg",
      );
    });

    test("should generate correct URL with cutter layer mode", async ({ page }) => {
      const url = await buildSrc(page, {
        transformationPosition: "path",
        urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
        src: "/base-image.jpg",
        transformation: [{ overlay: { type: "image", input: "overlay-image.jpg", layerMode: "cutter" } }],
      });
      expect(url).toBe(
        "https://ik.imagekit.io/test_url_endpoint/tr:l-image,i-overlay-image.jpg,lm-cutter,l-end/base-image.jpg",
      );
    });

    test("should generate correct URL with cutout layer mode", async ({ page }) => {
      const url = await buildSrc(page, {
        transformationPosition: "path",
        urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
        src: "/base-image.jpg",
        transformation: [{ overlay: { type: "image", input: "overlay-image.jpg", layerMode: "cutout" } }],
      });
      expect(url).toBe(
        "https://ik.imagekit.io/test_url_endpoint/tr:l-image,i-overlay-image.jpg,lm-cutout,l-end/base-image.jpg",
      );
    });

    test("should generate correct URL with displace layer mode", async ({ page }) => {
      const url = await buildSrc(page, {
        transformationPosition: "path",
        urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
        src: "/base-image.jpg",
        transformation: [
          { overlay: { type: "image", input: "overlay-image.jpg", layerMode: "displace", position: { x: 10, y: 10 } } },
        ],
      });
      expect(url).toBe(
        "https://ik.imagekit.io/test_url_endpoint/tr:l-image,i-overlay-image.jpg,lm-displace,lx-10,ly-10,l-end/base-image.jpg",
      );
    });

    test("should generate correct URL with xCenter, yCenter and anchorPoint", async ({ page }) => {
      const url = await buildSrc(page, {
        transformationPosition: "path",
        urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
        src: "/base-image.jpg",
        transformation: [
          { overlay: { type: "image", input: "overlay-image.jpg", position: { xCenter: 100, yCenter: 50, anchorPoint: "top_left" } } },
        ],
      });
      expect(url).toBe(
        "https://ik.imagekit.io/test_url_endpoint/tr:l-image,i-overlay-image.jpg,lxc-100,lyc-50,lap-top_left,l-end/base-image.jpg",
      );
    });
  });

  test("should encode Hindi (non-ASCII) text overlay and base path", async ({ page }) => {
    const url = await buildSrc(page, {
      urlEndpoint: "https://ik.imagekit.io/demo/",
      src: "sdk-testing-files/हिन्दी.png",
      transformation: [
        {
          overlay: {
            type: "text",
            text: "हिन्दी",
            transformation: [
              {
                fontColor: "red",
                fontSize: "32",
                fontFamily: "sdk-testing-files/Poppins-Regular_Q15GrYWmL.ttf",
              },
            ],
          },
        },
      ],
    });
    expect(url).toBe(
      "https://ik.imagekit.io/demo/sdk-testing-files/%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80.png?tr=l-text,ie-4KS54KS%2F4KSo4KWN4KSm4KWA,co-red,fs-32,ff-sdk-testing-files@@Poppins-Regular_Q15GrYWmL.ttf,l-end",
    );
  });
});
