import respond from "../utils/respond";
import errorMessages from "../constants/errorMessages"
import { ImageKitOptions, UploadResponse, JwtRequestOptions } from "../interfaces";
import IKResponse from "../interfaces/IKResponse";

interface SignatureResponse {
    signature: string
    expire: number
    token: string
}

interface JwtResponse {
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
    jwtRequestOptions: JwtRequestOptions,
    options: ImageKitOptions & { authenticationEndpoint: string },
    callback?: (err: Error | null, response: UploadResponse | null) => void) => {

    if (options.apiVersion === 'v2') {
        getJwt(options.authenticationEndpoint, jwtRequestOptions).then((tokenObj) => {
            formData.append("token", tokenObj.token);

            uploadFile(uploadFileXHR, formData, options.apiVersion).then((result) => {
                return respond(false, result, callback);
            }, (ex) => {
                return respond(true, ex, callback);
            });
        }, (ex) => {
            return respond(true, ex, callback);
        });
        return
    }

    generateSignatureToken(options.authenticationEndpoint).then((signaturObj) => {
        formData.append("signature", signaturObj.signature);
        formData.append("expire", String(signaturObj.expire));
        formData.append("token", signaturObj.token);
        formData.append("publicKey", String(options.publicKey));

        uploadFile(uploadFileXHR, formData).then((result) => {
            return respond(false, result, callback);
        }, (ex) => {
            return respond(true, ex, callback);
        });
    }, (ex) => {
        return respond(true, ex, callback);
    });
}

export const getJwt = (
    authenticationEndpoint: string,
    jwtRequestOptions: JwtRequestOptions
): Promise<JwtResponse> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.timeout = 60000;
        xhr.open('POST', authenticationEndpoint);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.ontimeout = function (e) {
            return reject(errorMessages.AUTH_ENDPOINT_TIMEOUT);
        };
        xhr.onerror = function () {
            return reject(errorMessages.AUTH_ENDPOINT_NETWORK_ERROR);
        }
        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    const body = JSON.parse(xhr.responseText);
                    const obj = {
                        token: body.token
                    }
                    if (!obj.token) {
                        return reject(errorMessages.AUTH_INVALID_RESPONSE_V2);
                    }
                    return resolve(obj);
                } catch (ex) {
                    return reject(errorMessages.AUTH_INVALID_RESPONSE_V2);
                }
            } else {
                return reject(errorMessages.AUTH_INVALID_RESPONSE_V2);
            }
        };
        xhr.send(JSON.stringify(jwtRequestOptions));
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
    formData: FormData,
    apiVersion?: "v2",
): Promise<IKResponse<UploadResponse> | Error> => {
    return new Promise((resolve, reject) => {
        const uploadUrl = apiVersion === 'v2' ? 'https://upload.imagekit.io/api/v2/files/upload' : 'https://upload.imagekit.io/api/v1/files/upload'
        uploadFileXHR.open('POST', uploadUrl);
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