import { url } from "./url/index";
import { upload } from "./upload/index";
import { version } from "../package.json";
import transformationUtils from "./utils/transformation";
import errorMessages from "./constants/errorMessages";
import { IImageKit, ImageKitOptions, UploadOptions, UploadResponse, UrlOptions } from "./interfaces";

function mandatoryParametersAvailable(options: ImageKitOptions) {
  return options.urlEndpoint;
}

function privateKeyPassed(options: ImageKitOptions) {
  return typeof (options as any).privateKey != "undefined";
}

const ImageKit = function (
  this: IImageKit,
  opts: ImageKitOptions,
) {
  opts = opts || {};
  this.options = {
    sdkVersion: `javascript-${version}`,
    publicKey: "",
    urlEndpoint: "",
    transformationPosition: transformationUtils.getDefault(),
  };

  this.options = {
    ...this.options,
    ...opts,
  };

  if (!mandatoryParametersAvailable(this.options)) {
    throw errorMessages.MANDATORY_INITIALIZATION_MISSING;
  }
  if (privateKeyPassed(this.options)) {
    throw errorMessages.PRIVATE_KEY_CLIENT_SIDE;
  }

  if (!transformationUtils.validParameters(this.options)) {
    throw errorMessages.INVALID_TRANSFORMATION_POSITION;
  }

  /* URL Builder */
  this.url = function (urlOptions: UrlOptions): string {
    return url(urlOptions, this.options);
  };

  /* Upload API */
  this.upload = function (
    uploadOptions: UploadOptions,
    callback?: (err: Error | null, response: UploadResponse | null) => void,
    options?: Partial<ImageKitOptions>,
  ): void {
    var mergedOptions = {
      ...this.options,
      ...options,
    };
    return upload(uploadOptions, mergedOptions, callback);
  };
};

export default ImageKit;
