

module.exports = function(formData, defaultOptions, callback) {
    $.ajax({
        url : defaultOptions.authenticationEndpoint,
        method : "GET",
        dataType : "json",
        success : function(body) {
            if(typeof callback != "function") return;

            formData.append("signature", body.signature || "");
            formData.append("expire", body.expire || 0);
            formData.append("token", body.token);

            $.ajax({
                url : "https://api.imagekit.io/v1/files/upload",
                method : "POST",
                mimeType : "multipart/form-data",
                dataType : "json",
                data : formData,
                processData : false,
                contentType : false,
                error : function(jqxhr, text, error) {
                    if(typeof callback != "function") return;
    
                    callback(error);
                },
                success : function(body) {
                    if(typeof callback != "function") return;
    
                    callback(null, body);
                }
            });
        },
        error : function(jqxhr, text, error) {
            console.log(arguments);
            if(typeof callback != "function") return;

            callback(error);
        }
    });
}

