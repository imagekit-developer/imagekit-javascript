/*
    URL builder
*/
import { buildURL } from "./builder";

/*
    Utils
*/
import transformationUtils from "../utils/transformation";

export const url = (urlOpts, defaultOptions) => {
    var opts = {
        ...defaultOptions,
        ...urlOpts
    }

    if (!validOptions(opts)) {
        return "";
    }

    return buildURL(opts);
};

function validOptions(opts) {
    if (!opts.urlEndpoint) return false;

    if (!transformationUtils.validParameters(opts)) return false;

    return true;
}
