/*
    Helper Modules
*/
var url = require('url');

/*
    Utils
*/
var transformationUtils = require('../../utils/transformation');
var path = require('../../utils/path-join');

/*
    Variables
*/
var TRANSFORMATION_PARAMETER = "tr";

module.exports.buildURL = function(opts) {
    if(!opts.path && !opts.src) {
        return "";
    }

    //Create correct query parameters
    var parsedURL, isSrcParameterUsedForURL, parsedHost;
    if(opts.path) {
        parsedURL = url.parse(opts.path);
        parsedHost = url.parse(opts.urlEndpoint);
    } else {
        parsedURL = url.parse(opts.src);
        isSrcParameterUsedForURL = true;
    }

    var queryParameters = new URLSearchParams(parsedURL.query || "");
    if(opts.sdkVersion && opts.sdkVersion.trim() != "") {
        queryParameters.append("ik-sdk-version", opts.sdkVersion.trim());
    }
    for(var i in opts.queryParameters) {
        queryParameters.append(i, opts.queryParameters[i]);
    }
    
    //Initial URL Construction Object
    var urlObject = {host : "", pathname : "", search : ""};
    if(opts.path) {
        urlObject.protocol = parsedHost.protocol;
        urlObject.host = opts.urlEndpoint.replace(urlObject.protocol + "//", "");
    } else if(opts.src) {
        urlObject.host = [parsedURL.auth, parsedURL.auth ? "@" : "" ,parsedURL.host].join("");
        urlObject.protocol = parsedURL.protocol;
    }
    urlObject.pathname = parsedURL.pathname;

    //Create Transformation String
    var transformationString = constructTransformationString(opts.transformation);
    if(transformationString) {
        //force that if src parameter is being used for URL construction then the transformation
        //string should be added only as a query parameter
        if(transformationUtils.addAsQueryParameter(opts) || isSrcParameterUsedForURL) {
            queryParameters.append(TRANSFORMATION_PARAMETER, transformationString);   
        } else {
            urlObject.pathname = path.join(
                                    [TRANSFORMATION_PARAMETER, transformationString].join(transformationUtils.getChainTransformDelimiter()),
                                    urlObject.pathname
                                )
        }
    }
    
    urlObject.host = removeTrailingSlash(urlObject.host);
    urlObject.pathname = addLeadingSlash(urlObject.pathname);
    urlObject.search = queryParameters.toString();

    return url.format(urlObject);
};

function constructTransformationString(transformation) {
    if(!Array.isArray(transformation)) { return ""; }

    var parsedTransforms = [];
    for(var i = 0, l = transformation.length; i < l; i++) {
        var parsedTransformStep = [];
        for(var key in transformation[i]) {
            var transformKey = transformationUtils.getTransformKey(key);
            if(!transformKey) {
                transformKey = key;
            }

            if(transformation[i][key] === "-") {
                parsedTransformStep.push(transformKey);
            } else {
                parsedTransformStep.push([transformKey, transformation[i][key]].join(transformationUtils.getTransformKeyValueDelimiter()));
            }
            
        }
        parsedTransforms.push(parsedTransformStep.join(transformationUtils.getTransformDelimiter()));
    }

    return parsedTransforms.join(transformationUtils.getChainTransformDelimiter());
}

function addLeadingSlash(str) {
    if(typeof str == "string" && str[0] != "/") {
        str = "/" + str;
    }

    return str;
}

function removeTrailingSlash(str) {
    if(typeof str == "string" && str[str.length - 1] == "/") {
        str = str.substring(0, str.length - 1);
    }

    return str;
}