const DEFAULT_TRANSFORMATION_POSITION = "path";
const QUERY_TRANSFORMATION_POSITION = "query";
const VALID_TRANSFORMATION_POSITIONS = [DEFAULT_TRANSFORMATION_POSITION, QUERY_TRANSFORMATION_POSITION];
import supportedTransforms from "../constants/supportedTransforms";
const CHAIN_TRANSFORM_DELIMITER = ":";
const TRANSFORM_DELIMITER = ",";
const TRANSFORM_KEY_VALUE_DELIMITER = "-";

export default {
    getDefault: function () {
        return DEFAULT_TRANSFORMATION_POSITION;
    },
    addAsQueryParameter: function (options) {
        return options.transformationPosition === QUERY_TRANSFORMATION_POSITION;
    },
    validParameters: function (options) {
        return VALID_TRANSFORMATION_POSITIONS.indexOf(options.transformationPosition) != -1;
    },
    getSupportedTransforms: function () {
        return supportedTransforms;
    },
    getTransformKey: function (transform) {
        if (!transform) { return ""; }

        return supportedTransforms[transform.toLowerCase()] || "";
    },
    getChainTransformDelimiter: function () {
        return CHAIN_TRANSFORM_DELIMITER;
    },
    getTransformDelimiter: function () {
        return TRANSFORM_DELIMITER;
    },
    getTransformKeyValueDelimiter: function () {
        return TRANSFORM_KEY_VALUE_DELIMITER;
    }
}