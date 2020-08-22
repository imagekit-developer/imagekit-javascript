import errorMessages from "../constants/errorMessages"
import respond from "../utils/respond";
import { request } from "../utils/request";

export const upload = (uploadOptions, defaultOptions, callback) => {
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

    if (!defaultOptions.authenticationEndpoint) {
        respond(true, errorMessages.MISSING_AUTHENTICATION_ENDPOINT, callback);
        return;
    }

    var formData = new FormData();
    for (var i in uploadOptions) {
        formData.append(i, uploadOptions[i]);
    }
    formData.append("publicKey", defaultOptions.publicKey)

    request(formData, defaultOptions, callback);
};