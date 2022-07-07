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

const addResponseHeadersAndBody = (body: any, xhr: XMLHttpRequest): IKResponse<UploadResponse> => {
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

export const request = (
    uploadFileXHR: XMLHttpRequest,
    formData: FormData,
    options: ImageKitOptions & { authenticationEndpoint: string },
    callback?: (err: Error | null, response: UploadResponse | null) => void) => {

    generateSignatureToken(options.authenticationEndpoint).then((signaturObj) => {
        formData.append("signature", signaturObj.signature);
        formData.append("expire", String(signaturObj.expire));
        formData.append("token", signaturObj.token);

        uploadFile(uploadFileXHR, formData).then((result) => {
            return respond(false, result, callback);
        }, (ex) => {
            return respond(true, ex, callback);
        });
    }, (ex) => {
        return respond(true, ex, callback);
    });
}

export const generateSignatureToken = (
    authenticationEndpoint: string
): Promise<SignatureResponse> => {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.timeout = 60000;
        var urlObj = new URL(authenticationEndpoint);
        urlObj.searchParams.set("t", Math.random().toString());
        xhr.open('GET', urlObj.toString());
        xhr.ontimeout = function (e) {
            return reject(errorMessages.AUTH_ENDPOINT_TIMEOUT);
        };
        xhr.onerror = function () {
            return reject(errorMessages.AUTH_ENDPOINT_NETWORK_ERROR);
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
                    if (!obj.signature || !obj.expire || !obj.token) {
                        return reject(errorMessages.AUTH_INVALID_RESPONSE);
                    }
                    return resolve(obj);
                } catch (ex) {
                    return reject(errorMessages.AUTH_INVALID_RESPONSE);
                }
            } else {
                return reject(errorMessages.AUTH_INVALID_RESPONSE);
            }
        };
        xhr.send();
    });
}

export const uploadFile = (
    uploadFileXHR: XMLHttpRequest,
    formData: FormData
): Promise<IKResponse<UploadResponse> | Error> => {
    return new Promise((resolve, reject) => {
        uploadFileXHR.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');
        uploadFileXHR.onerror = function (e) {
            return reject(errorMessages.UPLOAD_ENDPOINT_NETWORK_ERROR);
        }
        uploadFileXHR.onload = function () {
            if (uploadFileXHR.status === 200) {
                try {
                    var body = JSON.parse(uploadFileXHR.responseText);
                    var uploadResponse = addResponseHeadersAndBody(body, uploadFileXHR);
                    return resolve(uploadResponse);
                } catch (ex: any) {
                    return reject(ex);
                }
            } else {
                try {
                    var body = JSON.parse(uploadFileXHR.responseText);
                    var uploadError = addResponseHeadersAndBody(body, uploadFileXHR);
                    return reject(uploadError)
                } catch (ex: any) {
                    return reject(ex);
                }
            }
        };
        uploadFileXHR.send(formData);
    });
}