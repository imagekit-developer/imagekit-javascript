/*
    Helper Modules
*/
var extend = require('lodash/extend');

/*
    Implementations
*/
var url = require('./libs/url');
var upload = require('./libs/upload');

/*
    Utils
*/
var transformationUtils = require('./utils/transformation');
var errorMessages = require("./constants/errorMessages");

var ImageKit = function(opts) {
    opts = opts || {};
    this.options = {
        sdkVersion : "javascript-1.0.3",
        publicKey : "",
        urlEndpoint : "",
        transformationPosition : transformationUtils.getDefault()
    };

    this.options = extend(this.options, opts);
    if(!mandatoryParametersAvailable(this.options)) {
        throw new Error(errorMessages.MANDATORY_INITIALIZATION_MISSING);
    }

    if(privateKeyPassed(this.options)) {
        throw new Error(errorMessages.PRIVATE_KEY_CLIENT_SIDE);
    }

    if(!transformationUtils.validParameters(this.options)) {
        throw new Error(errorMessages.INVALID_TRANSFORMATION_POSITION);
    }

    /*
        URL Builder
    */
    this.url = function(urlOptions) {
        return url(urlOptions, this.options);
    };

    /*
        Upload API
    */
    this.upload = function(uploadOptions, callback) {
        return upload(uploadOptions, this.options, callback);
    };
};

function mandatoryParametersAvailable(options) {
    return options.publicKey && options.urlEndpoint;
}

function privateKeyPassed(options) {
    return typeof options.privateKey != "undefined";
}

module.exports = ImageKit;