import { ImageKitOptions, UrlOptions } from "../interfaces";
import { Transformation } from "../interfaces/Transformation";
import transformationUtils from "../utils/transformation";
const TRANSFORMATION_PARAMETER = "tr";

function removeTrailingSlash(str: string) {
  if (typeof str == "string" && str[str.length - 1] == "/") {
    str = str.substring(0, str.length - 1);
  }
  return str;
}

function removeLeadingSlash(str: string) {
  if (typeof str == "string" && str[0] == "/") {
    str = str.slice(1);
  }
  return str;
}

function pathJoin(parts: string[], sep?: string) {
  var separator = sep || "/";
  var replace = new RegExp(separator + "{1,}", "g");
  return parts.join(separator).replace(replace, separator);
}

export const buildURL = (opts: UrlOptions & ImageKitOptions) => {
  if (!opts.path && !opts.src) {
    return "";
  }

  var urlObj, isSrcParameterUsedForURL, urlEndpointPattern;

  try {
    if (opts.path) {
      urlEndpointPattern = new URL(opts.urlEndpoint).pathname;
      urlObj = new URL(pathJoin([opts.urlEndpoint.replace(urlEndpointPattern, ""), opts.path]));
    } else {
      urlObj = new URL(opts.src!);
      isSrcParameterUsedForURL = true;
    }
  } catch (e) {
    console.error(e)
    return "";
  }

  // if (opts.sdkVersion && opts.sdkVersion.trim() != "") {
  //   urlObj.searchParams.append("ik-sdk-version", opts.sdkVersion.trim());
  // }

  for (var i in opts.queryParameters) {
    urlObj.searchParams.append(i, String(opts.queryParameters[i]));
  }

  var transformationString = constructTransformationString(opts.transformation);

  if (transformationString && transformationString.length) {
    if (transformationUtils.addAsQueryParameter(opts) || isSrcParameterUsedForURL) {
      urlObj.searchParams.append(TRANSFORMATION_PARAMETER, transformationString);
    } else {
      urlObj.pathname = pathJoin([
        TRANSFORMATION_PARAMETER + transformationUtils.getChainTransformDelimiter() + transformationString,
        urlObj.pathname,
      ]);
    }
  }

  if (urlEndpointPattern) {
    urlObj.pathname = pathJoin([urlEndpointPattern, urlObj.pathname]);
  } else {
    urlObj.pathname = pathJoin([urlObj.pathname]);
  }

  return urlObj.href;
};

function constructTransformationString(transformation: Transformation[] | undefined) {
  if (!Array.isArray(transformation)) {
    return "";
  }

  var parsedTransforms = [];
  for (var i = 0, l = transformation.length; i < l; i++) {
    var parsedTransformStep = [];
    for (var key in transformation[i]) {
      if(transformation[i][key] === undefined || transformation[i][key] === null )
      continue;
      var transformKey = transformationUtils.getTransformKey(key);
      if (!transformKey) {
        transformKey = key;
      }

      if (transformation[i][key] === "-") {
        parsedTransformStep.push(transformKey);
      } else if (key === "raw") {
        parsedTransformStep.push(transformation[i][key]);
      } else {
        var value = transformation[i][key];
        if (transformKey === "di") {
          value = removeTrailingSlash(removeLeadingSlash(value || ""));
          value = value.replace(/\//g, "@@");
        }
        parsedTransformStep.push([transformKey, value].join(transformationUtils.getTransformKeyValueDelimiter()));
      }
    }
    parsedTransforms.push(parsedTransformStep.join(transformationUtils.getTransformDelimiter()));
  }

  return parsedTransforms.join(transformationUtils.getChainTransformDelimiter());
}
