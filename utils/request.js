function request (formData, defaultOptions, callback) {
    module.exports.generateSignatureToken(defaultOptions, function (err, signaturObj) {
        if (err) {
            console.log(err);
            if(typeof callback != "function") return;
            callback(err);
            return;
        } else {
            formData.append("signature", signaturObj.signature || "");
            formData.append("expire", signaturObj.expire || 0);
            formData.append("token", signaturObj.token);

            module.exports.uploadFile(formData, function(err, responseSucessText) {
                if (err) {
                    console.log(err);
                    if(typeof callback != "function") return;
                    callback(err);
                } else {
                    callback(null, responseSucessText);
                }
            });
        }
    });
}

function _generateSignatureToken(defaultOptions, callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = 60000;
    xhr.open('GET', defaultOptions.authenticationEndpoint);
    xhr.ontimeout = function (e) {
        if(typeof callback != "function") return;
        callback("The authenticationEndpoint you provided timed out in 60 seconds");
    };
    xhr.onload = function() {
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
            } catch(ex) {
                if(typeof callback != "function") return;
                callback(ex);
            }
        } else {
            try {
                var error = JSON.parse(xhr.responseText);
                if(typeof callback != "function") return;
                callback(error);
            } catch (ex) {
                if(typeof callback != "function") return;
                callback(ex);
            }
        }
    };
    xhr.send();
    return;
}

function _uploadFile (formData, callback) {
    var uploadFileXHR= new XMLHttpRequest();
    uploadFileXHR.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');
    uploadFileXHR.onload = function() {
        if (uploadFileXHR.status === 200) {
            if(typeof callback != "function") return;
            var uploadResponse = JSON.parse(uploadFileXHR.responseText);
            callback(null, uploadResponse);
        }
        else if (uploadFileXHR.status !== 200) {
            if(typeof callback != "function") return;
            callback(JSON.parse(uploadFileXHR.responseText));
        }
    };
    uploadFileXHR.send(formData);
    return
}

module.exports = {
    request : request,
    generateSignatureToken: _generateSignatureToken,
    uploadFile: _uploadFile,
}
