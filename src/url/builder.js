import transformationUtils from "../utils/transformation";
const TRANSFORMATION_PARAMETER = "tr";

export const buildURL = (opts) => {
    if (!opts.path && !opts.src) {
        return "";
    }

    var urlObj, isSrcParameterUsedForURL, urlEndpointPattern;
    if (opts.path) {
        urlEndpointPattern = new URL(opts.urlEndpoint).pathname;
        urlObj = new URL(pathJoin([opts.urlEndpoint.replace(urlEndpointPattern, ""), opts.path]));
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

    if (transformationString && transformationString.length) {
        if (transformationUtils.addAsQueryParameter(opts) || isSrcParameterUsedForURL) {
            urlObj.searchParams.append(TRANSFORMATION_PARAMETER, transformationString);
        } else {
            urlObj.pathname = pathJoin([
                TRANSFORMATION_PARAMETER + transformationUtils.getChainTransformDelimiter() + transformationString,
                urlObj.pathname
            ]);
        }
    }

    urlObj.pathname = pathJoin([urlEndpointPattern, urlObj.pathname]);

    return urlObj.href;
}

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
                var value = transformation[i][key];
                if(transformKey === "oi" || transformKey === "di") {
                    value = removeTrailingSlash(removeLeadingSlash(value));
                    value = value.replace(/\//g,"@@");
                }
                parsedTransformStep.push([transformKey, value].join(transformationUtils.getTransformKeyValueDelimiter()));
            }

        }
        parsedTransforms.push(parsedTransformStep.join(transformationUtils.getTransformDelimiter()));
    }

    return parsedTransforms.join(transformationUtils.getChainTransformDelimiter());
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