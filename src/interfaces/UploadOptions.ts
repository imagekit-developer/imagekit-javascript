interface TransformationObject {
  type: "transformation";
  value: string;
}

interface GifToVideoOrThumbnailObject {
  type: "gif-to-video" | "thumbnail";
  value?: string;
}

interface AbsObject {
  type: "abs";
  value: string;
  protocol: "hls" | "dash";
}

type PostTransformation = TransformationObject | GifToVideoOrThumbnailObject | AbsObject;

interface Transformation {
  /**
   * Specifies pre-transformations to be applied. Must be a valid string of transformations like "w-300,h-300".
   * Refer to the docs for more details on transformations.
   *
   * {@link https://imagekit.io/docs/dam/pre-and-post-transformation-on-upload#pre-transformation}
   */
  pre?: string;

  /**
   * Specifies post-transformations to be applied. This is an array of transformation objects, each with:
   *  - type: One of "transformation", "gif-to-video", "thumbnail", or "abs".
   *  - value: A valid transformation string required if "type" is "transformation" or "abs". Optional if "type" is "gif-to-video" or "thumbnail".
   *  - protocol: Used only when type is "abs". Can be "hls" or "dash".
   *
   * Refer to the docs for more details on transformations and usage in post.
   *
   * {@link https://imagekit.io/docs/dam/pre-and-post-transformation-on-upload#post-transformation}
   */
  post?: PostTransformation[];
}

/**
 * Options used when uploading a file using the V1 API.
 * Check out the official documentation:
 * {@link https://imagekit.io/docs/api-reference/upload-file/upload-file}
 */
export interface UploadOptions {
  /**
   * This field accepts three main input formats for the file content:
   * - "binary": Directly pass the binary data. Typically used when uploading via the browser using a File or Blob.
   * - "base64": A base64-encoded string of the file content.
   * - "url": A direct URL from which ImageKit server will download the file and upload.
   */
  file: string | Blob | File;

  /**
   * The name with which the file should be uploaded.
   * - Valid characters: alphanumeric (a-z, A-Z, 0-9, including Unicode letters and numerals) and the special chars ". _ -"
   * - Any other character (including space) is replaced with "_"
   *
   * Example: "company_logo.png"
   */
  fileName: string;

  /**
   * The HMAC-SHA1 digest of the concatenation of "token + expire". The signing key is your ImageKit private API key.
   * Required for client-side authentication. Must be computed on the server side.
   * Calculate this signature in your secure server and pass it to the client.
   */
  signature: string;

  /**
   * A unique value to identify and prevent replays. Typically a UUID (e.g., version 4).
   * Each request must carry a fresh token. The server rejects reused tokens, even if the original request failed.
   */
  token: string;

  /**
   * A Unix timestamp in seconds, less than 1 hour in the future.
   */
  expire: number;

  /**
   * The public API key of your ImageKit account. You can find it in the [ImageKit dashboard](https://imagekit.io/dashboard/developer/api-keys).
   */
  publicKey: string;

  /**
   * Whether to use a unique filename for this file or not.
   * - Accepts true or false.
   * - If set true, ImageKit.io will add a unique suffix to the filename parameter to get a unique filename.
   * - If set false, then the image is uploaded with the provided filename parameter and any existing file with the same name is replaced.
   * Default value - true
   */
  useUniqueFileName?: boolean;

  /**
   * Optionally set tags on the uploaded file.
   * If passing an array, the SDK automatically joins them into a comma-separated string when sending to the server.
   * Example: ["t-shirt", "round-neck", "men"] => "t-shirt,round-neck,men"
   */
  tags?: string | string[];

  /**
   * The folder path where the file will be stored, e.g., "/images/folder/".
   * - If the path doesn't exist, it is created on-the-fly.
   * - Nested folders are supported by using multiple "/".
   * - Default: "/"
   */
  folder?: string;

  /**
   * Whether to mark the file as private (only relevant for image uploads).
   * A private file requires signed URLs or named transformations for access.
   * Default: false
   */
  isPrivateFile?: boolean;

  /**
   * A string in "x,y,width,height" format that defines the region of interest in an image (top-left coords and area size).
   * Example: "10,10,100,100".
   */
  customCoordinates?: string;

  /**
   * A comma-separated or array-based set of fields to return in the upload response.
   * Example: "tags,customCoordinates,isPrivateFile,metadata"
   */
  responseFields?: string | string[];

  /**
   * An array of extension objects to apply to the image, e.g. background removal, auto-tagging, etc.
   * The SDK will JSON-stringify this array automatically before sending.
   */
  extensions?: object[];

  /**
   * A webhook URL to receive the final status of any pending extensions once they've completed processing.
   */
  webhookUrl?: string;

  /**
   * Defaults to true. If false, and "useUniqueFileName" is also false, the API immediately fails if a file with the same name/folder already exists.
   */
  overwriteFile?: boolean;

  /**
   * Defaults to true. If true, and an existing file is found at the same location, its AITags are removed. Set to false to keep existing AITags.
   */
  overwriteAITags?: boolean;

  /**
   * Defaults to true. If no tags are specified in the request, existing tags are removed from overwritten files. Setting to false has no effect if the request includes tags.
   */
  overwriteTags?: boolean;

  /**
   * Defaults to true. If no customMetadata is specified in the request, existing customMetadata is removed from overwritten files. Setting to false has no effect if the request specifies customMetadata.
   */
  overwriteCustomMetadata?: boolean;

  /**
   * A stringified JSON or an object containing custom metadata fields to store with the file.
   * Custom metadata fields must be pre-defined in your ImageKit configuration.
   */
  customMetadata?: string | Record<string, string | number | boolean | Array<string | number | boolean>>;

  /**
   * Defines pre and post transformations to be applied to the file during upload. The SDK enforces certain validation rules for pre/post transformations.
   * For details, see:
   * {@link https://imagekit.io/docs/dam/pre-and-post-transformation-on-upload}
   */
  transformation?: Transformation;

  /**
   * An optional XMLHttpRequest instance for the upload. The SDK merges it with its own logic to handle progress events, etc.
   * You can listen to `progress` or other events on this object for custom logic.
   */
  xhr?: XMLHttpRequest;

  /**
   * A string specifying the checks to be performed server-side before uploading to the media library, e.g. size or mime type checks.
   * For format details, see: {@link https://imagekit.io/docs/api-reference/upload-file/upload-file#upload-api-checks}
   */
  checks?: string;

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
