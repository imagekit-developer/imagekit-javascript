import { url } from "./url/index";
import { upload } from "./upload/index";
import pkg from '../package.json';
import transformationUtils from "./utils/transformation"
import errorMessages from "./constants/errorMessages";

const ImageKit = function(opts) {
    opts = opts || {};
    this.options = {
        sdkVersion: `javascript-${pkg.version}`,
        publicKey: "",
        urlEndpoint: "",
        transformationPosition: transformationUtils.getDefault()
    };

    this.options = {
        ...this.options,
        ...opts
    };

    if (!mandatoryParametersAvailable(this.options)) {
        throw(errorMessages.MANDATORY_INITIALIZATION_MISSING);
    }

    if (privateKeyPassed(this.options)) {
        throw(errorMessages.PRIVATE_KEY_CLIENT_SIDE);
    }

    if (!transformationUtils.validParameters(this.options)) {
        throw(errorMessages.INVALID_TRANSFORMATION_POSITION);
    }

    /*
        URL Builder
    */
    this.url = function (urlOptions) {
        return url(urlOptions, this.options);
    };

    /*
        Upload API
    */
    this.upload = function (uploadOptions, callback, options) {
        var mergedOptions = {
            ...this.options,
            ...options
        };
        return upload(uploadOptions, mergedOptions, callback);
    };
};

function mandatoryParametersAvailable(options) {
    return options.urlEndpoint;
}

function privateKeyPassed(options) {
    return typeof options.privateKey != "undefined";
}

export default ImageKit;