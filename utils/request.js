

module.exports = function(formData, defaultOptions, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', defaultOptions.authenticationEndpoint);
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                var body = JSON.parse(xhr.responseText);
                formData.append("signature", body.signature || "");
                formData.append("expire", body.expire || 0);
                formData.append("token", body.token);

                var uploadFileXHR= new XMLHttpRequest();
                uploadFileXHR.open('POST', 'https://api.imagekit.io/v1/files/upload');
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
            } catch(ex) {
                console.log(ex);
                if(typeof callback != "function") return;
                callback(ex);
            }
        }
        else {
            try {
                var error = JSON.parse(xhr.responseText);
                console.log(error);
                if(typeof callback != "function") return;
                callback(error);
            } catch (ex) {
                console.log(ex);
                if(typeof callback != "function") return;
                callback(ex);
            }
        }
    };
    xhr.send();
    return;
}

