import respond from "../utils/respond";
import errorMessages from "../constants/errorMessages"
import { ImageKitOptions, UploadResponse } from "../interfaces";
import IKResponse from "../interfaces/IKResponse";

interface SignatureResponse {
    signature: string
    expire: number
    token: string
}

function getResponseHeaderMap(xhr: XMLHttpRequest) {
    const headers: Record<string, string | number | boolean> = {};
    const responseHeaders = xhr.getAllResponseHeaders();
    if (Object.keys(responseHeaders).length) {
        responseHeaders
        .trim()
        .split(/[\r\n]+/)
        .map(value => value.split(/: /))
        .forEach(keyValue => {
          headers[keyValue[0].trim()] = keyValue[1].trim();
        });
    }
    return headers;
}

const addResponseHeadersAndBody = (body: any, xhr: XMLHttpRequest):IKResponse<UploadResponse> => {
    let response = { ...body };
    const responseMetadata = {
        statusCode: xhr.status,
        headers: getResponseHeaderMap(xhr)
    }
    Object.defineProperty(response, "$ResponseMetadata", {
        value: responseMetadata,
        enumerable: false,
        writable: false
    });
    return response as IKResponse<UploadResponse>;
}

export const request = (uploadFileXHR: XMLHttpRequest,formData: FormData, options: ImageKitOptions & { authenticationEndpoint: string }, callback?: (err: Error | null, response: UploadResponse | null) => void) => {
    generateSignatureToken(options, (err, signaturObj) => {
        if (err) {
            return respond(true, err, callback)
        } else {
            formData.append("signature", signaturObj?.signature || "");
            formData.append("expire", String(signaturObj?.expire || 0));
            formData.append("token", signaturObj?.token || "");

            uploadFile(uploadFileXHR, formData, (err, responseSucessText) => {
                if (err) {
                    return respond(true, err, callback)
                }
                return respond(false, responseSucessText!, callback)
            });
        }
    });
    return uploadFileXHR;
}

export const generateSignatureToken = (options: ImageKitOptions & { authenticationEndpoint: string }, callback: (err: Error | null, response: SignatureResponse | null) => void) => {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 60000;
    xhr.open('GET', options.authenticationEndpoint);
    xhr.ontimeout = function (e) {
        var body = errorMessages.AUTH_ENDPOINT_TIMEOUT;
        var result = addResponseHeadersAndBody(body, xhr);
        respond(true, result, callback);
    };
    xhr.onerror = function() {
        var body = errorMessages.AUTH_ENDPOINT_NETWORK_ERROR;
        var result = addResponseHeadersAndBody(body, xhr);
        respond(true, result, callback);
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
                var result = addResponseHeadersAndBody(obj, xhr);
                respond(false, result, callback);
            } catch (ex) {
                respond(true, ex, callback)
            }
        } else {
            try {
                var error = JSON.parse(xhr.responseText);
                var result = addResponseHeadersAndBody(error, xhr);
                respond(true, error, callback);
            } catch (ex) {
                respond(true, ex, callback);
            }
        }
    };
    xhr.send();
    return;
}

export const uploadFile = (uploadFileXHR:XMLHttpRequest, formData: FormData, callback: (err: Error | IKResponse<UploadResponse> | null, response: UploadResponse | null) => void) => {
    uploadFileXHR.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');
    uploadFileXHR.onerror = function() {
        var body = errorMessages.UPLOAD_ENDPOINT_NETWORK_ERROR;
        var result = addResponseHeadersAndBody(body, uploadFileXHR);
        respond(true, result, callback);
        return;
    }
    uploadFileXHR.onload = function () {
        if (uploadFileXHR.status === 200) {
            var body = JSON.parse(uploadFileXHR.responseText);
            var uploadResponse = addResponseHeadersAndBody(body, uploadFileXHR);
            callback(null, uploadResponse);
        }
        else if (uploadFileXHR.status !== 200) {
            try {
              var body = JSON.parse(uploadFileXHR.responseText);
              var uploadResponse = addResponseHeadersAndBody(body, uploadFileXHR);
              callback(uploadResponse, null);
            } catch (ex : any) {
              callback(ex, null);
            }
        }
    };
    uploadFileXHR.send(formData);
}

