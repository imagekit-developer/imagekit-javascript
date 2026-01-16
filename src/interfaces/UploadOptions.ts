import * as Shared from './shared';

/**
 * Options used when uploading a file using the V1 API.
 * Check out the official documentation:
 * {@link https://imagekit.io/docs/api-reference/upload-file/upload-file}
 */
export interface UploadOptions {
  /**
   * The API accepts any of the following:
   *
   * - **Binary data** – send the raw bytes as `multipart/form-data`.
   * - **HTTP / HTTPS URL** – a publicly reachable URL that ImageKit’s servers can
   *   fetch.
   * - **Base64 string** – the file encoded as a Base64 data URI or plain Base64.
   *
   * When supplying a URL, the server must receive the response headers within 8
   * seconds; otherwise the request fails with 400 Bad Request.
   */
  file: string | Blob | File;

  /**
   * The name with which the file has to be uploaded. The file name can contain:
   *
   * - Alphanumeric Characters: `a-z`, `A-Z`, `0-9`.
   * - Special Characters: `.`, `-`
   *
   * Any other character including space will be replaced by `_`
   */
  fileName: string;

  /**
   * A unique value that the ImageKit.io server will use to recognize and prevent
   * subsequent retries for the same request. We suggest using V4 UUIDs, or another
   * random string with enough entropy to avoid collisions.
   *
   * **Note**: Sending a value that has been used in the past will result in a
   * validation error. Even if your previous request resulted in an error, you should
   * always send a new value for this field.
   */
  token: string;

  /**
   * Server-side checks to run on the asset. Read more about
   * [Upload API checks](/docs/api-reference/upload-file/upload-file#upload-api-checks).
   */
  checks?: string;

  /**
   * Define an important area in the image. This is only relevant for image type
   * files.
   *
   * - To be passed as a string with the x and y coordinates of the top-left corner,
   *   and width and height of the area of interest in the format `x,y,width,height`.
   *   For example - `10,10,100,100`
   * - Can be used with fo-customtransformation.
   * - If this field is not specified and the file is overwritten, then
   *   customCoordinates will be removed.
   */
  customCoordinates?: string;

  /**
   * JSON key-value pairs to associate with the asset. Create the custom metadata
   * fields before setting these values.
   */
  customMetadata?: { [key: string]: unknown };

  /**
   * Optional text to describe the contents of the file.
   */
  description?: string;

  /**
   * The time until your signature is valid. It must be a
   * [Unix time](https://en.wikipedia.org/wiki/Unix_time) in less than 1 hour into
   * the future. It should be in seconds.
   */
  expire: number;

  /**
   * Array of extensions to be applied to the asset. Each extension can be configured
   * with specific parameters based on the extension type.
   */
  extensions?: Shared.Extensions;

  /**
   * The folder path in which the image has to be uploaded. If the folder(s) didn't
   * exist before, a new folder(s) is created.
   *
   * The folder name can contain:
   *
   * - Alphanumeric Characters: `a-z` , `A-Z` , `0-9`
   * - Special Characters: `/` , `_` , `-`
   *
   * Using multiple `/` creates a nested folder.
   */
  folder?: string;

  /**
   * Whether to mark the file as private or not.
   *
   * If `true`, the file is marked as private and is accessible only using named
   * transformation or signed URL.
   */
  isPrivateFile?: boolean;

  /**
   * Whether to upload file as published or not.
   *
   * If `false`, the file is marked as unpublished, which restricts access to the
   * file only via the media library. Files in draft or unpublished state can only be
   * publicly accessed after being published.
   *
   * The option to upload in draft state is only available in custom enterprise
   * pricing plans.
   */
  isPublished?: boolean;

  /**
   * If set to `true` and a file already exists at the exact location, its AITags
   * will be removed. Set `overwriteAITags` to `false` to preserve AITags.
   */
  overwriteAITags?: boolean;

  /**
   * If the request does not have `customMetadata`, and a file already exists at the
   * exact location, existing customMetadata will be removed.
   */
  overwriteCustomMetadata?: boolean;

  /**
   * If `false` and `useUniqueFileName` is also `false`, and a file already exists at
   * the exact location, upload API will return an error immediately.
   */
  overwriteFile?: boolean;

  /**
   * If the request does not have `tags`, and a file already exists at the exact
   * location, existing tags will be removed.
   */
  overwriteTags?: boolean;

  /**
   * The public API key of your ImageKit account. 
   * You can find it in the [ImageKit dashboard](https://imagekit.io/dashboard/developer/api-keys).
   */
  publicKey: string;

  /**
   * Array of response field keys to include in the API response body.
   */
  responseFields?: Array<
    | 'tags'
    | 'customCoordinates'
    | 'isPrivateFile'
    | 'embeddedMetadata'
    | 'isPublished'
    | 'customMetadata'
    | 'metadata'
    | 'selectedFieldsSchema'
  >;

  /**
   * The HMAC-SHA1 digest of the concatenation of "token + expire". The signing key is your ImageKit private API key.
   * Calculate this signature in your secure server and pass it to the client.
   */
  signature: string;

  /**
   * Set the tags while uploading the file. Provide an array of tag strings (e.g.
   * `["tag1", "tag2", "tag3"]`). The combined length of all tag characters must not
   * exceed 500, and the `%` character is not allowed. If this field is not specified
   * and the file is overwritten, the existing tags will be removed.
   */
  tags?: Array<string>;

  /**
   * Configure pre-processing (`pre`) and post-processing (`post`) transformations.
   *
   * - `pre` — applied before the file is uploaded to the Media Library.
   *   Useful for reducing file size or applying basic optimizations upfront (e.g.,
   *   resize, compress).
   *
   * - `post` — applied immediately after upload.
   *   Ideal for generating transformed versions (like video encodes or thumbnails)
   *   in advance, so they're ready for delivery without delay.
   *
   * You can mix and match any combination of post-processing types.
   */
  transformation?: FileUploadParams.Transformation;

  /**
   * Whether to use a unique filename for this file or not.
   *
   * If `true`, ImageKit.io will add a unique suffix to the filename parameter to get
   * a unique filename.
   *
   * If `false`, then the image is uploaded with the provided filename parameter, and
   * any existing file with the same name is replaced.
   */
  useUniqueFileName?: boolean;

  /**
   * The final status of extensions after they have completed execution will be
   * delivered to this endpoint as a POST request.
   * [Learn more](/docs/api-reference/digital-asset-management-dam/managing-assets/update-file-details#webhook-payload-structure)
   * about the webhook payload structure.
   */
  webhookUrl?: string;

  // JS SDK specific options

  /**
   * An optional XMLHttpRequest instance for the upload. The SDK merges it with its own logic to handle progress events, etc.
   * You can listen to `progress` or other events on this object for custom logic.
   */
  xhr?: XMLHttpRequest;

  /**
   * Optional callback function that will be called with the progress event when the file is being uploaded.
   */
  onProgress?: (event: ProgressEvent) => void;

  /**
   * An AbortSignal instance that can be used to cancel the request if needed.
   * When aborted, the request fails with an ImageKitAbortError.
   */
  abortSignal?: AbortSignal;
}

export namespace FileUploadParams {
  /**
   * Configure pre-processing (`pre`) and post-processing (`post`) transformations.
   *
   * - `pre` — applied before the file is uploaded to the Media Library.
   *   Useful for reducing file size or applying basic optimizations upfront (e.g.,
   *   resize, compress).
   *
   * - `post` — applied immediately after upload.
   *   Ideal for generating transformed versions (like video encodes or thumbnails)
   *   in advance, so they're ready for delivery without delay.
   *
   * You can mix and match any combination of post-processing types.
   */
  export interface Transformation {
    /**
     * List of transformations to apply _after_ the file is uploaded.
     * Each item must match one of the following types: `transformation`,
     * `gif-to-video`, `thumbnail`, `abs`.
     */
    post?: Array<
      | Transformation.Transformation
      | Transformation.GifToVideo
      | Transformation.Thumbnail
      | Transformation.Abs
    >;

    /**
     * Transformation string to apply before uploading the file to the Media Library.
     * Useful for optimizing files at ingestion.
     */
    pre?: string;
  }

  export namespace Transformation {
    export interface Transformation {
      /**
       * Transformation type.
       */
      type: 'transformation';

      /**
       * Transformation string (e.g. `w-200,h-200`).
       * Same syntax as ImageKit URL-based transformations.
       */
      value: string;
    }

    export interface GifToVideo {
      /**
       * Converts an animated GIF into an MP4.
       */
      type: 'gif-to-video';

      /**
       * Optional transformation string to apply to the output video.
       * **Example**: `q-80`
       */
      value?: string;
    }

    export interface Thumbnail {
      /**
       * Generates a thumbnail image.
       */
      type: 'thumbnail';

      /**
       * Optional transformation string.
       * **Example**: `w-150,h-150`
       */
      value?: string;
    }

    export interface Abs {
      /**
       * Streaming protocol to use (`hls` or `dash`).
       */
      protocol: 'hls' | 'dash';

      /**
       * Adaptive Bitrate Streaming (ABS) setup.
       */
      type: 'abs';

      /**
       * List of different representations you want to create separated by an underscore.
       */
      value: string;
    }
  }
}