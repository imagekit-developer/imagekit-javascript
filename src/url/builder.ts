import { ImageKitOptions, UrlOptions } from "../interfaces";
import { ImageOverlay, SolidColorOverlay, SubtitleOverlay, TextOverlay, Transformation, VideoOverlay } from "../interfaces/Transformation";
import transformationUtils, { safeBtoa } from "../utils/transformation";
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


function processOverlay(overlay: Transformation["overlay"]): string | undefined {
  const entries = [];
  if (!overlay) {
    return;
  }
  const { type, position = {}, timing = {}, transformation = [] } = overlay;

  if (!type) {
    throw new Error("Overlay type is required");
  }

  switch (type) {
    case "text": {
      const textOverlay = overlay as TextOverlay;
      if (!textOverlay.text) {
        return;
      }
      entries.push("l-text");
      entries.push(`ie-${encodeURIComponent(safeBtoa(textOverlay.text))}`);
    }
      break;
    case "image":
      entries.push("l-image");
      {
        const imageOverlay = overlay as ImageOverlay;
        if (imageOverlay.input) {
          entries.push(`i-${imageOverlay.input}`);
        } else {
          return;
        }
      }
      break;
    case "video":
      entries.push("l-video");
      {
        const videoOverlay = overlay as VideoOverlay;
        if (videoOverlay.input) {
          entries.push(`i-${videoOverlay.input}`);
        } else {
          return;
        }
      }
      break;
    case "subtitle":
      entries.push("l-subtitle");
      {
        const subtitleOverlay = overlay as SubtitleOverlay;
        if (subtitleOverlay.input) {
          entries.push(`i-${subtitleOverlay.input}`);
        } else {
          return;
        }
      }
      break;
    case "solidColor":
      entries.push("l-image");
      entries.push(`i-ik_canvas`);
      {
        const solidColorOverlay = overlay as SolidColorOverlay;
        if (solidColorOverlay.color) {
          entries.push(`bg-${solidColorOverlay.color}`);
        } else {
          return;
        }
      }
      break;
  }

  const { x, y, focus } = position;
  if (x) {
    entries.push(`lxo-${x}`);
  }
  if (y) {
    entries.push(`lyo-${y}`);
  }
  if (focus) {
    entries.push(`lfo-${focus}`);
  }

  const { start, end, duration } = timing;

  if (start) {
    entries.push(`lso-${start}`);
  }
  if (end) {
    entries.push(`leo-${end}`);
  }
  if (duration) {
    entries.push(`ldu-${duration}`);
  }

  const transformationString = constructTransformationString(transformation);

  if (transformationString && transformationString.trim() !== "") entries.push(transformationString);

  entries.push("l-end");

  return entries.join(transformationUtils.getTransformDelimiter());
}

function constructTransformationString(transformation: Transformation[] | undefined) {
  if (!Array.isArray(transformation)) {
    return "";
  }

  var parsedTransforms: string[] = [];
  for (var i = 0, l = transformation.length; i < l; i++) {
    var parsedTransformStep: string[] = [];
    for (var key in transformation[i]) {
      let value = transformation[i][key as keyof Transformation];
      if (value === undefined || value === null) {
        continue;
      }

      if (key === "overlay" && typeof value === "object") {
        var rawString = processOverlay(value as Transformation["overlay"]);
        if (rawString && rawString.trim() !== "") {
          parsedTransformStep.push(rawString);
        }
        continue; // Always continue as overlay is processed.
      }

      var transformKey = transformationUtils.getTransformKey(key);
      if (!transformKey) {
        transformKey = key;
      }

      if (transformKey === "") {
        continue;
      }

      if (
        ["e-grayscale", "e-contrast", "e-removedotbg", "e-bgremove", "e-upscale", "e-retouch", "e-genvar"].includes(transformKey)
      ) {
        if (value === true || value === "-" || value === "true") {
          parsedTransformStep.push(transformKey);
        } else {
          // Any other value means that the effect should not be applied
          continue;
        }
      } else if (
        ["e-sharpen", "e-shadow", "e-gradient", "e-usm", "e-dropshadow"].includes(transformKey) &&
        (value.toString().trim() === "" || value === true || value === "true")
      ) {
        parsedTransformStep.push(transformKey);
      } else if (key === "raw") {
        parsedTransformStep.push(transformation[i][key] as string);
      } else {
        if (transformKey === "di") {
          value = removeTrailingSlash(removeLeadingSlash(value as string || ""));
          value = value.replace(/\//g, "@@");
        }
        if (transformKey === "sr" && Array.isArray(value)) {
          value = value.join("_");
        }
        // Special case for trim with empty string - should be treated as true
        if (transformKey === "t" && value.toString().trim() === "") {
          value = "true";
        }
        parsedTransformStep.push([transformKey, value].join(transformationUtils.getTransformKeyValueDelimiter()));
      }
    }
    if (parsedTransformStep.length) {
      parsedTransforms.push(parsedTransformStep.join(transformationUtils.getTransformDelimiter()));
    }
  }

  return parsedTransforms.join(transformationUtils.getChainTransformDelimiter());
}
