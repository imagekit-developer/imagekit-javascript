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

    return buildURL(opts);
};
