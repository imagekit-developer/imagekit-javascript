import errorMessages from "../constants/errorMessages";
import respond from "../utils/respond";
import { request } from "../utils/request";
import { ImageKitOptions, UploadOptions, UploadResponse } from "../interfaces";

export const upload = (
  xhr: XMLHttpRequest,
  uploadOptions: UploadOptions,
  options: ImageKitOptions,
  callback?: (err: Error | null, response: UploadResponse | null) => void,
) => {
  if (!uploadOptions) {
    respond(true, errorMessages.INVALID_UPLOAD_OPTIONS, callback);
    return;
  }

  if (!uploadOptions.file) {
    respond(true, errorMessages.MISSING_UPLOAD_FILE_PARAMETER, callback);
    return;
  }

  if (!uploadOptions.fileName) {
    respond(true, errorMessages.MISSING_UPLOAD_FILENAME_PARAMETER, callback);
    return;
  }

  if (!options.authenticationEndpoint) {
    respond(true, errorMessages.MISSING_AUTHENTICATION_ENDPOINT, callback);
    return;
  }

  if (!options.publicKey) {
    respond(true, errorMessages.MISSING_PUBLIC_KEY, callback);
    return;
  }

  if(uploadOptions.tags && Array.isArray(uploadOptions.tags))
  {
    uploadOptions.tags = String(uploadOptions.tags);
  }
  
  var formData = new FormData();
  let i: keyof typeof uploadOptions;
  for (i in uploadOptions) {
    const param = uploadOptions[i];
    if (typeof param !== "undefined") {
      if (typeof param === "string" || typeof param === "boolean")  {
        formData.append(i, String(param));
      } 
      else if(Array.isArray(param)) {
        formData.append(i, JSON.stringify(param));
      }
      else if(typeof param === "object" && !(param instanceof File || param instanceof Blob)) {
        formData.append(i, JSON.stringify(param));
      }
      else {
        formData.append(i, param);
      }
    }
  }

  formData.append("publicKey", options.publicKey);

  request(xhr, formData, { ...options, authenticationEndpoint: options.authenticationEndpoint }, callback);
};
