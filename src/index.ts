import { version } from "../package.json";
import errorMessages from "./constants/errorMessages";
import { ImageKitOptions, UploadOptions, UploadResponse, UrlOptions } from "./interfaces";
import { upload } from "./upload/index";
import { url } from "./url/index";
import transformationUtils from "./utils/transformation";

function mandatoryParametersAvailable(options: ImageKitOptions) {
  return options.urlEndpoint;
}

function privateKeyPassed(options: ImageKitOptions) {
  return typeof (options as any).privateKey != "undefined";
}

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
    if (privateKeyPassed(this.options)) {
      throw errorMessages.PRIVATE_KEY_CLIENT_SIDE;
    }

    if (!transformationUtils.validParameters(this.options)) {
      throw errorMessages.INVALID_TRANSFORMATION_POSITION;
    }
  }

  /**
   * You can add multiple origins in the same ImageKit.io account.
   * URL endpoints allow you to configure which origins are accessible through your account and set their preference order as well.
   *
   * @see {@link https://github.com/imagekit-developer/imagekit-nodejs#url-generation}
   * @see {@link https://docs.imagekit.io/integration/url-endpoints}
   *
   * @param urlOptions
   */
  url(urlOptions: UrlOptions): string {
    return url(urlOptions, this.options);
  }

  /**
   * You can upload files to ImageKit.io media library from your server-side using private API key authentication.
   *
   * File size limit
   * The maximum upload file size is limited to 25MB.
   *
   * @see {@link https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload}
   *
   * @param uploadOptions
   */
  upload(
    uploadOptions: UploadOptions,
    callback?: (err: Error | null, response: UploadResponse | null) => void,
    options?: Partial<ImageKitOptions>,
  ): void {
    var mergedOptions = {
      ...this.options,
      ...options,
    };
    return upload(uploadOptions, mergedOptions, callback);
  }
}

export default ImageKit;
