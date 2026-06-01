import supportedTransforms from "../constants/supportedTransforms";
import { TransformationPosition, SrcOptions } from "../interfaces";

const QUERY_TRANSFORMATION_POSITION: TransformationPosition = "query";
const PATH_TRANSFORMATION_POSITION: TransformationPosition = "path";
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
    // Prefer Buffer when available (Node.js / SSR): handles UTF-8 natively.
    if (typeof (globalThis as any).Buffer !== "undefined") {
        return (globalThis as any).Buffer.from(str, "utf8").toString("base64");
    }

    // Browser: btoa() throws on characters with code points > 0xFF, so convert
    // the string to UTF-8 bytes first, then base64-encode them (per MDN).
    const bytes = new TextEncoder().encode(str);
    const binary = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
    return btoa(binary);
};