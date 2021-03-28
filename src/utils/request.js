import respond from "../utils/respond";
import errorMessages from "../constants/errorMessages"

export const request = (formData, options, callback) => {
    generateSignatureToken(options, function (err, signaturObj) {
        if (err) {
            if (typeof callback != "function") return;
            callback(err, null);
            return;
        } else {
            formData.append("signature", signaturObj.signature || "");
            formData.append("expire", signaturObj.expire || 0);
            formData.append("token", signaturObj.token);

            uploadFile(formData, function (err, responseSucessText) {
                if (err) {
                    if (typeof callback != "function") return;
                    callback(err, null);
                } else {
                    callback(null, responseSucessText);
                }
            });
        }
    });
}

export const generateSignatureToken = (options, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 60000;
    xhr.open('GET', options.authenticationEndpoint);
    xhr.ontimeout = function (e) {
        if (typeof callback != "function") return;
        respond(true, errorMessages.AUTH_ENDPOINT_TIMEOUT, callback);
        return;
    };
    xhr.onerror = function() {
        respond(true, errorMessages.AUTH_ENDPOINT_NETWORK_ERROR, callback);
        return;
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
                callback(null, obj);
                return;
            } catch (ex) {
                if (typeof callback != "function") return;
                callback(ex);
            }
        } else {
            try {
                var error = JSON.parse(xhr.responseText);
                if (typeof callback != "function") return;
                callback(error);
            } catch (ex) {
                if (typeof callback != "function") return;
                callback(ex);
            }
        }
    };
    xhr.send();
    return;
}

export const uploadFile = (formData, callback) => {
    var uploadFileXHR = new XMLHttpRequest();
    uploadFileXHR.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');
    uploadFileXHR.onerror = function() {
        respond(true, errorMessages.UPLOAD_ENDPOINT_NETWORK_ERROR, callback);
        return;
    }
    uploadFileXHR.onload = function () {
        if (uploadFileXHR.status === 200) {
            if (typeof callback != "function") return;
            var uploadResponse = JSON.parse(uploadFileXHR.responseText);
            callback(null, uploadResponse);
        }
        else if (uploadFileXHR.status !== 200) {
            if (typeof callback != "function") return;
            try {
              callback(JSON.parse(uploadFileXHR.responseText));
            } catch (ex) {
              callback(ex);
            }
        }
    };
    uploadFileXHR.send(formData);
    return
}

