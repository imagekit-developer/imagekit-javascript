/*
    VARIABLES
*/
var DEFAULT_TRANSFORMATION_POSITION = "path";
var QUERY_TRANSFORMATION_POSITION = "query";
var VALID_TRANSFORMATION_POSITIONS = [DEFAULT_TRANSFORMATION_POSITION, QUERY_TRANSFORMATION_POSITION];

var supportedTransforms = require("../constants/supportedTransforms");
var CHAIN_TRANSFORM_DELIMITER = ":";
var TRANSFORM_DELIMITER = ",";
var TRANSFORM_KEY_VALUE_DELIMITER = "-";

module.exports.getDefault = function() {
    return DEFAULT_TRANSFORMATION_POSITION;
}

module.exports.addAsQueryParameter = function(options) {
    return options.transformationPosition === QUERY_TRANSFORMATION_POSITION;
}

module.exports.validParameters = function(options) {
    return VALID_TRANSFORMATION_POSITIONS.indexOf(options.transformationPosition) != -1;
}

module.exports.getSupportedTransforms = function() {
    return supportedTransforms;
}

module.exports.getTransformKey = function(transform) {
    if(!transform) { return ""; }

    return supportedTransforms[transform.toLowerCase()] || "";
}

module.exports.getChainTransformDelimiter = function() {
    return CHAIN_TRANSFORM_DELIMITER;
}

module.exports.getTransformDelimiter = function() {
    return TRANSFORM_DELIMITER;
}

module.exports.getTransformKeyValueDelimiter = function() {
    return TRANSFORM_KEY_VALUE_DELIMITER;
}