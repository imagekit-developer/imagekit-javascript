import { test, expect } from "./fixtures";
import type { Page, Route } from "@playwright/test";

/**
 * Upload tests run the real built SDK inside Chromium. Instead of sinon's fake
 * XMLHttpRequest, the actual upload request is captured and answered with
 * Playwright network interception (`page.route`). The multipart body is parsed
 * back into its FormData fields so we can assert exactly what the SDK sent.
 */

const UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

const uploadSuccessResponseObj = {
  fileId: "598821f949c0a938d57563bd",
  name: "file1.jpg",
  url: "https://ik.imagekit.io/your_imagekit_id/images/products/file1.jpg",
  thumbnailUrl:
    "https://ik.imagekit.io/your_imagekit_id/tr:n-media_library_thumbnail/images/products/file1.jpg",
  height: 300,
  width: 200,
  size: 83622,
  filePath: "/images/products/file1.jpg",
  tags: ["t-shirt", "round-neck", "sale2019"],
  isPrivateFile: false,
  customCoordinates: null,
  fileType: "image",
  AITags: [{ name: "Face", confidence: 99.95, source: "aws-auto-tagging" }],
  extensionStatus: { "aws-auto-tagging": "success" },
};

const securityParameters = {
  signature: "test_signature",
  expire: 123,
  token: "test_token",
  publicKey: "test_public_key",
};

/** Parse a multipart/form-data body into its text fields. */
function parseMultipart(
  buffer: Buffer | null,
  contentType: string,
): Record<string, string> {
  const fields: Record<string, string> = {};
  if (!buffer) return fields;
  const boundaryMatch = /boundary=(.+)$/.exec(contentType);
  if (!boundaryMatch) return fields;
  const boundary = "--" + boundaryMatch[1];
  // latin1 keeps a 1:1 byte mapping so byte lengths stay accurate.
  const raw = buffer.toString("latin1");
  for (const part of raw.split(boundary)) {
    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;
    const header = part.slice(0, headerEnd);
    const nameMatch = /name="([^"]*)"/.exec(header);
    if (!nameMatch) continue;
    fields[nameMatch[1]] = part.slice(headerEnd + 4).replace(/\r\n$/, "");
  }
  return fields;
}

type MockOptions = {
  status?: number;
  headers?: Record<string, string>;
  body?: string;
  /** Reject the request at the network layer (triggers xhr.onerror). */
  networkError?: boolean;
  /** Never answer the request (used for client-side abort tests). */
  hang?: boolean;
};

type Mock = {
  fields: () => Record<string, string>;
  count: () => number;
};

/** Install a route that captures the upload payload and returns a mock response. */
async function mockUpload(page: Page, options: MockOptions = {}): Promise<Mock> {
  let captured: Record<string, string> = {};
  let count = 0;
  await page.route(UPLOAD_URL, async (route: Route) => {
    count++;
    const request = route.request();
    captured = parseMultipart(
      request.postDataBuffer(),
      request.headers()["content-type"] || "",
    );
    if (options.hang) return; // leave the request pending for abort tests
    if (options.networkError) {
      await route.abort("failed");
      return;
    }
    await route.fulfill({
      status: options.status ?? 200,
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body ?? JSON.stringify(uploadSuccessResponseObj),
    });
  });
  return { fields: () => captured, count: () => count };
}

type UploadResult =
  | { ok: true; response: any }
  | {
      ok: false;
      error: {
        name: string;
        message: string;
        isAbort: boolean;
        isInvalid: boolean;
        isServer: boolean;
        isNetwork: boolean;
        isSyntax: boolean;
      };
    };

/** Call the SDK `upload` in the browser and return a serializable result. */
async function runUpload(page: Page, opts: any): Promise<UploadResult> {
  return page.evaluate(async (o) => {
    const w = window as any;
    try {
      const response = await w.upload(o);
      return { ok: true as const, response };
    } catch (e: any) {
      return {
        ok: false as const,
        error: {
          name: e?.name,
          message: e?.message,
          isAbort: e instanceof w.ImageKitAbortError,
          isInvalid: e instanceof w.ImageKitInvalidRequestError,
          isServer: e instanceof w.ImageKitServerError,
          isNetwork: e instanceof w.ImageKitUploadNetworkError,
          isSyntax: e instanceof SyntaxError,
        },
      };
    }
  }, opts);
}

test.describe("File upload", () => {
  test("Invalid options", async ({ page }) => {
    const result = await runUpload(page, undefined);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isInvalid).toBe(true);
    expect(result.error.message).toBe("Invalid options provided for upload");
  });

  test("Missing fileName", async ({ page }) => {
    const result = await runUpload(page, {
      ...securityParameters,
      file: "https://ik.imagekit.io/remote-url.jpg",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isInvalid).toBe(true);
    expect(result.error.message).toBe("Missing fileName parameter for upload");
  });

  test("Missing file", async ({ page }) => {
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isInvalid).toBe(true);
    expect(result.error.message).toBe("Missing file parameter for upload");
  });

  test("Missing token", async ({ page }) => {
    const result = await runUpload(page, {
      fileName: "test_file_name",
      file: "test_file",
      signature: "test_signature",
      expire: 123,
      publicKey: "test_public_key",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isInvalid).toBe(true);
    expect(result.error.message).toBe(
      "Missing token for upload. The SDK expects token, signature and expire for authentication.",
    );
  });

  test("Missing signature", async ({ page }) => {
    const result = await runUpload(page, {
      fileName: "test_file_name",
      file: "test_file",
      token: "test_token",
      expire: 123,
      publicKey: "test_public_key",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isInvalid).toBe(true);
    expect(result.error.message).toBe(
      "Missing signature for upload. The SDK expects token, signature and expire for authentication.",
    );
  });

  test("Missing expire", async ({ page }) => {
    const result = await runUpload(page, {
      fileName: "test_file_name",
      file: "test_file",
      token: "test_token",
      signature: "test_signature",
      publicKey: "test_public_key",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isInvalid).toBe(true);
    expect(result.error.message).toBe(
      "Missing expire for upload. The SDK expects token, signature and expire for authentication.",
    );
  });

  test("Missing public key", async ({ page }) => {
    const result = await runUpload(page, {
      fileName: "test_file_name",
      file: "test_file",
      token: "test_token",
      signature: "test_signature",
      expire: 123,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isInvalid).toBe(true);
    expect(result.error.message).toBe("Missing public key for upload");
  });

  test("Upload endpoint network error handling", async ({ page }) => {
    await mockUpload(page, { networkError: true });
    const result = await runUpload(page, {
      fileName: "test_file_name",
      file: "test_file",
      token: "test_token",
      signature: "test_signature",
      expire: 123,
      publicKey: "test_public_key",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isNetwork).toBe(true);
    expect(result.error.message).toBe(
      "Request to ImageKit upload endpoint failed due to network error",
    );
  });

  test("Boolean handling", async ({ page }) => {
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      tags: "test_tag1,test_tag2",
      customCoordinates: "10, 10, 100, 100",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      isPrivateFile: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(mock.count()).toBe(1);

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.token).toBe("test_token");
    expect(f.expire).toBe("123");
    expect(f.signature).toBe("test_signature");
    expect(f.tags).toBe("test_tag1,test_tag2");
    expect(f.customCoordinates).toBe("10, 10, 100, 100");
    expect(f.responseFields).toBe("tags, customCoordinates, isPrivateFile, metadata");
    expect(f.useUniqueFileName).toBe("false");
    expect(f.isPrivateFile).toBe("true");
    expect(f.publicKey).toBe("test_public_key");
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("Tag array handling", async ({ page }) => {
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      tags: ["test_tag1", "test_tag2"],
      useUniqueFileName: false,
      isPrivateFile: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(mock.count()).toBe(1);

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.token).toBe("test_token");
    expect(f.expire).toBe("123");
    expect(f.signature).toBe("test_signature");
    expect(f.tags).toBe("test_tag1,test_tag2");
    expect(f.useUniqueFileName).toBe("false");
    expect(f.isPrivateFile).toBe("true");
    expect(f.publicKey).toBe("test_public_key");
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("Missing useUniqueFileName", async ({ page }) => {
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      tags: ["test_tag1", "test_tag2"],
      isPrivateFile: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.token).toBe("test_token");
    expect(f.expire).toBe("123");
    expect(f.signature).toBe("test_signature");
    expect(f.tags).toBe("test_tag1,test_tag2");
    expect(f.isPrivateFile).toBe("true");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.useUniqueFileName).toBeUndefined();
    expect(f.customCoordinates).toBeUndefined();
    expect(f.responseFields).toBeUndefined();
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("Missing isPrivateFile", async ({ page }) => {
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      tags: ["test_tag1", "test_tag2"],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.token).toBe("test_token");
    expect(f.expire).toBe("123");
    expect(f.signature).toBe("test_signature");
    expect(f.tags).toBe("test_tag1,test_tag2");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.isPrivateFile).toBeUndefined();
    expect(f.useUniqueFileName).toBeUndefined();
    expect(f.customCoordinates).toBeUndefined();
    expect(f.responseFields).toBeUndefined();
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("With extensions parameter", async ({ page }) => {
    const extensions = [{ name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }];
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      tags: "test_tag1,test_tag2",
      customCoordinates: "10, 10, 100, 100",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      isPrivateFile: true,
      extensions,
      webhookUrl: "https://your-domain/?appId=some-id",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.token).toBe("test_token");
    expect(f.expire).toBe("123");
    expect(f.signature).toBe("test_signature");
    expect(f.tags).toBe("test_tag1,test_tag2");
    expect(f.customCoordinates).toBe("10, 10, 100, 100");
    expect(f.responseFields).toBe("tags, customCoordinates, isPrivateFile, metadata");
    expect(f.useUniqueFileName).toBe("false");
    expect(f.isPrivateFile).toBe("true");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.extensions).toBe(JSON.stringify(extensions));
    expect(f.webhookUrl).toBe("https://your-domain/?appId=some-id");
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("Bare minimum request", async ({ page }) => {
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      tags: undefined,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.token).toBe("test_token");
    expect(f.expire).toBe("123");
    expect(f.signature).toBe("test_signature");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.tags).toBeUndefined();
    expect(f.isPrivateFile).toBeUndefined();
    expect(f.useUniqueFileName).toBeUndefined();
    expect(f.customCoordinates).toBeUndefined();
    expect(f.responseFields).toBeUndefined();
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("Bare minimum request: Blob", async ({ page }) => {
    const mock = await mockUpload(page);
    const result = await page.evaluate(async (sec) => {
      const w = window as any;
      const file = new Blob(["test_buffer"]);
      try {
        const response = await w.upload({
          ...sec,
          fileName: "test_file_name",
          file,
        });
        return { ok: true as const, response };
      } catch (e: any) {
        return { ok: false as const, message: e?.message };
      }
    }, securityParameters);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    // Blob content is sent as the raw bytes of "test_buffer" (11 bytes).
    expect(Buffer.byteLength(f.file, "latin1")).toBe("test_buffer".length);
    expect(f.fileName).toBe("test_file_name");
    expect(f.token).toBe("test_token");
    expect(f.expire).toBe("123");
    expect(f.signature).toBe("test_signature");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.tags).toBeUndefined();
    expect(f.isPrivateFile).toBeUndefined();
    expect(f.useUniqueFileName).toBeUndefined();
    expect(f.customCoordinates).toBeUndefined();
    expect(f.responseFields).toBeUndefined();
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("Error during upload", async ({ page }) => {
    await mockUpload(page, {
      status: 401,
      body: JSON.stringify({
        help: "For support kindly contact us at support@imagekit.io .",
        message: "Your account cannot be authenticated.",
      }),
    });
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isInvalid).toBe(true);
    expect(result.error.message).toBe("Your account cannot be authenticated.");
  });

  test("Error during upload non 2xx with bad body", async ({ page }) => {
    await mockUpload(page, { status: 500, body: "sdf" });
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isServer).toBe(true);
    expect(result.error.message).toBe(
      "Server error occurred while uploading the file. This is rare and usually temporary.",
    );
  });

  test("Error during upload 2xx with bad body", async ({ page }) => {
    await mockUpload(page, { status: 200, body: "sdf" });
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isSyntax).toBe(true);
  });

  test("Upload via URL", async ({ page }) => {
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "https://ik.imagekit.io/remote-url.jpg",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    expect(f.file).toBe("https://ik.imagekit.io/remote-url.jpg");
    expect(f.fileName).toBe("test_file_name");
    expect(f.token).toBe("test_token");
    expect(f.expire).toBe("123");
    expect(f.signature).toBe("test_signature");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.tags).toBeUndefined();
    expect(f.isPrivateFile).toBeUndefined();
    expect(f.useUniqueFileName).toBeUndefined();
    expect(f.customCoordinates).toBeUndefined();
    expect(f.responseFields).toBeUndefined();
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("Overriding public key", async ({ page }) => {
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "https://ik.imagekit.io/remote-url.jpg",
      publicKey: "override_public_key",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    expect(f.file).toBe("https://ik.imagekit.io/remote-url.jpg");
    expect(f.fileName).toBe("test_file_name");
    expect(f.token).toBe("test_token");
    expect(f.expire).toBe("123");
    expect(f.signature).toBe("test_signature");
    expect(f.publicKey).toBe("override_public_key");
    expect(f.tags).toBeUndefined();
    expect(f.isPrivateFile).toBeUndefined();
    expect(f.useUniqueFileName).toBeUndefined();
    expect(f.customCoordinates).toBeUndefined();
    expect(f.responseFields).toBeUndefined();
    expect(f.extensions).toBeUndefined();
    expect(f.customMetadata).toBeUndefined();
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("With overwrite parameters", async ({ page }) => {
    const extensions = [{ name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }];
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      tags: "test_tag1,test_tag2",
      customCoordinates: "10, 10, 100, 100",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      isPrivateFile: true,
      extensions,
      overwriteFile: false,
      overwriteAITags: false,
      overwriteTags: false,
      overwriteCustomMetadata: false,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.token).toBe("test_token");
    expect(f.expire).toBe("123");
    expect(f.signature).toBe("test_signature");
    expect(f.tags).toBe("test_tag1,test_tag2");
    expect(f.customCoordinates).toBe("10, 10, 100, 100");
    expect(f.responseFields).toBe("tags, customCoordinates, isPrivateFile, metadata");
    expect(f.useUniqueFileName).toBe("false");
    expect(f.isPrivateFile).toBe("true");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.extensions).toBe(JSON.stringify(extensions));
    expect(f.overwriteFile).toBe("false");
    expect(f.overwriteAITags).toBe("false");
    expect(f.overwriteTags).toBe("false");
    expect(f.overwriteCustomMetadata).toBe("false");
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("With customMetadata", async ({ page }) => {
    const extensions = [{ name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }];
    const customMetadata = { brand: "Nike", color: "red" };
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      tags: "test_tag1,test_tag2",
      customCoordinates: "10, 10, 100, 100",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      isPrivateFile: true,
      extensions,
      overwriteFile: false,
      overwriteAITags: false,
      overwriteTags: false,
      overwriteCustomMetadata: false,
      customMetadata,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.token).toBe("test_token");
    expect(f.expire).toBe("123");
    expect(f.signature).toBe("test_signature");
    expect(f.tags).toBe("test_tag1,test_tag2");
    expect(f.customCoordinates).toBe("10, 10, 100, 100");
    expect(f.responseFields).toBe("tags, customCoordinates, isPrivateFile, metadata");
    expect(f.useUniqueFileName).toBe("false");
    expect(f.isPrivateFile).toBe("true");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.extensions).toBe(JSON.stringify(extensions));
    expect(f.overwriteFile).toBe("false");
    expect(f.overwriteAITags).toBe("false");
    expect(f.overwriteTags).toBe("false");
    expect(f.overwriteCustomMetadata).toBe("false");
    expect(f.customMetadata).toBe(JSON.stringify(customMetadata));
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("Array type fields", async ({ page }) => {
    const extensions = [{ name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }];
    const customMetadata = { brand: "Nike", color: "red" };
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      tags: ["test_tag1", "test_tag2"],
      customCoordinates: "10, 10, 100, 100",
      responseFields: ["tags", "customCoordinates", "isPrivateFile", "metadata"],
      useUniqueFileName: false,
      isPrivateFile: true,
      extensions,
      overwriteFile: false,
      overwriteAITags: false,
      overwriteTags: false,
      overwriteCustomMetadata: false,
      customMetadata,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.token).toBe("test_token");
    expect(f.expire).toBe("123");
    expect(f.signature).toBe("test_signature");
    expect(f.tags).toBe("test_tag1,test_tag2");
    expect(f.customCoordinates).toBe("10, 10, 100, 100");
    expect(f.responseFields).toBe("tags,customCoordinates,isPrivateFile,metadata");
    expect(f.useUniqueFileName).toBe("false");
    expect(f.isPrivateFile).toBe("true");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.extensions).toBe(JSON.stringify(extensions));
    expect(f.overwriteFile).toBe("false");
    expect(f.overwriteAITags).toBe("false");
    expect(f.overwriteTags).toBe("false");
    expect(f.overwriteCustomMetadata).toBe("false");
    expect(f.customMetadata).toBe(JSON.stringify(customMetadata));
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("check custom XHR object is used", async ({ page }) => {
    const extensions = [{ name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }];
    const mock = await mockUpload(page);
    const out = await page.evaluate(async (opts) => {
      const w = window as any;
      const xhr = new XMLHttpRequest();
      const fun = function () {
        return "hello from function";
      };
      xhr.onprogress = fun as any;
      try {
        const response = await w.upload({ ...opts, xhr });
        return {
          ok: true as const,
          status: xhr.status,
          onprogressPreserved: xhr.onprogress === (fun as any),
          response,
        };
      } catch (e: any) {
        return { ok: false as const, message: e?.message };
      }
    }, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      tags: "test_tag1,test_tag2",
      customCoordinates: "10, 10, 100, 100",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      isPrivateFile: true,
      extensions,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    // The provided xhr instance carried out the request and kept its handler.
    expect(out.status).toBe(200);
    expect(out.onprogressPreserved).toBe(true);

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.token).toBe("test_token");
    expect(f.expire).toBe("123");
    expect(f.signature).toBe("test_signature");
    expect(f.tags).toBe("test_tag1,test_tag2");
    expect(f.customCoordinates).toBe("10, 10, 100, 100");
    expect(f.responseFields).toBe("tags, customCoordinates, isPrivateFile, metadata");
    expect(f.useUniqueFileName).toBe("false");
    expect(f.isPrivateFile).toBe("true");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.extensions).toBe(JSON.stringify(extensions));
    expect(out.response).toEqual(uploadSuccessResponseObj);
  });

  test("Upload using promise - success", async ({ page }) => {
    const extensions = [{ name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }];
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      tags: "test_tag1,test_tag2",
      customCoordinates: "10, 10, 100, 100",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      isPrivateFile: true,
      extensions,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.token).toBe("test_token");
    expect(f.expire).toBe("123");
    expect(f.signature).toBe("test_signature");
    expect(f.tags).toBe("test_tag1,test_tag2");
    expect(f.customCoordinates).toBe("10, 10, 100, 100");
    expect(f.responseFields).toBe("tags, customCoordinates, isPrivateFile, metadata");
    expect(f.useUniqueFileName).toBe("false");
    expect(f.isPrivateFile).toBe("true");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.extensions).toBe(JSON.stringify(extensions));
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("Server 5xx error with proper json and message", async ({ page }) => {
    const extensions = [{ name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }];
    await mockUpload(page, {
      status: 500,
      body: JSON.stringify({
        help: "For support kindly contact us at support@imagekit.io .",
        message: "Something went wrong",
      }),
    });
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      tags: "test_tag1,test_tag2",
      customCoordinates: "10, 10, 100, 100",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      isPrivateFile: true,
      extensions,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isServer).toBe(true);
    expect(result.error.message).toBe("Something went wrong");
  });

  test("Custom xhr promise", async ({ page }) => {
    const extensions = [{ name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }];
    const mock = await mockUpload(page);
    const out = await page.evaluate(async (opts) => {
      const w = window as any;
      const xhr = new XMLHttpRequest();
      const fun = function () {
        return "hello from function";
      };
      xhr.onprogress = fun as any;
      try {
        const response = await w.upload({ ...opts, xhr });
        return {
          ok: true as const,
          status: xhr.status,
          onprogressPreserved: xhr.onprogress === (fun as any),
          response,
        };
      } catch (e: any) {
        return { ok: false as const, message: e?.message };
      }
    }, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      tags: "test_tag1,test_tag2",
      customCoordinates: "10, 10, 100, 100",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      isPrivateFile: true,
      extensions,
    });
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.status).toBe(200);
    expect(out.onprogressPreserved).toBe(true);

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.token).toBe("test_token");
    expect(f.expire).toBe("123");
    expect(f.signature).toBe("test_signature");
    expect(f.tags).toBe("test_tag1,test_tag2");
    expect(f.customCoordinates).toBe("10, 10, 100, 100");
    expect(f.responseFields).toBe("tags, customCoordinates, isPrivateFile, metadata");
    expect(f.useUniqueFileName).toBe("false");
    expect(f.isPrivateFile).toBe("true");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.extensions).toBe(JSON.stringify(extensions));
    expect(out.response).toEqual(uploadSuccessResponseObj);
  });

  test("$ResponseMetadata assertions using promise", async ({ page }) => {
    const extensions = [{ name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }];
    await mockUpload(page, {
      status: 200,
      headers: {
        "content-type": "application/json",
        "x-request-id": "sdfsdfsdfdsf",
        // Expose the custom header so the cross-origin XHR can read it back.
        "access-control-expose-headers": "x-request-id",
      },
      body: JSON.stringify(uploadSuccessResponseObj),
    });
    const meta = await page.evaluate(async (opts) => {
      const w = window as any;
      const response = await w.upload(opts);
      return {
        statusCode: response.$ResponseMetadata.statusCode,
        requestId: response.$ResponseMetadata.requestId,
        headers: response.$ResponseMetadata.headers,
      };
    }, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      tags: "test_tag1,test_tag2",
      customCoordinates: "10, 10, 100, 100",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      isPrivateFile: true,
      extensions,
    });
    expect(meta.statusCode).toBe(200);
    expect(meta.requestId).toBe("sdfsdfsdfdsf");
    expect(meta.headers).toMatchObject({
      "content-type": "application/json",
      "x-request-id": "sdfsdfsdfdsf",
    });
  });

  test("Undefined fields should not be sent", async ({ page }) => {
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      tags: undefined,
      folder: undefined,
      isPrivateFile: undefined,
      customCoordinates: undefined,
      responseFields: undefined,
      extensions: undefined,
      webhookUrl: undefined,
      overwriteFile: undefined,
      overwriteAITags: undefined,
      overwriteTags: undefined,
      overwriteCustomMetadata: undefined,
      customMetadata: undefined,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.extensions).toBeUndefined();
    expect(f.tags).toBeUndefined();
    expect(f.folder).toBeUndefined();
    expect(f.isPrivateFile).toBeUndefined();
    expect(f.customCoordinates).toBeUndefined();
    expect(f.responseFields).toBeUndefined();
    expect(f.webhookUrl).toBeUndefined();
    expect(f.overwriteFile).toBeUndefined();
    expect(f.overwriteAITags).toBeUndefined();
    expect(f.overwriteTags).toBeUndefined();
    expect(f.overwriteCustomMetadata).toBeUndefined();
    expect(f.customMetadata).toBeUndefined();
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("With pre and post transformation", async ({ page }) => {
    const transformation = {
      pre: "w-100",
      post: [{ type: "transformation", value: "w-100" }],
    };
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      transformation,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.responseFields).toBe("tags, customCoordinates, isPrivateFile, metadata");
    expect(f.useUniqueFileName).toBe("false");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.transformation).toBe(JSON.stringify(transformation));
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("With pre transformation", async ({ page }) => {
    const transformation = { pre: "w-100" };
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      transformation,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.responseFields).toBe("tags, customCoordinates, isPrivateFile, metadata");
    expect(f.useUniqueFileName).toBe("false");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.transformation).toBe(JSON.stringify(transformation));
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("With post transformation", async ({ page }) => {
    const transformation = { post: [{ type: "transformation", value: "w-100" }] };
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      transformation,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.responseFields).toBe("tags, customCoordinates, isPrivateFile, metadata");
    expect(f.useUniqueFileName).toBe("false");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.transformation).toBe(JSON.stringify(transformation));
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("Server 5xx without message", async ({ page }) => {
    await mockUpload(page, { status: 500, body: JSON.stringify({ help: "" }) });
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isServer).toBe(true);
    expect(result.error.message).toBe(
      "Server error occurred while uploading the file. This is rare and usually temporary.",
    );
  });

  test("Should return error for an invalid pre transformation", async ({ page }) => {
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      transformation: { pre: "" },
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isInvalid).toBe(true);
    expect(result.error.message).toBe("Invalid pre transformation parameter.");
  });

  test("Should return error for an invalid post transformation of type abs", async ({ page }) => {
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      transformation: { post: [{ type: "abs", value: "" }] },
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isInvalid).toBe(true);
    expect(result.error.message).toBe("Invalid post transformation parameter.");
  });

  test("Should return error for an invalid post transformation of type transformation", async ({ page }) => {
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      transformation: { post: [{ type: "transformation", value: "" }] },
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isInvalid).toBe(true);
    expect(result.error.message).toBe("Invalid post transformation parameter.");
  });

  test("Should return error for an invalid post transformation if it's not an array", async ({ page }) => {
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      transformation: { post: {} },
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isInvalid).toBe(true);
    expect(result.error.message).toBe("Invalid post transformation parameter.");
  });

  test("With checks option", async ({ page }) => {
    const mock = await mockUpload(page);
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      responseFields: "tags, customCoordinates, isPrivateFile, metadata",
      useUniqueFileName: false,
      checks: "'request.folder' : '/'",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const f = mock.fields();
    expect(f.file).toBe("test_file");
    expect(f.fileName).toBe("test_file_name");
    expect(f.responseFields).toBe("tags, customCoordinates, isPrivateFile, metadata");
    expect(f.useUniqueFileName).toBe("false");
    expect(f.publicKey).toBe("test_public_key");
    expect(f.checks).toBe("'request.folder' : '/'");
    expect(result.response).toEqual(uploadSuccessResponseObj);
  });

  test("onProgress callback is triggered during upload", async ({ page }) => {
    await mockUpload(page);
    const out = await page.evaluate(async (opts) => {
      const w = window as any;
      const xhr = new XMLHttpRequest();
      let calls = 0;
      const promise = w.upload({ ...opts, xhr, onProgress: () => { calls++; } });
      // The SDK wires xhr.upload.onprogress synchronously before sending, so a
      // dispatched progress event must be forwarded to the callback.
      xhr.upload.dispatchEvent(
        new ProgressEvent("progress", { lengthComputable: true, loaded: 50, total: 100 }),
      );
      const response = await promise;
      return { calls, response };
    }, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
    });
    expect(out.calls).toBeGreaterThanOrEqual(1);
    expect(out.response).toEqual(uploadSuccessResponseObj);
  });

  test("Abort signal aborts the upload", async ({ page }) => {
    await mockUpload(page, { hang: true });
    const out = await page.evaluate(async (opts) => {
      const w = window as any;
      const controller = new AbortController();
      const promise = w.upload({ ...opts, abortSignal: controller.signal });
      controller.abort();
      try {
        await promise;
        return { ok: true as const };
      } catch (e: any) {
        return {
          ok: false as const,
          isAbort: e instanceof w.ImageKitAbortError,
          reasonName: e?.reason?.name,
        };
      }
    }, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
    });
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.isAbort).toBe(true);
    expect(out.reasonName).toBe("AbortError");
  });

  test("Abort signal aborts the upload with reason", async ({ page }) => {
    await mockUpload(page, { hang: true });
    const out = await page.evaluate(async (opts) => {
      const w = window as any;
      const controller = new AbortController();
      const promise = w.upload({ ...opts, abortSignal: controller.signal });
      controller.abort("abort reason");
      try {
        await promise;
        return { ok: true as const };
      } catch (e: any) {
        return {
          ok: false as const,
          isAbort: e instanceof w.ImageKitAbortError,
          reason: e?.reason,
        };
      }
    }, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
    });
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.isAbort).toBe(true);
    expect(out.reason).toBe("abort reason");
  });

  test("Already aborted signal should abort upload immediately", async ({ page }) => {
    const out = await page.evaluate(async (opts) => {
      const w = window as any;
      const controller = new AbortController();
      controller.abort();
      try {
        await w.upload({ ...opts, abortSignal: controller.signal });
        return { ok: true as const };
      } catch (e: any) {
        return {
          ok: false as const,
          isAbort: e instanceof w.ImageKitAbortError,
          reasonName: e?.reason?.name,
        };
      }
    }, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
    });
    expect(out.ok).toBe(false);
    if (out.ok) return;
    expect(out.isAbort).toBe(true);
    expect(out.reasonName).toBe("AbortError");
  });

  test("Error during upload 4xx with invalid JSON response", async ({ page }) => {
    await mockUpload(page, { status: 400, body: "sdf" });
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isSyntax).toBe(true);
  });

  test("Should return error for an invalid transformation object in upload", async ({ page }) => {
    const result = await runUpload(page, {
      ...securityParameters,
      fileName: "test_file_name",
      file: "test_file",
      transformation: 123,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.isInvalid).toBe(true);
    expect(result.error.message).toBe(
      "Invalid transformation parameter. Please include at least pre, post, or both.",
    );
  });
});
