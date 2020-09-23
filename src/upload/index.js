import errorMessages from "../constants/errorMessages"
import respond from "../utils/respond";
import { request } from "../utils/request";

export const upload = (uploadOptions, options, callback) => {
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

    var formData = new FormData();
    for (var i in uploadOptions) {
        formData.append(i, uploadOptions[i]);
    }
    formData.append("publicKey", options.publicKey)

    request(formData, options, callback);
};