import errorMessages from "../constants/errorMessages";
import { ImageKitOptions, UploadOptions, UploadResponse } from "../interfaces";
import IKResponse from "../interfaces/IKResponse";

export const upload = (
  xhr: XMLHttpRequest,
  uploadOptions: UploadOptions,
  options: Required<Pick<ImageKitOptions,"publicKey">>
): Promise<IKResponse<UploadResponse>> => {
  return new Promise((resolve, reject) => {
    if (!uploadOptions.file) {
      return reject(errorMessages.MISSING_UPLOAD_FILE_PARAMETER)
    }

    if (!uploadOptions.fileName) {
      return reject(errorMessages.MISSING_UPLOAD_FILENAME_PARAMETER);
    }

    if (!options.publicKey) {
      return reject(errorMessages.MISSING_PUBLIC_KEY);
    }

    if (!uploadOptions.token) {
      return reject(errorMessages.MISSING_TOKEN);
    }

    if (!uploadOptions.signature) {
      return reject(errorMessages.MISSING_SIGNATURE);
    }

    if (!uploadOptions.expire) {
      return reject(errorMessages.MISSING_EXPIRE);
    }

    if (uploadOptions.transformation) {
      if (!(Object.keys(uploadOptions.transformation).includes("pre") || Object.keys(uploadOptions.transformation).includes("post"))) {
        return reject(errorMessages.INVALID_TRANSFORMATION);
      }
      if (Object.keys(uploadOptions.transformation).includes("pre") && !uploadOptions.transformation.pre) {
        return reject(errorMessages.INVALID_PRE_TRANSFORMATION);
        return;
      }
      if (Object.keys(uploadOptions.transformation).includes("post")) {
        if (Array.isArray(uploadOptions.transformation.post)) {
          for (let transformation of uploadOptions.transformation.post) {
            if (transformation.type === "abs" && !(transformation.protocol || transformation.value)) {
              return reject(errorMessages.INVALID_POST_TRANSFORMATION);
            } else if (transformation.type === "transformation" && !transformation.value) {
              return reject(errorMessages.INVALID_POST_TRANSFORMATION);
            }
          }
        } else {
          return reject(errorMessages.INVALID_POST_TRANSFORMATION);
        }
      }
    }

    var formData = new FormData();
    let key: keyof typeof uploadOptions;
    for (key in uploadOptions) {
      if (key) {
        if (key === "file" && typeof uploadOptions.file != "string") {
          formData.append('file', uploadOptions.file, String(uploadOptions.fileName));
        } else if (key === "tags" && Array.isArray(uploadOptions.tags)) {
          formData.append('tags', uploadOptions.tags.join(","));
        } else if (key === 'signature') {
          formData.append("signature", uploadOptions.signature);
        } else if (key === 'expire') {
          formData.append("expire", String(uploadOptions.expire));
        } else if (key === 'token') {
          formData.append("token", uploadOptions.token);
        } else if (key === "responseFields" && Array.isArray(uploadOptions.responseFields)) {
          formData.append('responseFields', uploadOptions.responseFields.join(","));
        } else if (key === "extensions" && Array.isArray(uploadOptions.extensions)) {
          formData.append('extensions', JSON.stringify(uploadOptions.extensions));
        } else if (key === "customMetadata" && typeof uploadOptions.customMetadata === "object" &&
          !Array.isArray(uploadOptions.customMetadata) && uploadOptions.customMetadata !== null) {
          formData.append('customMetadata', JSON.stringify(uploadOptions.customMetadata));
        } else if (key === "transformation" && typeof uploadOptions.transformation === "object" &&
          uploadOptions.transformation !== null) {
          formData.append(key, JSON.stringify(uploadOptions.transformation));
        } else if (key === 'checks' && uploadOptions.checks) {
          formData.append("checks", uploadOptions.checks);
        } else if (uploadOptions[key] !== undefined) {
          if (["onProgress", "signal"].includes(key)) continue;
          formData.append(key, String(uploadOptions[key]));
        }
      }
    }

    formData.append("publicKey", options.publicKey);

    if (uploadOptions.onProgress) {
      xhr.upload.onprogress = function (event: ProgressEvent) {
        if (uploadOptions.onProgress) uploadOptions.onProgress(event)
      };
    }

    function onAbortHandler() {
      xhr.abort();
      // Provide the reason or fallback error
      // @ts-ignore for TypeScript versions lacking `signal.reason`
      return reject(uploadOptions.signal?.reason ?? errorMessages.UPLOAD_ABORTED);
    }

    if (uploadOptions.signal) {
      if (uploadOptions.signal.aborted) { // If the signal is already aborted, return immediately with the reason
        // @ts-ignore for TypeScript versions lacking `signal.reason`
        return reject(uploadOptions.signal.reason ?? errorMessages.UPLOAD_ABORTED);
      }

      // If the signal is not already aborted, add an event listener to abort the request when the signal is aborted
      uploadOptions.signal.addEventListener("abort", onAbortHandler);

      // On XHR completion (success, fail, or abort), remove just this abort handler
      xhr.addEventListener("loadend", () => {
        if (uploadOptions.signal) {
          uploadOptions.signal.removeEventListener("abort", onAbortHandler);
        }
      });
    }

    xhr.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');
    xhr.onerror = function (e) {
      return reject(errorMessages.UPLOAD_ENDPOINT_NETWORK_ERROR);
    }
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var body = JSON.parse(xhr.responseText);
          var uploadResponse = addResponseHeadersAndBody(body, xhr);
          return resolve(uploadResponse);
        } catch (ex: any) {
          return reject(ex);
        }
      } else {
        try {
          var body = JSON.parse(xhr.responseText);
          var uploadError = addResponseHeadersAndBody(body, xhr);
          return reject(uploadError)
        } catch (ex: any) {
          return reject(ex);
        }
      }
    };
    xhr.send(formData);
  });

};


const addResponseHeadersAndBody = (body: any, xhr: XMLHttpRequest): IKResponse<UploadResponse> => {
  let response = { ...body };
  const responseMetadata = {
    statusCode: xhr.status,
    headers: getResponseHeaderMap(xhr)
  }
  Object.defineProperty(response, "$ResponseMetadata", {
    value: responseMetadata,
    enumerable: false,
    writable: false
  });
  return response as IKResponse<UploadResponse>;
}

function getResponseHeaderMap(xhr: XMLHttpRequest) {
  const headers: Record<string, string | number | boolean> = {};
  const responseHeaders = xhr.getAllResponseHeaders();
  if (Object.keys(responseHeaders).length) {
      responseHeaders
          .trim()
          .split(/[\r\n]+/)
          .map(value => value.split(/: /))
          .forEach(keyValue => {
              headers[keyValue[0].trim()] = keyValue[1].trim();
          });
  }
  return headers;
}