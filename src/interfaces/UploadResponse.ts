/**
 * JSON object containing metadata.
 */
export interface Metadata {
  /**
   * The audio codec used in the video (only for video).
   */
  audioCodec?: string;

  /**
   * The bit rate of the video in kbps (only for video).
   */
  bitRate?: number;

  /**
   * The density of the image in DPI.
   */
  density?: number;

  /**
   * The duration of the video in seconds (only for video).
   */
  duration?: number;

  exif?: Metadata.Exif;

  /**
   * The format of the file (e.g., 'jpg', 'mp4').
   */
  format?: string;

  /**
   * Indicates if the image has a color profile.
   */
  hasColorProfile?: boolean;

  /**
   * Indicates if the image contains transparent areas.
   */
  hasTransparency?: boolean;

  /**
   * The height of the image or video in pixels.
   */
  height?: number;

  /**
   * Perceptual hash of the image.
   */
  pHash?: string;

  /**
   * The quality indicator of the image.
   */
  quality?: number;

  /**
   * The file size in bytes.
   */
  size?: number;

  /**
   * The video codec used in the video (only for video).
   */
  videoCodec?: string;

  /**
   * The width of the image or video in pixels.
   */
  width?: number;
}

export namespace Metadata {
  export interface Exif {
    /**
     * Object containing Exif details.
     */
    exif?: Exif.Exif;

    /**
     * Object containing GPS information.
     */
    gps?: Exif.Gps;

    /**
     * Object containing EXIF image information.
     */
    image?: Exif.Image;

    /**
     * JSON object.
     */
    interoperability?: Exif.Interoperability;

    makernote?: { [key: string]: unknown };

    /**
     * Object containing Thumbnail information.
     */
    thumbnail?: Exif.Thumbnail;
  }

  export namespace Exif {
    /**
     * Object containing Exif details.
     */
    export interface Exif {
      ApertureValue?: number;

      ColorSpace?: number;

      CreateDate?: string;

      CustomRendered?: number;

      DateTimeOriginal?: string;

      ExifImageHeight?: number;

      ExifImageWidth?: number;

      ExifVersion?: string;

      ExposureCompensation?: number;

      ExposureMode?: number;

      ExposureProgram?: number;

      ExposureTime?: number;

      Flash?: number;

      FlashpixVersion?: string;

      FNumber?: number;

      FocalLength?: number;

      FocalPlaneResolutionUnit?: number;

      FocalPlaneXResolution?: number;

      FocalPlaneYResolution?: number;

      InteropOffset?: number;

      ISO?: number;

      MeteringMode?: number;

      SceneCaptureType?: number;

      ShutterSpeedValue?: number;

      SubSecTime?: string;

      WhiteBalance?: number;
    }

    /**
     * Object containing GPS information.
     */
    export interface Gps {
      GPSVersionID?: Array<number>;
    }

    /**
     * Object containing EXIF image information.
     */
    export interface Image {
      ExifOffset?: number;

      GPSInfo?: number;

      Make?: string;

      Model?: string;

      ModifyDate?: string;

      Orientation?: number;

      ResolutionUnit?: number;

      Software?: string;

      XResolution?: number;

      YCbCrPositioning?: number;

      YResolution?: number;
    }

    /**
     * JSON object.
     */
    export interface Interoperability {
      InteropIndex?: string;

      InteropVersion?: string;
    }

    /**
     * Object containing Thumbnail information.
     */
    export interface Thumbnail {
      Compression?: number;

      ResolutionUnit?: number;

      ThumbnailLength?: number;

      ThumbnailOffset?: number;

      XResolution?: number;

      YResolution?: number;
    }
  }
}

export interface ResponseMetadata {
  statusCode: number;
  requestId: string;
  headers: Record<string, string | number | boolean>;
}

/**
 * Object containing details of a successful upload.
 */
export interface UploadResponse {
  /**
   * An array of tags assigned to the uploaded file by auto tagging.
   */
  AITags?: Array<FileUploadResponse.AITag> | null;

  /**
   * The audio codec used in the video (only for video).
   */
  audioCodec?: string;

  /**
   * The bit rate of the video in kbps (only for video).
   */
  bitRate?: number;

  /**
   * Value of custom coordinates associated with the image in the format
   * `x,y,width,height`. If `customCoordinates` are not defined, then it is `null`.
   * Send `customCoordinates` in `responseFields` in API request to get the value of
   * this field.
   */
  customCoordinates?: string | null;

  /**
   * A key-value data associated with the asset. Use `responseField` in API request
   * to get `customMetadata` in the upload API response. Before setting any custom
   * metadata on an asset, you have to create the field using custom metadata fields
   * API. Send `customMetadata` in `responseFields` in API request to get the value
   * of this field.
   */
  customMetadata?: { [key: string]: unknown };

  /**
   * Optional text to describe the contents of the file. Can be set by the user or
   * the ai-auto-description extension.
   */
  description?: string;

  /**
   * The duration of the video in seconds (only for video).
   */
  duration?: number;

  /**
   * Consolidated embedded metadata associated with the file. It includes exif, iptc,
   * and xmp data. Send `embeddedMetadata` in `responseFields` in API request to get
   * embeddedMetadata in the upload API response.
   */
  embeddedMetadata?: { [key: string]: unknown };

  /**
   * Extension names with their processing status at the time of completion of the
   * request. It could have one of the following status values:
   *
   * `success`: The extension has been successfully applied. `failed`: The extension
   * has failed and will not be retried. `pending`: The extension will finish
   * processing in some time. On completion, the final status (success / failed) will
   * be sent to the `webhookUrl` provided.
   *
   * If no extension was requested, then this parameter is not returned.
   */
  extensionStatus?: FileUploadResponse.ExtensionStatus;

  /**
   * Unique fileId. Store this fileld in your database, as this will be used to
   * perform update action on this file.
   */
  fileId?: string;

  /**
   * The relative path of the file in the media library e.g.
   * `/marketing-assets/new-banner.jpg`.
   */
  filePath?: string;

  /**
   * Type of the uploaded file. Possible values are `image`, `non-image`.
   */
  fileType?: string;

  /**
   * Height of the image in pixels (Only for images)
   */
  height?: number;

  /**
   * Is the file marked as private. It can be either `true` or `false`. Send
   * `isPrivateFile` in `responseFields` in API request to get the value of this
   * field.
   */
  isPrivateFile?: boolean;

  /**
   * Is the file published or in draft state. It can be either `true` or `false`.
   * Send `isPublished` in `responseFields` in API request to get the value of this
   * field.
   */
  isPublished?: boolean;

  /**
   * Legacy metadata. Send `metadata` in `responseFields` in API request to get
   * metadata in the upload API response.
   */
  metadata?: Metadata;

  /**
   * Name of the asset.
   */
  name?: string;

  /**
   * This field is included in the response only if the Path policy feature is
   * available in the plan. It contains schema definitions for the custom metadata
   * fields selected for the specified file path. Field selection can only be done
   * when the Path policy feature is enabled.
   *
   * Keys are the names of the custom metadata fields; the value object has details
   * about the custom metadata schema.
   */
  selectedFieldsSchema?: { [key: string]: FileUploadResponse.SelectedFieldsSchema };

  /**
   * Size of the image file in Bytes.
   */
  size?: number;

  /**
   * The array of tags associated with the asset. If no tags are set, it will be
   * `null`. Send `tags` in `responseFields` in API request to get the value of this
   * field.
   */
  tags?: Array<string> | null;

  /**
   * In the case of an image, a small thumbnail URL.
   */
  thumbnailUrl?: string;

  /**
   * A publicly accessible URL of the file.
   */
  url?: string;

  /**
   * An object containing the file or file version's `id` (versionId) and `name`.
   */
  versionInfo?: FileUploadResponse.VersionInfo;

  /**
   * The video codec used in the video (only for video).
   */
  videoCodec?: string;

  /**
   * Width of the image in pixels (Only for Images)
   */
  width?: number;

  /**
   * Message indicating that the file upload is accepted. This field is only present when the upload is accepted but not yet processed.
   * This can happen when the file is being processed for pre-transformation for video.
   * The upload will be completed once the pre-transformation is done.
   */
  message?: string

  /**
   * Response metadata for debugging purposes.
   */
  readonly $ResponseMetadata: ResponseMetadata;
}

export namespace FileUploadResponse {
  export interface AITag {
    /**
     * Confidence score of the tag.
     */
    confidence?: number;

    /**
     * Name of the tag.
     */
    name?: string;

    /**
     * Array of `AITags` associated with the image. If no `AITags` are set, it will be
     * null. These tags can be added using the `google-auto-tagging` or
     * `aws-auto-tagging` extensions.
     */
    source?: string;
  }

  /**
   * Extension names with their processing status at the time of completion of the
   * request. It could have one of the following status values:
   *
   * `success`: The extension has been successfully applied. `failed`: The extension
   * has failed and will not be retried. `pending`: The extension will finish
   * processing in some time. On completion, the final status (success / failed) will
   * be sent to the `webhookUrl` provided.
   *
   * If no extension was requested, then this parameter is not returned.
   */
  export interface ExtensionStatus {
    'ai-auto-description'?: 'success' | 'pending' | 'failed';

    'ai-tasks'?: 'success' | 'pending' | 'failed';

    'aws-auto-tagging'?: 'success' | 'pending' | 'failed';

    'google-auto-tagging'?: 'success' | 'pending' | 'failed';

    'remove-bg'?: 'success' | 'pending' | 'failed';
  }

  export interface SelectedFieldsSchema {
    /**
     * Type of the custom metadata field.
     */
    type: 'Text' | 'Textarea' | 'Number' | 'Date' | 'Boolean' | 'SingleSelect' | 'MultiSelect';

    /**
     * The default value for this custom metadata field. The value should match the
     * `type` of custom metadata field.
     */
    defaultValue?: string | number | boolean | Array<string | number | boolean>;

    /**
     * Specifies if the custom metadata field is required or not.
     */
    isValueRequired?: boolean;

    /**
     * Maximum length of string. Only set if `type` is set to `Text` or `Textarea`.
     */
    maxLength?: number;

    /**
     * Maximum value of the field. Only set if field type is `Date` or `Number`. For
     * `Date` type field, the value will be in ISO8601 string format. For `Number` type
     * field, it will be a numeric value.
     */
    maxValue?: string | number;

    /**
     * Minimum length of string. Only set if `type` is set to `Text` or `Textarea`.
     */
    minLength?: number;

    /**
     * Minimum value of the field. Only set if field type is `Date` or `Number`. For
     * `Date` type field, the value will be in ISO8601 string format. For `Number` type
     * field, it will be a numeric value.
     */
    minValue?: string | number;

    /**
     * Indicates whether the custom metadata field is read only. A read only field
     * cannot be modified after being set. This field is configurable only via the
     * **Path policy** feature.
     */
    readOnly?: boolean;

    /**
     * An array of allowed values when field type is `SingleSelect` or `MultiSelect`.
     */
    selectOptions?: Array<string | number | boolean>;

    /**
     * Specifies if the selectOptions array is truncated. It is truncated when number
     * of options are > 100.
     */
    selectOptionsTruncated?: boolean;
  }

  /**
   * An object containing the file or file version's `id` (versionId) and `name`.
   */
  export interface VersionInfo {
    /**
     * Unique identifier of the file version.
     */
    id?: string;

    /**
     * Name of the file version.
     */
    name?: string;
  }
}