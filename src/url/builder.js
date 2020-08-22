import transformationUtils from "../utils/transformation";
const TRANSFORMATION_PARAMETER = "tr";

export const buildURL = (opts) => {
    if (!opts.path && !opts.src) {
        return "";
    }

    var urlObj, isSrcParameterUsedForURL, urlEndpointPattern;
    if (opts.path) {
        urlEndpointPattern = new URL(opts.urlEndpoint).pathname;
        urlObj = new URL(pathJoin([opts.urlEndpoint.replace(urlEndpointPattern,""),opts.path]));
    } else {
        urlObj = new URL(opts.src);
        isSrcParameterUsedForURL = true;
    }

    if (!urlObj) return "";

    if (opts.sdkVersion && opts.sdkVersion.trim() != "") {
        urlObj.searchParams.append("ik-sdk-version", opts.sdkVersion.trim());
    }
    for (var i in opts.queryParameters) {
        urlObj.searchParams.append(i, opts.queryParameters[i]);
    }

    var transformationString = constructTransformationString(opts.transformation);

    if (transformationUtils.addAsQueryParameter(opts) || isSrcParameterUsedForURL) {
        urlObj.searchParams.append(TRANSFORMATION_PARAMETER, transformationString);
    } else {
        urlObj.pathname = pathJoin([
            TRANSFORMATION_PARAMETER + transformationUtils.getChainTransformDelimiter() + transformationString,
            urlObj.pathname
        ]);
    }

    urlObj.pathname = pathJoin([urlEndpointPattern,urlObj.pathname]);

    return urlObj.href;
}

export const buildURLs = (opts) => {
    if (!opts.path && !opts.src) {
        return "";
    }

    //Create correct query parameters
    var parsedURL, isSrcParameterUsedForURL, parsedHost;
    if (opts.path) {
        parsedURL = new URL(pathJoin([opts.urlEndpoint, opts.path]));
        parsedHost = new URL(opts.urlEndpoint);
    } else {
        parsedURL = new URL(opts.src);
        isSrcParameterUsedForURL = true;
    }

    var queryParameters = new URLSearchParams(parsedURL.query || "");
    if (opts.sdkVersion && opts.sdkVersion.trim() != "") {
        queryParameters.append("ik-sdk-version", opts.sdkVersion.trim());
    }
    for (var i in opts.queryParameters) {
        queryParameters.append(i, opts.queryParameters[i]);
    }

    //Initial URL Construction Object
    var urlObject = { host: "", pathname: "", search: "" };
    if (opts.path) {
        urlObject.protocol = parsedHost.protocol;
        urlObject.host = opts.urlEndpoint.replace(urlObject.protocol + "//", "");
    } else if (opts.src) {
        urlObject.host = [parsedURL.auth, parsedURL.auth ? "@" : "", parsedURL.host].join("");
        urlObject.protocol = parsedURL.protocol;
    }
    urlObject.pathname = parsedURL.pathname;

    //Create Transformation String
    var transformationString = constructTransformationString(opts.transformation);
    if (transformationString) {
        //force that if src parameter is being used for URL construction then the transformation
        //string should be added only as a query parameter
        if (transformationUtils.addAsQueryParameter(opts) || isSrcParameterUsedForURL) {
            queryParameters.append(TRANSFORMATION_PARAMETER, transformationString);
        } else {
            urlObject.pathname = pathJoin([
                TRANSFORMATION_PARAMETER,
                transformationUtils.getChainTransformDelimiter(),
                transformationString,
                urlObject.pathname
            ]);
        }
    }

    urlObject.host = removeTrailingSlash(urlObject.host);
    urlObject.pathname = addLeadingSlash(urlObject.pathname);
    urlObject.search = queryParameters.toString();

    return url.format(urlObject);
};

function constructTransformationString(transformation) {
    if (!Array.isArray(transformation)) { return ""; }

    var parsedTransforms = [];
    for (var i = 0, l = transformation.length; i < l; i++) {
        var parsedTransformStep = [];
        for (var key in transformation[i]) {
            var transformKey = transformationUtils.getTransformKey(key);
            if (!transformKey) {
                transformKey = key;
            }

            if (transformation[i][key] === "-") {
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
    if (typeof str == "string" && str[0] != "/") {
        str = "/" + str;
    }

    return str;
}

function removeTrailingSlash(str) {
    if (typeof str == "string" && str[str.length - 1] == "/") {
        str = str.substring(0, str.length - 1);
    }
    return str;
}

function removeLeadingSlash(str) {
    if (typeof str == "string" && str[0] == "/") {
        str = str.slice(1);
    }
    return str;
}

function pathJoin(parts, sep) {
    var separator = sep || '/';
    var replace = new RegExp(separator + '{1,}', 'g');
    return parts.join(separator).replace(replace, separator);
}