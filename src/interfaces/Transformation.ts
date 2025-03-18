export type TransformationPosition = "path" | "query";

/**
 * The SDK provides easy to use names for transformations. These names are converted to the corresponding transformation string before being added to the URL.
 * SDKs are updated regularly to support new transformations. If you want to use a transformation that is not supported by the SDK, you can use the `raw` parameter to pass the transformation string directly.
 * @link https://imagekit.io/docs/transformations
 */
export interface Transformation {
    /**
     * The width of the output. If a value between 0 and 1 is used, it’s treated
     * as a percentage (e.g., `0.4` -> 40% of original width). You can also supply
     * arithmetic expressions (e.g., `"iw_div_2"`).
     */
    width?: number | string;

    /**
     * The height of the output. If a value between 0 and 1 is used, it’s treated
     * as a percentage (e.g., `0.5` -> 50% of original height). You can also supply
     * arithmetic expressions (e.g., `"ih_mul_0.5"`).
     */
    height?: number | string;

    /**
     * Specifies the aspect ratio for the output, e.g., `"ar-4-3"`.
     * Typically used with either width or height (not both).
     * Example usage: `aspectRatio = "4:3"` or `"4_3"` or an expression like `"iar_div_2"`.
     */
    aspectRatio?: number | string;

    /**
     * Specify the background that can be used along with some cropping strategies while resizing an image:
     * - A solid color: `"red"`, `"F3F3F3"`, `"AAFF0010"`.
     * - A blurred background: `"blurred"`, `"blurred_25_N15"`, etc.
     * - Expand the image boundaries using generative fill: `genfill`. Optionally control the background scene by passing text prompt: `genfill[:-prompt-${text}]` or `genfill[:-prompte-${urlencoded_base64_encoded_text}]`.
     */
    background?: string;

    /**
     * Add a border to the output media. Accepts `<border-width>_<hex-code>`,
     * e.g. `"5_FFF000"` (5px yellow border), or an expression like `"ih_div_20_FF00FF"`.
     */
    border?: string;

    /**
     * @link https://imagekit.io/docs/image-resize-and-crop#crop-crop-modes--focus
     */
    crop?: "force" | "at_max" | "at_max_enlarge" | "at_least" | "maintain_ratio";

    /**
     * @link https://imagekit.io/docs/image-resize-and-crop#crop-crop-modes--focus
     */
    cropMode?: "pad_resize" | "extract" | "pad_extract";

    /**
     * Possible values 0.1  to 5 or `auto` for automatic DPR calculation.
     * @link https://imagekit.io/docs/image-resize-and-crop#dpr---dpr
     */
    DPR?: number

    /**
     * This parameter can be used along with pad resize, maintain ratio, or extract crop to change the behavior of padding or cropping
     * @link https://imagekit.io/docs/image-resize-and-crop#focus---fo
     */
    focus?: string;

    /**
     * Used to specify the quality of the output image for lossy formats like JPEG, WebP, and AVIF.  A large quality number indicates a larger output image size with high quality. A small quality number indicates a smaller output image size with lower quality.
     */
    quality?: number;

    /**
     * @link https://imagekit.io/docs/image-resize-and-crop#example---focus-using-cropped-image-coordinates
     */
    x?: number | string;

    /**
     * @link https://imagekit.io/docs/image-resize-and-crop#example---focus-using-cropped-image-coordinates
     */
    xCenter?: number | string;

    /**
     * @link https://imagekit.io/docs/image-resize-and-crop#example---focus-using-cropped-image-coordinates
     */
    y?: number | string;

    /**
     * @link https://imagekit.io/docs/image-resize-and-crop#example---focus-using-cropped-image-coordinates
     */
    yCenter?: number | string;

    /**
     * Output format for images or videos, e.g., `"jpg"`, `"png"`, `"webp"`, `"mp4"`, `"auto"`.
     * ImageKit will automatically determine the format based on device support even if you do not specify it.
     */
    format?: string;

    /**
     * Video codec, e.g., `"h264"`, `"vp9"`, `"av1"`.
     */
    videoCodec?: string;

    /**
     * Audio codec, e.g., `"aac"`, `"opus"`.
     */
    audioCodec?: string;

    /**
     * Corner radius for rounded corners (e.g., `20`) or `"max"` for circular/oval shapes.
     */
    radius?: number | "max";

    /**
     * Rotation in degrees. Positive values rotate clockwise; you can
     * also use e.g. `"N40"` for counterclockwise or `"auto"` to read EXIF data.
     * For videos only 0 , 90 , 180 , 270 and 360 values are supported.
     */
    rotation?: number | string;

    /**
     * Gaussian blur level. Ranges 1–100 or an expression like `"bl-10"`. Possible values include integers between 1 and 100.
     */
    blur?: number;

    /**
     * @link https://imagekit.io/docs/transformations#named-transformations
     */
    named?: string;

    /**
     * Fallback image if the resource is not found, e.g., a URL or path.
     * @link https://imagekit.io/docs/image-transformation#default-image---di
     */
    defaultImage?: string;

    /**
     * It is used to flip/mirror an image horizontally, vertically, or in both directions.
     * Possible values - h (horizontal), v (vertical), h_v (horizontal and vertical)
     */
    flip?: "h" | "v" | "h_v" | "v_h";

    /**
     * Whether to serve the original file without any transformations if `true`.
     */
    original?: boolean;

    /**
     * Start offset (in seconds) for trimming videos. e.g., `5` or `"10.5"`. 
     * Also supports arithmetic expressions.
     */
    startOffset?: number | string;

    /**
     * End offset (in seconds) for trimming videos. e.g., `5` or `"10.5"`.
     * Usually used with `startOffset` to define a time window. 
     * Also supports arithmetic expressions.
     */
    endOffset?: number | string;

    /**
     * Duration (in seconds) for trimming videos. e.g., `5` or `"10.5"`.
     * Typically used with `startOffset` to specify length from the start point. 
     * Also supports arithmetic expressions.
     */
    duration?: number | string;

    /**
     * Resolutions for adaptive bitrate streaming (videos).
     * e.g., `240_360_480_720_1080` will generate 5 representations and manifest. 
     * @link https://imagekit.io/docs/adaptive-bitrate-streaming
     */
    streamingResolutions?: string;

    /**
     * Enable grayscale effect for images.
     */
    grayscale?: true;

    /**
     * Use third-party background removal. 
     * See also `removeBackground` for ImageKit's in-house background removal which is 90% cheaper.
     */
    aiBGRemoveExternal?: true

    /**
     * Upscale images beyond their original dimensions with AI.
     */
    aiUpscale?: true

    /**
     * Retouch (AI-based) for improving faces or product shots.
     */
    aiRetouch?: true

    /**
     * Generate variation of an image using AI. This will generate a new image with slight variations from the original image. The variations include changes in color, texture, and other visual elements. However, the model will try to preserve the structure and essence of the original image.
     */
    aiVariation?: true

    /**
     * Add an AI-based drop shadow around a foreground object on a transparent or removed background.
     * You can control the direction, elevation, and saturation of the light source. E.g. change light direction `az-45`.
     * @link https://imagekit.io/docs/ai-transformations#ai-drop-shadow-e-dropshadow
     */
    aiDropShadow?: string

    /**
     * Change background using AI. Provide a prompt or base64-encoded prompt. e.g. `prompt-snow road` or `prompte-[urlencoded_base64_encoded_text]`.
     */
    aiChangeBackground?: string;

    /**
     * ImageKit’s in-house background removal.
     */
    aiRemoveBackground?: true

    /**
     * Auto-enhance contrast for an image (contrast stretch).
     */
    contrastStretch?: true

    /**
     * Add a drop shadow under non-transparent pixels (non-AI method). Check `eDropshadow` for AI-based shadows.
     * @link https://imagekit.io/docs/effects-and-enhancements#shadow---e-shadow
     */
    shadow?: string

    /**
     * Sharpen the image or specify intensity, e.g., `e-sharpen-10`.
     */
    sharpen?: true | number

    /**
     * Unsharp mask for advanced sharpening, e.g., `"2-2-0.8-0.024"`.
     */
    unsharpMask?: string;

    /**
     * Add a linear gradient overlay. e.g.,
     * @link https://imagekit.io/docs/effects-and-enhancements#gradient---e-gradient
     */
    gradient?: string;

    /**
     * Used to specify whether the output JPEG image must be rendered progressively. In progressive loading, the output image renders as a low-quality pixelated full image, which, over time, keeps on adding more pixels and information to the image.  This helps you maintain a fast perceived load time.
     */
    progressive?: boolean;

    /**
     * Used to specify whether the output image (if in JPEG or PNG) must be compressed losslessly.
     */
    lossless?: boolean

    /**
     * It specifies whether the output image should contain the color profile initially available with the original image.
     */
    colorProfile?: boolean;

    /**
     * By default, ImageKit removes all metadata as part of automatic image compression. Set this to `true` to preserve metadata.
     */
    metadata?: boolean;

    /**
     * It is used to specify the opacity level of the output image.
     * @link https://imagekit.io/docs/effects-and-enhancements#opacity---o
     */
    opacity?: number;

    /**
     * Useful with images that have a solid or nearly solid background with the object in the center. This parameter trims the background from the image, leaving only the central object in the output image.
     * @link https://imagekit.io/docs/effects-and-enhancements#trim-edges---t
     */
    trim?: true | number;

    /**
     * This parameter accepts a number that determines how much to zoom in or out of the cropped area.
     * It must be used along with fo-face or fo-<object_name>
     * @link https://imagekit.io/docs/image-resize-and-crop#zoom---z
     */
    zoom?: number;

    /**
     * Extract specific page/frame from multi-page or layered files (PDF, PSD, AI),
     * Pick by number e.g., `2`. Or 2nd and 3rd layers combined using `3-4`.
     * Or pick a layer from PSD by name, e.g., `name-layer-4`.
     * @link https://imagekit.io/docs/vector-and-animated-images#get-thumbnail-from-psd-pdf-ai-eps-and-animated-files
     */
    page?: number | string;

    /**
     * Pass any transformation that is not directly supported by the SDK. This transformation is passed as it is in the URL.
     */
    raw?: string;

    // old as it is but deprecated

    /**
     * @deprecated Use `rotation` instead.
     */
    rotate?: string;

    /**
     * @deprecated Use `sharpen` instead.
     */
    effectSharpen?: string;

    /**
     * @deprecated Use `unsharpMask` instead.
     */
    effectUSM?: string;

    /**
     * @deprecated Use `contrastStretch` instead.
     */
    effectContrast?: string;

    /**
     * @deprecated Use `grayscale` instead.
     */
    effectGray?: string;

    /**
     * @deprecated Use `shadow` instead.
     */
    effectShadow?: string;

    /**
     * @deprecated Use `gradient` instead.
     */
    effectGradient?: string;
}

