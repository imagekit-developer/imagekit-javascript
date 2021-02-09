// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/tree/08f078e1e0d3da2f2dde1a71fb8d66b71971413d/types/imagekit

export = ImageKit;

declare global {
  class ImageKit {
    constructor(opts: {
      publicKey: string;
      urlEndpoint: string;
      authenticationEndpoint?: string;
      transformationPosition?: ImageKit.TransformationPosition;
    });

    /**
     * You can add multiple origins in the same ImageKit.io account.
     * URL endpoints allow you to configure which origins are accessible through your account and set their preference order as well.
     *
     * @see {@link https://docs.imagekit.io/integration/url-endpoints}
     *
     * @param urlOptions
     */
    url(urlOptions: ImageKit.UrlOptions): string;

    /**
     * You can upload files to ImageKit.io media library from your server-side using private API key authentication.
     *
     * File size limit
     * The maximum upload file size is limited to 25MB.
     *
     * @see {@link https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload}
     *
     * @param uploadOptions
     * @param callback
     * @param options??
     */
    upload(
        uploadOptions: ImageKit.UploadOptions,
        callback: (err: Error, response: ImageKit.UploadResponse) => void,
        options?: any
    ): void;
  }

  namespace ImageKit {
    export type TransformationPosition = 'path' | 'query';
    /**
     * Type of files to include in result set. Accepts three values:
     * all - include all types of files in result set
     * image - only search in image type files
     * non-image - only search in files which are not image, e.g., JS or CSS or video files.
     *
     * @see {@link https://docs.imagekit.io/api-reference/media-api/list-and-search-files}
     */
    export type FileType = 'all' | 'image' | 'non-image';

    /**
     * @see {@link https://docs.imagekit.io/features/image-transformations}
     */
    export interface Transformation {
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#width-w}
       */
      height?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#height-h}
       */
      width?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#aspect-ratio-ar}
       */
      aspectRatio?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#quality-q}
       */
      quality?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#crop-crop-modes-and-focus}
       */
      crop?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#crop-crop-modes-and-focus}
       */
      cropMode?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#focus-fo}
       */
      focus?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#examples-focus-using-cropped-image-coordinates}
       */
      x?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#examples-focus-using-cropped-image-coordinates}
       */
      y?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#format-f}
       */
      format?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#radius-r}
       */
      radius?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#background-color-bg}
       */
      background?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#border-b}
       */
      border?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#rotate-rt}
       */
      rotation?: number;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#blur-bl}
       */
      blur?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#named-transformation-n}
       */
      named?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/overlay#overlay-image-oi}
       */
      overlayImage?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/overlay#overlay-x-position-ox}
       */
      overlayX?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/overlay#overlay-y-position-oy}
       */
      overlayY?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/overlay#overlay-focus-ofo}
       */
      overlayFocus?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/overlay#overlay-height-oh}
       */
      overlayHeight?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/overlay#overlay-width-ow}
       */
      overlayWidth?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/overlay#overlay-text-ot}
       */
      overlayText?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/overlay#overlay-text-size-ots}
       */
      overlayTextFontSize?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/overlay#overlay-text-color-otc}
       */
      overlayTextColor?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/overlay#overlay-transparency-oa}
       */
      overlayAlpha?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/overlay#overlay-text-typography-ott}
       */
      overlayTextTypography?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/overlay#overlay-background-obg}
       */
      overlayBackground?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/overlay#trimming-of-the-overlay-image}
       */
      overlayImageTrim?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#progressive-image-pr}
       */
      progressive?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#lossless-webp-and-png-lo}
       */
      lossless?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#trim-edges-t}
       */
      trim?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#image-metadata-md}
       */
      metadata?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#color-profile-cp}
       */
      colorProfile?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#default-image-di}
       */
      defaultImage?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#dpr-dpr}
       */
      dpr?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/image-enhancement-and-color-manipulation#sharpen-e-sharpen}
       */
      effectSharpen?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/image-enhancement-and-color-manipulation#unsharp-mask-e-usm}
       */
      effectUSM?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/image-enhancement-and-color-manipulation#contrast-stretch-e-contrast}
       */
      effectContrast?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#grayscale-e-grayscale}
       */
      effectGray?: string;
      /**
       * @see {@link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#original-image-orig}
       */
      original?: string;
    }

    export interface UrlOptionsBase {
      /**
       * An array of objects specifying the transformations to be applied in the URL.
       * The transformation name and the value should be specified as a key-value pair in each object.
       * @see {@link https://docs.imagekit.io/features/image-transformations/chained-transformations}
       */
      transformation?: Transformation[];
      /**
       * Default value is path that places the transformation string as a path parameter in the URL.
       * Can also be specified as query which adds the transformation string as the query parameter tr in the URL.
       * If you use src parameter to create the URL, then the transformation string is always added as a query parameter.
       */
      transformationPosition?: TransformationPosition;
      /**
       * These are the other query parameters that you want to add to the final URL.
       * These can be any query parameters and not necessarily related to ImageKit.
       * Especially useful, if you want to add some versioning parameter to your URLs.
       */
      queryParameters?: { [key: string]: string | number };
      /**
       * The base URL to be appended before the path of the image.
       * If not specified, the URL Endpoint specified at the time of SDK initialization is used.
       */
      urlEndpoint?: string;
      /**
       * Default is false. If set to true, the SDK generates a signed image URL adding the image signature to the image URL.
       * If you are creating URL using src parameter instead of path then do correct urlEndpoint for this to work.
       * Otherwise returned URL will have wrong signature.
       */
      signed?: boolean;
      /**
       * Meant to be used along with the signed parameter to specify the time in seconds from now when the URL should expire.
       * If specified, the URL contains the expiry timestamp in the URL and the image signature is modified accordingly.
       */
      expireSeconds?: number;
    }

    export interface UrlOptionsSrc extends UrlOptionsBase {
      /**
       * Conditional. This is the complete URL of an image already mapped to ImageKit.
       * For example, https://ik.imagekit.io/your_imagekit_id/endpoint/path/to/image.jpg.
       * Either the path or src parameter need to be specified for URL generation.
       */
      src: string;
      path?: never;
    }

    export interface UrlOptionsPath extends UrlOptionsBase {
      /**
       * Conditional. This is the path at which the image exists.
       * For example, /path/to/image.jpg. Either the path or src parameter need to be specified for URL generation.
       */
      path: string;
      src?: never;
    }

    /**
     * Options for generating an URL
     *
     * @see {@link https://github.com/imagekit-developer/imagekit-nodejs#url-generation}
     */
    export type UrlOptions = UrlOptionsSrc | UrlOptionsPath;

    /**
     * Options used when uploading a file
     *
     * @see {@link https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload#request-structure-multipart-form-data}
     */
    export interface UploadOptions {
      /**
       * This field accepts three kinds of values:
       * - binary - You can send the content of the file as binary. This is used when a file is being uploaded from the browser.
       * - base64 - Base64 encoded string of file content.
       * - url - URL of the file from where to download the content before uploading.
       *      Downloading file from URL might take longer, so it is recommended that you pass the binary or base64 content of the file.
       *      Pass the full URL, for example - https://www.example.com/rest-of-the-image-path.jpg.
       */
      file: string | Buffer | File;
      /**
       * The name with which the file has to be uploaded.
       * The file name can contain:
       * - Alphanumeric Characters: a-z , A-Z , 0-9
       * - Special Characters: . _ and -
       * Any other character including space will be replaced by _
       */
      fileName: string;
      /**
       * Whether to use a unique filename for this file or not.
       * - Accepts true or false.
       * - If set true, ImageKit.io will add a unique suffix to the filename parameter to get a unique filename.
       * - If set false, then the image is uploaded with the provided filename parameter and any existing file with the same name is replaced.
       * Default value - true
       */
      useUniqueFileName?: boolean;
      /**
       * Set the tags while uploading the file.
       * - Comma-separated value of tags in format tag1,tag2,tag3. For example - t-shirt,round-neck,men
       * - The maximum length of all characters should not exceed 500.
       * - % is not allowed.
       * - If this field is not specified and the file is overwritten then the tags will be removed.
       */
      tags?: string;
      /**
       * The folder path (e.g. /images/folder/) in which the image has to be uploaded. If the folder(s) didn't exist before, a new folder(s) is created.
       * The folder name can contain:
       * - Alphanumeric Characters: a-z , A-Z , 0-9
       * - Special Characters: / _ and -
       * - Using multiple / creates a nested folder.
       * Default value - /
       */
      folder?: string;
      /**
       * Whether to mark the file as private or not. This is only relevant for image type files.
       * - Accepts true or false.
       * - If set true, the file is marked as private which restricts access to the original image URL and unnamed image transformations without signed URLs.
       *      Without the signed URL, only named transformations work on private images
       * Default value - false
       */
      isPrivateFile?: boolean;
      /**
       * Define an important area in the image. This is only relevant for image type files.
       * To be passed as a string with the x and y coordinates of the top-left corner, and width and height of the area of interest in format x,y,width,height. For example - 10,10,100,100
       * Can be used with fo-customtransformation.
       * If this field is not specified and the file is overwritten, then customCoordinates will be removed.
       */
      customCoordinates?: string;
      /**
       * Comma-separated values of the fields that you want ImageKit.io to return in response.
       *
       * For example, set the value of this field to tags,customCoordinates,isPrivateFile,metadata to get value of tags, customCoordinates, isPrivateFile , and metadata in the response.
       */
      responseFields?: string;
    }

    /**
     * Response from uploading a file
     *
     * @see {@link https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload#response-code-and-structure-json}
     */
    export interface UploadResponse {
      /**
       * Unique fileId. Store this fileld in your database, as this will be used to perform update action on this file.
       */
      fileId: string;
      /**
       * The name of the uploaded file.
       */
      name: string;
      /**
       * The URL of the file.
       */
      url: string;
      /**
       * In case of an image, a small thumbnail URL.
       */
      thumbnailUrl: string;
      /**
       * Height of the uploaded image file. Only applicable when file type is image.
       */
      height: number;
      /**
       * Width of the uploaded image file. Only applicable when file type is image.
       */
      width: number;
      /**
       * Size of the uploaded file in bytes.
       */
      size: number;
      /**
       * Type of file. It can either be image or non-image.
       */
      fileType: FileType;
      /**
       * The path of the file uploaded. It includes any folder that you specified while uploading.
       */
      filePath: string;
      /**
       * Array of tags associated with the image.
       */
      tags?: string[];
      /**
       * Is the file marked as private. It can be either true or false.
       */
      isPrivateFile: boolean;
      /**
       * Value of custom coordinates associated with the image in format x,y,width,height.
       */
      customCoordinates: string | null;
      /**
       * The metadata of the upload file. Use responseFields property in request to get the metadata returned in response of upload API.
       */
      metadata?: string;
    }
  }
}
