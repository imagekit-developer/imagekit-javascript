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
    if (typeof (globalThis as any).Buffer !== "undefined") {
        return (globalThis as any).Buffer.from(str, "utf8").toString("base64");
    }

    const bytes =
        typeof TextEncoder !== "undefined"
            ? new TextEncoder().encode(str)
            : encodeUTF8Fallback(str);

    if (typeof btoa !== "undefined") {
        let binary = "";
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode.apply(
                null,
                Array.prototype.slice.call(bytes, i, i + chunkSize) as any,
            );
        }
        return btoa(binary);
    }

    throw new Error("Cannot generate base64 string; Expected `Buffer` or `btoa` to be defined");
};

function encodeUTF8Fallback(str: string): Uint8Array {
    const out: number[] = [];
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        if (c < 0x80) {
            out.push(c);
        } else if (c < 0x800) {
            out.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
        } else if (c >= 0xd800 && c <= 0xdbff && i + 1 < str.length) {
            const c2 = str.charCodeAt(i + 1);
            if (c2 >= 0xdc00 && c2 <= 0xdfff) {
                const cp = 0x10000 + (((c & 0x3ff) << 10) | (c2 & 0x3ff));
                out.push(
                    0xf0 | (cp >> 18),
                    0x80 | ((cp >> 12) & 0x3f),
                    0x80 | ((cp >> 6) & 0x3f),
                    0x80 | (cp & 0x3f),
                );
                i++;
                continue;
            }
            out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
        } else {
            out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
        }
    }
    return new Uint8Array(out);
}