import { ImageKitOptions } from "./ImageKitOptions";
import { TransformationPosition } from "./Transformation";
import { UploadOptions } from "./UploadOptions";
import { UploadResponse, FileType } from "./UploadResponse";
import { UrlOptions } from "./UrlOptions";
export interface IImageKit {
  options: ImageKitOptions;
  url: (urlOptions: UrlOptions) => string;
  upload: (
    uploadOptions: UploadOptions,
    callback?: (err: Error | null, response: UploadResponse | null) => void,
    options?: Partial<ImageKitOptions>,
  ) => void;
}

export { ImageKitOptions, TransformationPosition, UploadOptions, UploadResponse, FileType, UrlOptions };
