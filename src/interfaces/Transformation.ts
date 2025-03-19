export type TransformationPosition = "path" | "query";

type StreamingResolution = "240" | "360" | "480" | "720" | "1080" | "1440" | "2160";

/**
 * The SDK provides easy to use names for transformations. These names are converted to the corresponding transformation string before being added to the URL.
 * SDKs are updated regularly to support new transformations. If you want to use a transformation that is not supported by the SDK, you can use the `raw` parameter to pass the transformation string directly.
 * 
 * {@link https://imagekit.io/docs/transformations}
 */
export interface Transformation {
    /**
     * The width of the output. If a value between 0 and 1 is used, it’s treated
     * as a percentage (e.g., `0.4` -> 40% of original width). You can also supply
     * arithmetic expressions (e.g., `"iw_div_2"`).
     * 
     * {@link https://imagekit.io/docs/image-resize-and-crop#width---w}
     */
    width?: number | string;

    /**
     * The height of the output. If a value between 0 and 1 is used, it’s treated
     * as a percentage (e.g., `0.5` -> 50% of original height). You can also supply
     * arithmetic expressions (e.g., `"ih_mul_0.5"`).
     * 
     * {@link https://imagekit.io/docs/image-resize-and-crop#height---h}
     */
    height?: number | string;

    /**
     * Specifies the aspect ratio for the output, e.g., `"ar-4-3"`.
     * Typically used with either width or height (not both).
     * Example usage: `aspectRatio = "4:3"` or `"4_3"` or an expression like `"iar_div_2"`.
     * 
     * {@link https://imagekit.io/docs/image-resize-and-crop#aspect-ratio---ar}
     */
    aspectRatio?: number | string;

    /**
     * Specify the background that can be used along with some cropping strategies while resizing an image:
     * - A solid color: `"red"`, `"F3F3F3"`, `"AAFF0010"`.
     * 
     *   {@link https://imagekit.io/docs/effects-and-enhancements#solid-color-background}
     * 
     * - A blurred background: `"blurred"`, `"blurred_25_N15"`, etc.
     * 
     *   {@link https://imagekit.io/docs/effects-and-enhancements#blurred-background}
     * 
     * - Expand the image boundaries using generative fill: `genfill`. Optionally control the background scene by passing text prompt: `genfill[:-prompt-${text}]` or `genfill[:-prompte-${urlencoded_base64_encoded_text}]`.
     *   
     *   {@link https://imagekit.io/docs/ai-transformations#generative-fill-bg-genfill}
     */
    background?: string;

    /**
     * Add a border to the output media. Accepts `<border-width>_<hex-code>`,
     * e.g. `"5_FFF000"` (5px yellow border), or an expression like `"ih_div_20_FF00FF"`.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#border---b}
     */
    border?: string;

    /**
     * {@link https://imagekit.io/docs/image-resize-and-crop#crop-crop-modes--focus}
     */
    crop?: "force" | "at_max" | "at_max_enlarge" | "at_least" | "maintain_ratio";

    /**
     * {@link https://imagekit.io/docs/image-resize-and-crop#crop-crop-modes--focus}
     */
    cropMode?: "pad_resize" | "extract" | "pad_extract";

    /**
     * Possible values 0.1  to 5 or `auto` for automatic DPR calculation.
     * 
     * {@link https://imagekit.io/docs/image-resize-and-crop#dpr---dpr}
     */
    dpr?: number

    /**
     * This parameter can be used along with pad resize, maintain ratio, or extract crop to change the behavior of padding or cropping
     * 
     * {@link https://imagekit.io/docs/image-resize-and-crop#focus---fo}
     */
    focus?: string;

    /**
     * Used to specify the quality of the output image for lossy formats like JPEG, WebP, and AVIF.  A large quality number indicates a larger output image size with high quality. A small quality number indicates a smaller output image size with lower quality.
     * 
     * {@link https://imagekit.io/docs/image-optimization#quality---q}
     */
    quality?: number;

    /**
     * {@link https://imagekit.io/docs/image-resize-and-crop#example---focus-using-cropped-image-coordinates}
     */
    x?: number | string;

    /**
     * {@link https://imagekit.io/docs/image-resize-and-crop#example---focus-using-cropped-image-coordinates}
     */
    xCenter?: number | string;

    /**
     * {@link https://imagekit.io/docs/image-resize-and-crop#example---focus-using-cropped-image-coordinates}
     */
    y?: number | string;

    /**
     * {@link https://imagekit.io/docs/image-resize-and-crop#example---focus-using-cropped-image-coordinates}
     */
    yCenter?: number | string;

    /**
     * Output format for images or videos, e.g., `"jpg"`, `"png"`, `"webp"`, `"mp4"`, `"auto"`. You can also pass `orig` which works only for images and will return the image in the original format.
     * 
     * ImageKit will automatically deliver images and videos in best possible format based on the device support unless you disable it from the dashboard settings or override it using the `format` parameter.
     * 
     * {@link https://imagekit.io/docs/image-optimization#format---f}
     * 
     * {@link https://imagekit.io/docs/video-optimization#format---f}}
     */
    format?: "auto" | "webp" | "jpg" | "jpeg" | "png" | "gif" | "svg" | "mp4" | "webm" | "avif" | "orig";

    /**
     * Video codec, e.g., `"h264"`, `"vp9"`, `"av1"` or `"none"`.
     * 
     * {@link https://imagekit.io/docs/video-optimization#video-codec---vc}
     */
    videoCodec?: "h264" | "vp9" | "av1" | "none";

    /**
     * Audio codec, e.g., `"aac"`, `"opus"` or `"none"`.
     * 
     * {@link https://imagekit.io/docs/video-optimization#audio-codec---ac}
     */
    audioCodec?: "aac" | "opus" | "none";

    /**
     * Corner radius for rounded corners (e.g., `20`) or `"max"` for circular/oval shapes.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#radius---r}
     */
    radius?: number | "max";

    /**
     * Rotation in degrees. Positive values rotate clockwise; you can
     * also use e.g. `"N40"` for counterclockwise or `"auto"` to read EXIF data.
     * For videos only 0 , 90 , 180 , 270 and 360 values are supported.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#rotate---rt}
     */
    rotation?: number | string;

    /**
     * Gaussian blur level. Ranges 1–100 or an expression like `"bl-10"`. Possible values include integers between 1 and 100.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#blur---bl}
     */
    blur?: number;

    /**
     * {@link https://imagekit.io/docs/transformations#named-transformations}
     */
    named?: string;

    /**
     * Fallback image if the resource is not found, e.g., a URL or path.
     * 
     * {@link https://imagekit.io/docs/image-transformation#default-image---di}
     */
    defaultImage?: string;

    /**
     * It is used to flip/mirror an image horizontally, vertically, or in both directions.
     * Possible values - h (horizontal), v (vertical), h_v (horizontal and vertical)
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#flip---fl}
     */
    flip?: "h" | "v" | "h_v" | "v_h";

    /**
     * Whether to serve the original file without any transformations if `true`.
     * 
     * {@link https://imagekit.io/docs/core-delivery-features#deliver-original-file-as-is---orig-true}
     */
    original?: boolean;

    /**
     * Start offset (in seconds) for trimming videos. e.g., `5` or `"10.5"`. 
     * Also supports arithmetic expressions.
     * 
     * {@link https://imagekit.io/docs/trim-videos#start-offset---so}
     */
    startOffset?: number | string;

    /**
     * End offset (in seconds) for trimming videos. e.g., `5` or `"10.5"`.
     * Usually used with `startOffset` to define a time window. 
     * Also supports arithmetic expressions.
     * 
     * {@link https://imagekit.io/docs/trim-videos#end-offset---eo}
     */
    endOffset?: number | string;

    /**
     * Duration (in seconds) for trimming videos. e.g., `5` or `"10.5"`.
     * Typically used with `startOffset` to specify length from the start point. 
     * Also supports arithmetic expressions.
     * 
     * {@link https://imagekit.io/docs/trim-videos#duration---du}
     */
    duration?: number | string;

    /**
     * Provide an array of resolutions (e.g. `["240", "360", "480", "720", "1080"]`).
     * 
     * {@link https://imagekit.io/docs/adaptive-bitrate-streaming}
     */
    streamingResolutions?: StreamingResolution[];

    /**
     * Enable grayscale effect for images.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#grayscale---e-grayscale}
     */
    grayscale?: true;

    /**
     * Upscale images beyond their original dimensions with AI.
     * 
     * {@link https://imagekit.io/docs/ai-transformations#upscale-e-upscale}
     */
    aiUpscale?: true

    /**
     * Retouch (AI-based) for improving faces or product shots.
     * 
     * {@link https://imagekit.io/docs/ai-transformations#retouch-e-retouch}
     */
    aiRetouch?: true

    /**
     * Generate variation of an image using AI. This will generate a new image with slight variations from the original image. The variations include changes in color, texture, and other visual elements. However, the model will try to preserve the structure and essence of the original image.
     * 
     * {@link https://imagekit.io/docs/ai-transformations#generate-variations-of-an-image-e-genvar}
     */
    aiVariation?: true

    /**
     * Add an AI-based drop shadow around a foreground object on a transparent or removed background.
     * Optionally, you can control the direction, elevation, and saturation of the light source. E.g. change light direction `az-45`.
     * 
     * Pass `true` for default drop shadow or a string for custom drop shadow.
     * 
     * {@link https://imagekit.io/docs/ai-transformations#ai-drop-shadow-e-dropshadow}
     */
    aiDropShadow?: true | string

    /**
     * Change background using AI. Provide a prompt or base64-encoded prompt. e.g. `prompt-snow road` or `prompte-[urlencoded_base64_encoded_text]`.
     * 
     * {@link https://imagekit.io/docs/ai-transformations#change-background-e-changebg}
     */
    aiChangeBackground?: string;

    /**
     * ImageKit’s in-house background removal.
     * 
     * {@link https://imagekit.io/docs/ai-transformations#imagekit-background-removal-e-bgremove}
     */
    aiRemoveBackground?: true

    /**
     * Use third-party background removal. Use `aiRemoveBackground` - ImageKit's in-house background removal which is 90% cheaper.
     * 
     * {@link https://imagekit.io/docs/ai-transformations#background-removal-e-removedotbg}
     */
    aiRemoveBackgroundExternal?: true

    /**
     * Auto-enhance contrast for an image (contrast stretch).
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#contrast-stretch---e-contrast}
     */
    contrastStretch?: true

    /**
     * This adds a shadow under solid objects in an input image with a transparent background. Check `eDropshadow` for AI-based shadows.
     * 
     * Pass `true` for default shadow or a string for custom shadow.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#shadow---e-shadow}
     */
    shadow?: true | string

    /**
     * It is used to sharpen the input image. It is useful when highlighting the edges and finer details within an image.
     * 
     * Pass `true` for default sharpening or a number for custom sharpening.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#sharpen---e-sharpen}
     */
    sharpen?: true | number

    /**
     * Unsharp Masking (USM) is an image sharpening technique. This transform allows you to apply and control unsharp masks on your images.
     * 
     * Pass `true` for default unsharp mask or a string for custom unsharp mask.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#unsharp-mask---e-usm}
     */
    unsharpMask?: true | string;

    /**
     * The gradient formed is a linear gradient containing two colors, and it can be customized.
     * 
     * Pass `true` for default gradient or a string for custom gradient.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#gradient---e-gradient}
     */
    gradient?: true | string;

    /**
     * Used to specify whether the output JPEG image must be rendered progressively. In progressive loading, the output image renders as a low-quality pixelated full image, which, over time, keeps on adding more pixels and information to the image.  This helps you maintain a fast perceived load time.
     * 
     * {@link https://imagekit.io/docs/image-optimization#progressive-image---pr}
     */
    progressive?: boolean;

    /**
     * Used to specify whether the output image (if in JPEG or PNG) must be compressed losslessly.
     * 
     * {@link https://imagekit.io/docs/image-optimization#lossless-webp-and-png---lo}
     */
    lossless?: boolean

    /**
     * It specifies whether the output image should contain the color profile initially available with the original image.
     * 
     * {@link https://imagekit.io/docs/image-optimization#color-profile---cp}
     */
    colorProfile?: boolean;

    /**
     * By default, ImageKit removes all metadata as part of automatic image compression. Set this to `true` to preserve metadata.
     * 
     * {@link https://imagekit.io/docs/image-optimization#image-metadata---md}
     */
    metadata?: boolean;

    /**
     * It is used to specify the opacity level of the output image.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#opacity---o}
     */
    opacity?: number;

    /**
     * Useful with images that have a solid or nearly solid background with the object in the center. This parameter trims the background from the image, leaving only the central object in the output image.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#trim-edges---t}
     */
    trim?: true | number;

    /**
     * This parameter accepts a number that determines how much to zoom in or out of the cropped area.
     * It must be used along with fo-face or fo-<object_name>
     * 
     * {@link https://imagekit.io/docs/image-resize-and-crop#zoom---z}
     */
    zoom?: number;

    /**
     * Extract specific page/frame from multi-page or layered files (PDF, PSD, AI),
     * Pick by number e.g., `2`. Or 2nd and 3rd layers combined using `3-4`.
     * Or pick a layer from PSD by name, e.g., `name-layer-4`.
     * 
     * {@link https://imagekit.io/docs/vector-and-animated-images#get-thumbnail-from-psd-pdf-ai-eps-and-animated-files}
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


