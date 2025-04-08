import errorMessages from "./constants/errorMessages";
import { ResponseMetadata, UploadOptions, UploadResponse } from "./interfaces";

/**
 * Represents an error when a request to ImageKit is invalid.
 */
export class ImageKitInvalidRequestError extends Error {
  /**
   * Optional metadata about the response. It is only available if server returns a response.
   */
  readonly $ResponseMetadata?: ResponseMetadata;
  constructor(message: string, responseMetadata?: ResponseMetadata) {
    super(message);
    this.name = "ImageKitInvalidRequestError";
    this.$ResponseMetadata = responseMetadata;
  }
}

/**
 * Represents an error when an upload operation is aborted.
 */
export class ImageKitAbortError extends Error {
  /**
   * The reason why the operation was aborted, which can be any JavaScript value. If not specified, the reason is set to "AbortError" DOMException.
   */
  reason?: unknown;
  constructor(message: string, reason?: unknown) {
    super(message);
    this.name = "ImageKitAbortError";
    this.reason = reason;
  }
}

/**
 * Represents a network error during an upload operation to ImageKit.
 */
export class ImageKitUploadNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageKitUploadNetworkError";
  }
}

/**
 * Represents a server error from ImageKit during an upload operation.
 */
export class ImageKitServerError extends Error {
  /**
   * Optional metadata about the response. It is only available if server returns a response.
   */
  readonly $ResponseMetadata?: ResponseMetadata;
  constructor(message: string, responseMetadata?: ResponseMetadata) {
    super(message);
    this.name = "ImageKitServerError";
    this.$ResponseMetadata = responseMetadata;
  }
}

/**
 * Uploads a file to ImageKit with the given upload options. This function uses V1 API, check the [API docs](https://imagekit.io/docs/api-reference/upload-file/upload-file) for more details.
 *
 * @throws {ImageKitInvalidRequestError} If the request is invalid.
 * @throws {ImageKitAbortError} If the request is aborted.
 * @throws {ImageKitUploadNetworkError} If there is a network error.
 * @throws {ImageKitServerError} If there is a server error.
 *
 * @param {UploadOptions} uploadOptions - The options for uploading the file.
 * @returns {Promise<UploadResponse>} A Promise resolving to a successful UploadResponse.
 */
export const upload = (uploadOptions: UploadOptions): Promise<UploadResponse> => {
  if(!uploadOptions) {
    return Promise.reject(new ImageKitInvalidRequestError("Invalid options provided for upload"));
  }
  return new Promise((resolve, reject) => {
    const { xhr: userProvidedXHR } = uploadOptions || {};
    delete uploadOptions.xhr;
    const xhr = userProvidedXHR || new XMLHttpRequest();

    if (!uploadOptions.file) {
      return reject(new ImageKitInvalidRequestError(errorMessages.MISSING_UPLOAD_FILE_PARAMETER.message));
    }

    if (!uploadOptions.fileName) {
      return reject(new ImageKitInvalidRequestError(errorMessages.MISSING_UPLOAD_FILENAME_PARAMETER.message));
    }

    if (!uploadOptions.publicKey || uploadOptions.publicKey.length === 0) {
      return reject(new ImageKitInvalidRequestError(errorMessages.MISSING_PUBLIC_KEY.message));
    }

    if (!uploadOptions.token) {
      return reject(new ImageKitInvalidRequestError(errorMessages.MISSING_TOKEN.message));
    }

    if (!uploadOptions.signature) {
      return reject(new ImageKitInvalidRequestError(errorMessages.MISSING_SIGNATURE.message));
    }

    if (!uploadOptions.expire) {
      return reject(new ImageKitInvalidRequestError(errorMessages.MISSING_EXPIRE.message));
    }

    if (uploadOptions.transformation) {
      if (!(Object.keys(uploadOptions.transformation).includes("pre") || Object.keys(uploadOptions.transformation).includes("post"))) {
        return reject(new ImageKitInvalidRequestError(errorMessages.INVALID_TRANSFORMATION.message));
      }
      if (Object.keys(uploadOptions.transformation).includes("pre") && !uploadOptions.transformation.pre) {
        return reject(new ImageKitInvalidRequestError(errorMessages.INVALID_PRE_TRANSFORMATION.message));
      }
      if (Object.keys(uploadOptions.transformation).includes("post")) {
        if (Array.isArray(uploadOptions.transformation.post)) {
          for (let transformation of uploadOptions.transformation.post) {
            if (transformation.type === "abs" && !(transformation.protocol || transformation.value)) {
              return reject(new ImageKitInvalidRequestError(errorMessages.INVALID_POST_TRANSFORMATION.message));
            } else if (transformation.type === "transformation" && !transformation.value) {
              return reject(new ImageKitInvalidRequestError(errorMessages.INVALID_POST_TRANSFORMATION.message));
            }
          }
        } else {
          return reject(new ImageKitInvalidRequestError(errorMessages.INVALID_POST_TRANSFORMATION.message));
        }
      }
    }

    var formData = new FormData();
    let key: keyof typeof uploadOptions;
    for (key in uploadOptions) {
      if (key) {
        if (key === "file" && typeof uploadOptions.file != "string") {
          formData.set('file', uploadOptions.file, String(uploadOptions.fileName));
        } else if (key === "tags" && Array.isArray(uploadOptions.tags)) {
          formData.set('tags', uploadOptions.tags.join(","));
        } else if (key === 'signature') {
          formData.set("signature", uploadOptions.signature);
        } else if (key === 'expire') {
          formData.set("expire", String(uploadOptions.expire));
        } else if (key === 'token') {
          formData.set("token", uploadOptions.token);
        } else if (key === "responseFields" && Array.isArray(uploadOptions.responseFields)) {
          formData.set('responseFields', uploadOptions.responseFields.join(","));
        } else if (key === "extensions" && Array.isArray(uploadOptions.extensions)) {
          formData.set('extensions', JSON.stringify(uploadOptions.extensions));
        } else if (key === "customMetadata" && typeof uploadOptions.customMetadata === "object" &&
          !Array.isArray(uploadOptions.customMetadata) && uploadOptions.customMetadata !== null) {
          formData.set('customMetadata', JSON.stringify(uploadOptions.customMetadata));
        } else if (key === "transformation" && typeof uploadOptions.transformation === "object" &&
          uploadOptions.transformation !== null) {
          formData.set(key, JSON.stringify(uploadOptions.transformation));
        } else if (key === 'checks' && uploadOptions.checks) {
          formData.set("checks", uploadOptions.checks);
        } else if (uploadOptions[key] !== undefined) {
          if (["onProgress", "abortSignal"].includes(key)) continue;
          formData.set(key, String(uploadOptions[key]));
        }
      }
    }

    if (uploadOptions.onProgress) {
      xhr.upload.onprogress = function (event: ProgressEvent) {
        if (uploadOptions.onProgress) uploadOptions.onProgress(event)
      };
    }

    function onAbortHandler() {
      xhr.abort();
      return reject(new ImageKitAbortError(
        "Upload aborted",
        uploadOptions.abortSignal?.reason
      ));
    }

    if (uploadOptions.abortSignal) {
      if (uploadOptions.abortSignal.aborted) {
        // If the signal is already aborted, return immediately with the reason

        return reject(new ImageKitAbortError(
          "Upload aborted",
          uploadOptions.abortSignal?.reason
        ));
      }

      // If the signal is not already aborted, add an event listener to abort the request when the signal is aborted
      uploadOptions.abortSignal.addEventListener("abort", onAbortHandler);

      // On XHR completion (success, fail, or abort), remove just this abort handler
      xhr.addEventListener("loadend", () => {
        if (uploadOptions.abortSignal) {
          uploadOptions.abortSignal.removeEventListener("abort", onAbortHandler);
        }
      });
    }

    xhr.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');
    xhr.onerror = function (e) {
      return reject(new ImageKitUploadNetworkError(errorMessages.UPLOAD_ENDPOINT_NETWORK_ERROR.message));
    }
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var body = JSON.parse(xhr.responseText);
          var uploadResponse = addResponseHeadersAndBody(body, xhr);
          return resolve(uploadResponse);
        } catch (ex: any) {
          return reject(ex);
        }
      } else if (xhr.status >= 400 && xhr.status < 500) {
        // Send ImageKitInvalidRequestError
        try {
          var body = JSON.parse(xhr.responseText);
          return reject(new ImageKitInvalidRequestError(
            body.message ?? "Invalid request. Please check the parameters.",
            getResponseMetadata(xhr)
          ));
        } catch (ex: any) {
          return reject(ex);
        }
      } else {
        // Send ImageKitServerError
        try {
          var body = JSON.parse(xhr.responseText);
          return reject(new ImageKitServerError(
            body.message ?? "Server error occurred while uploading the file. This is rare and usually temporary.",
            getResponseMetadata(xhr)
          ));
        } catch (ex: any) {
          return reject(new ImageKitServerError(
            "Server error occurred while uploading the file. This is rare and usually temporary.",
            getResponseMetadata(xhr)
          ));
        }
      }
    };
    xhr.send(formData);
  });
};


const addResponseHeadersAndBody = (body: any, xhr: XMLHttpRequest) => {
  let response = { ...body };
  const responseMetadata = getResponseMetadata(xhr);
  Object.defineProperty(response, "$ResponseMetadata", {
    value: responseMetadata,
    enumerable: false,
    writable: false
  });
  return response;
}

const getResponseMetadata = (xhr: XMLHttpRequest): ResponseMetadata => {
  const headers = getResponseHeaderMap(xhr);
  const responseMetadata = {
    statusCode: xhr.status,
    headers: headers,
    requestId: headers["x-request-id"]
  }
  return responseMetadata;
}

function getResponseHeaderMap(xhr: XMLHttpRequest): Record<string, string> {
  const headers: Record<string, string> = {};
  const responseHeaders = xhr.getAllResponseHeaders();
  if (Object.keys(responseHeaders).length) {
    responseHeaders
      .trim()
      .split(/[\r\n]+/)
      .map(value => value.split(/: /))
      .forEach(keyValue => {
        headers[keyValue[0].trim().toLowerCase()] = keyValue[1].trim();
      });
  }
  return headers;
}
