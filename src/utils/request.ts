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
    callback?: (err: Error | null, response: UploadResponse | null) => void) => {
        
    uploadFile(uploadFileXHR, formData).then((result) => {
        return respond(false, result, callback);
    }, (ex) => {
        return respond(true, ex, callback);
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
