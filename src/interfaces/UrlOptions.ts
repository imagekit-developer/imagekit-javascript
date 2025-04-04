import { Transformation } from "./Transformation";
import { TransformationPosition } from ".";

export interface UrlOptions {
  /**
   * Accepts relative or absolute path of the resource. If relative path is provided, it is appended to the `urlEndpoint`. If absolute path is provided, `urlEndpoint` is ignored.
   */
  src: string;

  /**
   * Get your urlEndpoint from the [ImageKit dashboard](https://imagekit.io/dashboard/url-endpoints).
   */
  urlEndpoint: string;

  /**
   * An array of objects specifying the transformations to be applied in the URL. If more than one transformation is specified, they are applied in the order they are specified as chained transformations.
   * 
   * {@link https://imagekit.io/docs/transformations#chained-transformations}
   */
  transformation?: Array<Transformation>;

  /**
   * These are the other query parameters that you want to add to the final URL.
   * These can be any query parameters and not necessarily related to ImageKit.
   * Especially useful, if you want to add some versioning parameter to your URLs.
   */
  queryParameters?: { [key: string]: string | number };

  /**
     * By default, the transformation string is added as a query parameter in the URL e.g. `?tr=w-100,h-100`. If you want to add the transformation string in the path of the URL, set this to `path`.
     */
  transformationPosition?: TransformationPosition;
}