import { version } from "../package.json";
import errorMessages from "./constants/errorMessages";
import { ImageKitOptions, UploadOptions, UploadResponse, UrlOptions } from "./interfaces";
import IKResponse from "./interfaces/IKResponse";
import { upload } from "./upload/index";
import respond from "./utils/respond";
import { url } from "./url/index";
import transformationUtils from "./utils/transformation";

function mandatoryParametersAvailable(options: ImageKitOptions) {
  return options.urlEndpoint;
}

const promisify = function <T = void>(thisContext: ImageKit, fn: Function) {
  return function (...args: any[]): Promise<T> | void {
    if (args.length === fn.length && typeof args[args.length - 1] !== "undefined") {
      if (typeof args[args.length - 1] !== "function") {
        throw new Error("Callback must be a function.");
      }
      fn.call(thisContext, ...args);
    } else {
      return new Promise<T>((resolve, reject) => {
        const callback = function (err: Error, ...results: any[]) {
          if (err) {
            return reject(err);
          } else {
            resolve(results.length > 1 ? results : results[0]);
          }
        };
        args.pop()
        args.push(callback);
        fn.call(thisContext, ...args);
      });
    }
  };
};

class ImageKit {
  options: ImageKitOptions = {
    sdkVersion: `javascript-${version}`,
    publicKey: "",
    urlEndpoint: "",
    transformationPosition: transformationUtils.getDefault(),
  };

  constructor(opts: Omit<ImageKitOptions, "sdkVersion">) {
    this.options = { ...this.options, ...(opts || {}) };
    if (!mandatoryParametersAvailable(this.options)) {
      throw errorMessages.MANDATORY_INITIALIZATION_MISSING;
    }

    if (!transformationUtils.validParameters(this.options)) {
      throw errorMessages.INVALID_TRANSFORMATION_POSITION;
    }
  }

  /**
   * A utility function to generate asset URL. It applies the specified transformations and other parameters to the URL.
   */
  url(urlOptions: UrlOptions): string {
    return url(urlOptions, this.options);
  }

  /**
   * For uploading files directly from the browser to ImageKit.io.
   *
   * {@link https://imagekit.io/docs/api-reference/upload-file/upload-file#how-to-implement-client-side-file-upload}
   */
  upload(uploadOptions: UploadOptions, options?: Partial<ImageKitOptions>): Promise<IKResponse<UploadResponse>>
  upload(uploadOptions: UploadOptions, callback: (err: Error | null, response: IKResponse<UploadResponse> | null) => void, options?: Partial<ImageKitOptions>): void;
  upload(uploadOptions: UploadOptions, callbackOrOptions?: ((err: Error | null, response: IKResponse<UploadResponse> | null) => void) | Partial<ImageKitOptions>, options?: Partial<ImageKitOptions>): void | Promise<IKResponse<UploadResponse>> {
    let callback;
    if (typeof callbackOrOptions === 'function') {
      callback = callbackOrOptions;
    } else {
      options = callbackOrOptions || {};
    }
    if (!uploadOptions || typeof uploadOptions !== "object") {
      return respond(true, errorMessages.INVALID_UPLOAD_OPTIONS, callback);
    }
    var mergedOptions = {
      ...this.options,
      ...options,
    };
    const { xhr: userProvidedXHR } = uploadOptions || {};
    delete uploadOptions.xhr;
    const xhr = userProvidedXHR || new XMLHttpRequest();
    return promisify<IKResponse<UploadResponse>>(this, upload)(xhr, uploadOptions, mergedOptions, callback);
  }
}

export default ImageKit;
