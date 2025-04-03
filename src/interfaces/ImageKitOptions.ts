import { TransformationPosition } from ".";

export interface ImageKitOptions {
  /**
   * Get your urlEndpoint from the [ImageKit dashboard](https://imagekit.io/dashboard/url-endpoints).
   */
  urlEndpoint?: string;

  /**
   * The public API key of your ImageKit account. You can find it in the [ImageKit dashboard](https://imagekit.io/dashboard/developer/api-keys).
   */
  publicKey?: string;

  /**
   * By default, the transformation string is added as a query parameter in the URL e.g. `?tr=w-100,h-100`. If you want to add the transformation string in the path of the URL, set this to `path`.
   */
  transformationPosition?: TransformationPosition;
}
