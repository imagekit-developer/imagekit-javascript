import supportedTransforms from "../constants/supportedTransforms";
import { TransformationPosition, SrcOptions } from "../interfaces";

const QUERY_TRANSFORMATION_POSITION: TransformationPosition = "query";
const PATH_TRANSFORMATION_POSITION: TransformationPosition = "path";
const DEFAULT_TRANSFORMATION_POSITION: TransformationPosition = QUERY_TRANSFORMATION_POSITION;
const VALID_TRANSFORMATION_POSITIONS = [PATH_TRANSFORMATION_POSITION, QUERY_TRANSFORMATION_POSITION];
const CHAIN_TRANSFORM_DELIMITER: string = ":";
const TRANSFORM_DELIMITER: string = ",";
const TRANSFORM_KEY_VALUE_DELIMITER: string = "-";

export default {
    addAsQueryParameter: (options: SrcOptions) => {
        return options.transformationPosition === QUERY_TRANSFORMATION_POSITION;
    },
    getTransformKey: function (transform: string) {
        if (!transform) { return ""; }

        return supportedTransforms[transform] || supportedTransforms[transform.toLowerCase()] || "";
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

export const safeBtoa = function (str: string): string {
    if (typeof window !== "undefined") {
        /* istanbul ignore next */
        return btoa(str);
    } else {
        // Node fallback
        return Buffer.from(str, "utf8").toString("base64");
    }
}