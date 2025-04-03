import errorMessages from "./constants/errorMessages";
import { ImageKitOptions, UploadOptions, UploadResponse, UrlOptions } from "./interfaces";
import IKResponse from "./interfaces/IKResponse";
import { upload } from "./upload";
import { buildURL } from "./url/builder";
import transformationUtils from "./utils/transformation";
type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;


function mandatoryParametersAvailable(options: ImageKitOptions) {
  return options.urlEndpoint;
}

class ImageKit {
  options: MakeRequired<ImageKitOptions, "urlEndpoint"> = {
    publicKey: "",
    urlEndpoint: "",
    transformationPosition: transformationUtils.getDefault(),
  };

  constructor(opts: MakeRequired<ImageKitOptions, "urlEndpoint">) {
    this.options = { ...this.options, ...(opts || {}) };
    if (!mandatoryParametersAvailable(this.options)) {
      throw errorMessages.MANDATORY_INITIALIZATION_MISSING;
    }

    if (!transformationUtils.validParameters(this.options)) {
      throw errorMessages.INVALID_TRANSFORMATION_POSITION;
    }
  }

  /**
   * An instance method to generate URL for the given transformation parameters. This method is useful when you want to generate URL using the instance of the SDK without passing common parameters like `urlEndpoint` and `transformationPosition` every time.
   */
  url(urlOptions: UrlOptions & Partial<Pick<ImageKitOptions, "urlEndpoint" | "transformationPosition">>): string {
    // Merge the options with the instance options
    const options = {
      ...this.options,
      ...urlOptions,
    };
    return ImageKit.url(options);
  }

  /**
   * A static method to generate URL for the given transformation parameters. This method is useful when you want to generate URL without creating an instance of the SDK.
   */
  static url(urlOptions: UrlOptions & Required<Pick<ImageKitOptions, "urlEndpoint">> & Pick<ImageKitOptions, "transformationPosition">): string {
    return buildURL(urlOptions);
  }

  /**
   * An instance method to upload file to ImageKit.io. This method is useful when you want to upload file using the instance of the SDK without passing common parameters like `urlEndpoint` and `publicKey` every time.
   */
  upload(uploadOptions: UploadOptions & Partial<Pick<ImageKitOptions, "publicKey">>): Promise<IKResponse<UploadResponse>> {
    // Merge the options with the instance options
    const options = {
      ...this.options,
      ...uploadOptions,
    };

    return ImageKit.upload(options as UploadOptions & Required<Pick<ImageKitOptions, "publicKey">>);
  }

  /**
   * A static method to upload file to ImageKit.io. This method is useful when you want to upload file without creating an instance of the SDK.
   */
  static upload(uploadOptions: UploadOptions & Required<Pick<ImageKitOptions, "publicKey">>): Promise<IKResponse<UploadResponse>> {
    if (!uploadOptions.publicKey || uploadOptions.publicKey.length === 0) {
      throw errorMessages.MISSING_PUBLIC_KEY;
    }

    const { xhr: userProvidedXHR } = uploadOptions || {};
    delete uploadOptions.xhr;
    const xhr = userProvidedXHR || new XMLHttpRequest();

    // Extract publicKey from uploadOptions
    const { publicKey, ...rest } = uploadOptions;
    return upload(
      xhr,
      rest,
      {
        publicKey,
      }
    )
  }
}

export default ImageKit;