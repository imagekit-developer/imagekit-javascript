import respond from "../utils/respond";
import errorMessages from "../constants/errorMessages"
import { ImageKitOptions, UploadResponse } from "../interfaces";

interface SignatureResponse {
    signature: string
    expire: number
    token: string
}

export const request = (formData: FormData, options: ImageKitOptions & { authenticationEndpoint: string }, callback?: (err: Error | null, response: UploadResponse | null) => void) => {
    generateSignatureToken(options, (err, signaturObj) => {
        if (err) {
            return respond(true, err, callback)
        } else {
            formData.append("signature", signaturObj?.signature || "");
            formData.append("expire", String(signaturObj?.expire || 0));
            formData.append("token", signaturObj?.token || "");

            uploadFile(formData, (err, responseSucessText) => {
                if (err) {
                    return respond(true, err, callback)
                }
                return respond(false, responseSucessText!, callback)
            });
        }
    });
}

export const generateSignatureToken = (options: ImageKitOptions & { authenticationEndpoint: string }, callback: (err: Error | null, response: SignatureResponse | null) => void) => {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 60000;
    xhr.open('GET', options.authenticationEndpoint);
    xhr.ontimeout = function (e) {
        respond(true, errorMessages.AUTH_ENDPOINT_TIMEOUT, callback);
    };
    xhr.onerror = function() {
        respond(true, errorMessages.AUTH_ENDPOINT_NETWORK_ERROR, callback);
    }
    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                var body = JSON.parse(xhr.responseText);
                var obj = {
                    signature: body.signature,
                    expire: body.expire,
                    token: body.token
                }
                respond(false, obj, callback)
            } catch (ex) {
                respond(true, ex, callback)
            }
        } else {
            try {
                var error = JSON.parse(xhr.responseText);
                respond(true, error, callback);
            } catch (ex) {
                respond(true, ex, callback);
            }
        }
    };
    xhr.send();
    return;
}

export const uploadFile = (formData: FormData, callback: (err: Error | null, response: UploadResponse | null) => void) => {
    var uploadFileXHR = new XMLHttpRequest();
    uploadFileXHR.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');
    uploadFileXHR.onerror = function() {
        respond(true, errorMessages.UPLOAD_ENDPOINT_NETWORK_ERROR, callback);
        return;
    }
    uploadFileXHR.onload = function () {
        if (uploadFileXHR.status === 200) {
            var uploadResponse = JSON.parse(uploadFileXHR.responseText);
            callback(null, uploadResponse);
        }
        else if (uploadFileXHR.status !== 200) {
            try {
              callback(JSON.parse(uploadFileXHR.responseText), null);
            } catch (ex : any) {
              callback(ex, null);
            }
        }
    };
    uploadFileXHR.send(formData);
    return
}

