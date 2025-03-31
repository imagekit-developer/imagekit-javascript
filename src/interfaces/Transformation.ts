export type TransformationPosition = "path" | "query";

export type StreamingResolution = "240" | "360" | "480" | "720" | "1080" | "1440" | "2160";

/**
 * The SDK provides easy-to-use names for transformations. These names are converted to the corresponding transformation string before being added to the URL.
 * SDKs are updated regularly to support new transformations. If you want to use a transformation that is not supported by the SDK, you can use the `raw` parameter to pass the transformation string directly.
 * 
 * {@link https://imagekit.io/docs/transformations|Transformations Documentation}
 */
export interface Transformation {
    /**
     * Specifies the width of the output. If a value between 0 and 1 is provided, it is treated as a percentage
     * (e.g., `0.4` represents 40% of the original width). You can also supply arithmetic expressions (e.g., `iw_div_2`).
     * 
     * Width transformation - {@link https://imagekit.io/docs/image-resize-and-crop#width---w|Images} | {@link https://imagekit.io/docs/video-resize-and-crop#width---w|Videos}
     */
    width?: number | string;

    /**
     * Specifies the height of the output. If a value between 0 and 1 is provided, it is treated as a percentage
     * (e.g., `0.5` represents 50% of the original height). You can also supply arithmetic expressions (e.g., `ih_mul_0.5`).
     * 
     * Height transformation - {@link https://imagekit.io/docs/image-resize-and-crop#height---h|Images} | {@link https://imagekit.io/docs/video-resize-and-crop#height---h|Videos}
     */
    height?: number | string;

    /**
     * Specifies the aspect ratio for the output, e.g., "ar-4-3". Typically used with either width or height (but not both).
     * For example: aspectRatio = `4:3`, `4_3`, or an expression like `iar_div_2`.
     * 
     * {@link https://imagekit.io/docs/image-resize-and-crop#aspect-ratio---ar|Image Resize and Crop - Aspect Ratio}
     */
    aspectRatio?: number | string;

    /**
     * Specifies the background to be used in conjunction with certain cropping strategies when resizing an image.
     * - A solid color: e.g., `red`, `F3F3F3`, `AAFF0010`.
     * 
     *   {@link https://imagekit.io/docs/effects-and-enhancements#solid-color-background|Effects and Enhancements - Solid Color Background}
     * 
     * - A blurred background: e.g., `blurred`, `blurred_25_N15`, etc.
     * 
     *   {@link https://imagekit.io/docs/effects-and-enhancements#blurred-background|Effects and Enhancements - Blurred Background}
     * 
     * - Expand the image boundaries using generative fill: `genfill`. Not supported inside overlay. Optionally, control the background scene by passing a text prompt:
     *   `genfill[:-prompt-${text}]` or `genfill[:-prompte-${urlencoded_base64_encoded_text}]`.
     *   
     *   {@link https://imagekit.io/docs/ai-transformations#generative-fill-bg-genfill|AI Transformations - Generative Fill Background}
     */
    background?: string;

    /**
     * Adds a border to the output media. Accepts a string in the format `<border-width>_<hex-code>`
     * (e.g., `5_FFF000` for a 5px yellow border), or an expression like `ih_div_20_FF00FF`.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#border---b|Effects and Enhancements - Border}
     */
    border?: string;

    /**
     * {@link https://imagekit.io/docs/image-resize-and-crop#crop-crop-modes--focus|Image Resize and Crop - Crop Modes}
     */
    crop?: "force" | "at_max" | "at_max_enlarge" | "at_least" | "maintain_ratio";

    /**
     * {@link https://imagekit.io/docs/image-resize-and-crop#crop-crop-modes--focus|Image Resize and Crop - Crop Modes}
     */
    cropMode?: "pad_resize" | "extract" | "pad_extract";

    /**
     * Accepts values between 0.1 and 5, or `auto` for automatic device pixel ratio (DPR) calculation.
     * 
     * {@link https://imagekit.io/docs/image-resize-and-crop#dpr---dpr|Image Resize and Crop - DPR}
     */
    dpr?: number

    /**
     * This parameter can be used with pad resize, maintain ratio, or extract crop to modify the padding or cropping behavior.
     * 
     * {@link https://imagekit.io/docs/image-resize-and-crop#focus---fo|Image Resize and Crop - Focus}
     */
    focus?: string;

    /**
     * Specifies the quality of the output image for lossy formats such as JPEG, WebP, and AVIF.
     * A higher quality value results in a larger file size with better quality, while a lower value produces a smaller file size with reduced quality.
     * 
     * {@link https://imagekit.io/docs/image-optimization#quality---q|Image Optimization - Quality}
     */
    quality?: number;

    /**
     * {@link https://imagekit.io/docs/image-resize-and-crop#example---focus-using-cropped-image-coordinates|Image Resize and Crop - Focus Using Cropped Image Coordinates}
     */
    x?: number | string;

    /**
     * {@link https://imagekit.io/docs/image-resize-and-crop#example---focus-using-cropped-image-coordinates|Image Resize and Crop - Focus Using Cropped Image Coordinates}
     */
    xCenter?: number | string;

    /**
     * {@link https://imagekit.io/docs/image-resize-and-crop#example---focus-using-cropped-image-coordinates|Image Resize and Crop - Focus Using Cropped Image Coordinates}
     */
    y?: number | string;

    /**
     * {@link https://imagekit.io/docs/image-resize-and-crop#example---focus-using-cropped-image-coordinates|Image Resize and Crop - Focus Using Cropped Image Coordinates}
     */
    yCenter?: number | string;

    /**
     * Specifies the output format for images or videos, e.g., `jpg`, `png`, `webp`, `mp4`, or `auto`.
     * You can also pass `orig` for images to return the original format.
     * ImageKit automatically delivers images and videos in the optimal format based on device support unless overridden by the dashboard settings or the format parameter.
     * 
     * {@link https://imagekit.io/docs/image-optimization#format---f|Image Optimization - Format} & {@link https://imagekit.io/docs/video-optimization#format---f|Video Optimization - Format}
     */
    format?: "auto" | "webp" | "jpg" | "jpeg" | "png" | "gif" | "svg" | "mp4" | "webm" | "avif" | "orig";

    /**
     * Specifies the video codec, e.g., `h264`, `vp9`, `av1`, or `none`.
     * 
     * {@link https://imagekit.io/docs/video-optimization#video-codec---vc|Video Optimization - Video Codec}
     */
    videoCodec?: "h264" | "vp9" | "av1" | "none";

    /**
     * Specifies the audio codec, e.g., `aac`, `opus`, or `none`.
     * 
     * {@link https://imagekit.io/docs/video-optimization#audio-codec---ac|Video Optimization - Audio Codec}
     */
    audioCodec?: "aac" | "opus" | "none";

    /**
     * Specifies the corner radius for rounded corners (e.g., 20) or `max` for circular/oval shapes.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#radius---r|Effects and Enhancements - Radius}
     */
    radius?: number | "max";

    /**
     * Specifies the rotation angle in degrees. Positive values rotate the image clockwise; you can also use, for example, `N40` for counterclockwise rotation
     * or `auto` to use the orientation specified in the image's EXIF data.
     * For videos, only the following values are supported: 0, 90, 180, 270, or 360.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#rotate---rt|Effects and Enhancements - Rotate}
     */
    rotation?: number | string;

    /**
     * Specifies the Gaussian blur level. Accepts an integer value between 1 and 100, or an expression like `bl-10`.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#blur---bl|Effects and Enhancements - Blur}
     */
    blur?: number;

    /**
     * {@link https://imagekit.io/docs/transformations#named-transformations|Transformations - Named Transformations}
     */
    named?: string;

    /**
     * Specifies a fallback image if the resource is not found, e.g., a URL or file path.
     * 
     * {@link https://imagekit.io/docs/image-transformation#default-image---di|Image Transformation - Default Image}
     */
    defaultImage?: string;

    /**
     * Flips or mirrors an image either horizontally, vertically, or both.
     * Acceptable values: `h` (horizontal), `v` (vertical), `h_v` (horizontal and vertical), or `v_h`.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#flip---fl|Effects and Enhancements - Flip}
     */
    flip?: "h" | "v" | "h_v" | "v_h";

    /**
     * If set to true, serves the original file without applying any transformations.
     * 
     * {@link https://imagekit.io/docs/core-delivery-features#deliver-original-file-as-is---orig-true|Core Delivery Features - Deliver Original File As Is}
     */
    original?: boolean;

    /**
     * Specifies the start offset (in seconds) for trimming videos, e.g., `5` or `10.5`.
     * Arithmetic expressions are also supported.
     * 
     * {@link https://imagekit.io/docs/trim-videos#start-offset---so|Trim Videos - Start Offset}
     */
    startOffset?: number | string;

    /**
     * Specifies the end offset (in seconds) for trimming videos, e.g., `5` or `10.5`.
     * Typically used with startOffset to define a time window. Arithmetic expressions are supported.
     * 
     * {@link https://imagekit.io/docs/trim-videos#end-offset---eo|Trim Videos - End Offset}
     */
    endOffset?: number | string;

    /**
     * Specifies the duration (in seconds) for trimming videos, e.g., `5` or `10.5`.
     * Typically used with startOffset to indicate the length from the start offset. Arithmetic expressions are supported.
     * 
     * {@link https://imagekit.io/docs/trim-videos#duration---du|Trim Videos - Duration}
     */
    duration?: number | string;

    /**
     * An array of resolutions for adaptive bitrate streaming, e.g., [`240`, `360`, `480`, `720`, `1080`].
     * 
     * {@link https://imagekit.io/docs/adaptive-bitrate-streaming|Adaptive Bitrate Streaming}
     */
    streamingResolutions?: StreamingResolution[];

    /**
     * Enables a grayscale effect for images.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#grayscale---e-grayscale|Effects and Enhancements - Grayscale}
     */
    grayscale?: true;

    /**
     * Upscales images beyond their original dimensions using AI. Not supported inside overlay.
     * 
     * {@link https://imagekit.io/docs/ai-transformations#upscale-e-upscale|AI Transformations - Upscale}
     */
    aiUpscale?: true

    /**
     * Performs AI-based retouching to improve faces or product shots. Not supported inside overlay.
     * 
     * {@link https://imagekit.io/docs/ai-transformations#retouch-e-retouch|AI Transformations - Retouch}
     */
    aiRetouch?: true

    /**
     * Generates a variation of an image using AI. This produces a new image with slight variations from the original,
     * such as changes in color, texture, and other visual elements, while preserving the structure and essence of the original image. Not supported inside overlay.
     * 
     * {@link https://imagekit.io/docs/ai-transformations#generate-variations-of-an-image-e-genvar|AI Transformations - Generate Variations}
     */
    aiVariation?: true

    /**
     * Adds an AI-based drop shadow around a foreground object on a transparent or removed background.
     * Optionally, control the direction, elevation, and saturation of the light source (e.g., `az-45` to change light direction).
     * Pass `true` for the default drop shadow, or provide a string for a custom drop shadow.
     * Supported inside overlay.
     * 
     * {@link https://imagekit.io/docs/ai-transformations#ai-drop-shadow-e-dropshadow|AI Transformations - Drop Shadow}
     */
    aiDropShadow?: true | string

    /**
     * Uses AI to change the background. Provide a text prompt or a base64-encoded prompt,
     * e.g., `prompt-snow road` or `prompte-[urlencoded_base64_encoded_text]`.
     * Not supported inside overlay.
     * 
     * {@link https://imagekit.io/docs/ai-transformations#change-background-e-changebg|AI Transformations - Change Background}
     */
    aiChangeBackground?: string;

    /**
     * Applies ImageKit’s in-house background removal.
     * Supported inside overlay.
     * 
     * {@link https://imagekit.io/docs/ai-transformations#imagekit-background-removal-e-bgremove|AI Transformations - Background Removal}
     */
    aiRemoveBackground?: true

    /**
     * Uses third-party background removal.
     * Note: It is recommended to use aiRemoveBackground, ImageKit’s in-house solution, which is more cost-effective.
     * Supported inside overlay.
     * 
     * {@link https://imagekit.io/docs/ai-transformations#background-removal-e-removedotbg|AI Transformations - External Background Removal}
     */
    aiRemoveBackgroundExternal?: true

    /**
     * Automatically enhances the contrast of an image (contrast stretch).
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#contrast-stretch---e-contrast|Effects and Enhancements - Contrast Stretch}
     */
    contrastStretch?: true

    /**
     * Adds a shadow beneath solid objects in an image with a transparent background.
     * For AI-based drop shadows, refer to aiDropShadow.
     * Pass `true` for a default shadow, or provide a string for a custom shadow.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#shadow---e-shadow|Effects and Enhancements - Shadow}
     */
    shadow?: true | string

    /**
     * Sharpens the input image, highlighting edges and finer details.
     * Pass `true` for default sharpening, or provide a numeric value for custom sharpening.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#sharpen---e-sharpen|Effects and Enhancements - Sharpen}
     */
    sharpen?: true | number

    /**
     * Applies Unsharp Masking (USM), an image sharpening technique.
     * Pass `true` for a default unsharp mask, or provide a string for a custom unsharp mask.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#unsharp-mask---e-usm|Effects and Enhancements - Unsharp Mask}
     */
    unsharpMask?: true | string;

    /**
     * Creates a linear gradient with two colors. Pass `true` for a default gradient, or provide a string for a custom gradient.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#gradient---e-gradient|Effects and Enhancements - Gradient}
     */
    gradient?: true | string;

    /**
     * Specifies whether the output JPEG image should be rendered progressively. Progressive loading begins with a low-quality,
     * pixelated version of the full image, which gradually improves to provide a faster perceived load time.
     * 
     * {@link https://imagekit.io/docs/image-optimization#progressive-image---pr|Image Optimization - Progressive Image}
     */
    progressive?: boolean;

    /**
     * Specifies whether the output image (in JPEG or PNG) should be compressed losslessly.
     * 
     * {@link https://imagekit.io/docs/image-optimization#lossless-webp-and-png---lo|Image Optimization - Lossless Compression}
     */
    lossless?: boolean

    /**
     * Indicates whether the output image should retain the original color profile.
     * 
     * {@link https://imagekit.io/docs/image-optimization#color-profile---cp|Image Optimization - Color Profile}
     */
    colorProfile?: boolean;

    /**
     * By default, ImageKit removes all metadata during automatic image compression.
     * Set this to true to preserve metadata.
     * 
     * {@link https://imagekit.io/docs/image-optimization#image-metadata---md|Image Optimization - Image Metadata}
     */
    metadata?: boolean;

    /**
     * Specifies the opacity level of the output image.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#opacity---o|Effects and Enhancements - Opacity}
     */
    opacity?: number;

    /**
     * Useful for images with a solid or nearly solid background and a central object. This parameter trims the background,
     * leaving only the central object in the output image.
     * 
     * {@link https://imagekit.io/docs/effects-and-enhancements#trim-edges---t|Effects and Enhancements - Trim Edges}
     */
    trim?: true | number;

    /**
     * Accepts a numeric value that determines how much to zoom in or out of the cropped area.
     * It should be used in conjunction with fo-face or fo-<object_name>.
     * 
     * {@link https://imagekit.io/docs/image-resize-and-crop#zoom---z|Image Resize and Crop - Zoom}
     */
    zoom?: number;

    /**
     * Extracts a specific page or frame from multi-page or layered files (PDF, PSD, AI).
     * For example, specify by number (e.g., `2`), a range (e.g., `3-4` for the 2nd and 3rd layers),
     * or by name (e.g., `name-layer-4` for a PSD layer).
     * 
     * {@link https://imagekit.io/docs/vector-and-animated-images#get-thumbnail-from-psd-pdf-ai-eps-and-animated-files|Vector and Animated Images - Thumbnail Extraction}
     */
    page?: number | string;

    /**
     * Pass any transformation not directly supported by the SDK.
     * This transformation string is appended to the URL as provided.
     */
    raw?: string;


    /**
     * Specifies an overlay to be applied on the parent image or video.
     * ImageKit supports overlays including images, text, videos, subtitles, and solid colors.
     * 
     * {@link https://imagekit.io/docs/transformations#overlay-using-layers|Transformations - Overlay Using Layers}
     */
    overlay?: Overlay;
}

export type Overlay =
    | TextOverlay
    | ImageOverlay
    | VideoOverlay
    | SubtitleOverlay
    | SolidColorOverlay

export interface BaseOverlay {
    /**
     * Specifies the overlay's position relative to the parent asset.
     * Accepts a JSON object with `x` and `y` (or `focus`) properties.
     * 
     * {@link https://imagekit.io/docs/transformations#position-of-layer|Transformations - Position of Layer}
     */
    position?: OverlayPosition;

    /**
     * Specifies timing information for the overlay (only applicable if the base asset is a video).
     * Accepts a JSON object with `start` (`lso`), `end` (`leo`), and `duration` (`ldu`) properties.
     * 
     * {@link https://imagekit.io/docs/transformations#position-of-layer|Transformations - Position of Layer}
     */
    timing?: OverlayTiming;
}

export interface OverlayPosition {
    /**
     * Specifies the x-coordinate of the top-left corner of the base asset where the overlay's top-left corner will be positioned.
     * It also accepts arithmetic expressions such as `bw_mul_0.4` or `bw_sub_cw`.
     * Maps to `lx` in the URL.
     * 
     * Learn about [Arithmetic expressions](https://imagekit.io/docs/arithmetic-expressions-in-transformations)
     */
    x?: number | string;

    /**
     * Specifies the y-coordinate of the top-left corner of the base asset where the overlay's top-left corner will be positioned.
     * It also accepts arithmetic expressions such as `bh_mul_0.4` or `bh_sub_ch`.
     * Maps to `ly` in the URL.
     * 
     * Learn about [Arithmetic expressions](https://imagekit.io/docs/arithmetic-expressions-in-transformations)
     */
    y?: number | string;

    /**
     * Specifies the position of the overlay relative to the parent image or video.
     * Acceptable values: `center`, `top`, `left`, `bottom`, `right`, `top_left`, `top_right`, `bottom_left`, or `bottom_right`.
     * Maps to `lfo` in the URL.
     */
    focus?: `center` | `top` | `left` | `bottom` | `right` | `top_left` | `top_right` | `bottom_left` | `bottom_right`;
}

export interface OverlayTiming {
    /**
     * Specifies the start time (in seconds) for when the overlay should appear on the base video.
     * Accepts a positive number up to two decimal places (e.g., `20` or `20.50`) and arithmetic expressions such as `bdu_mul_0.4` or `bdu_sub_idu`.
     * Applies only if the base asset is a video.
     * 
     * Maps to `lso` in the URL.
     */
    start?: number | string;

    /**
     * Specifies the duration (in seconds) during which the overlay should appear on the base video.
     * Accepts a positive number up to two decimal places (e.g., `20` or `20.50`) and arithmetic expressions such as `bdu_mul_0.4` or `bdu_sub_idu`.
     * Applies only if the base asset is a video.
     * 
     * Maps to `ldu` in the URL.
     */
    duration?: number | string;

    /**
     * Specifies the end time (in seconds) for when the overlay should disappear from the base video.
     * If both end and duration are provided, duration is ignored.
     * Accepts a positive number up to two decimal places (e.g., `20` or `20.50`) and arithmetic expressions such as `bdu_mul_0.4` or `bdu_sub_idu`.
     * Applies only if the base asset is a video.
     * 
     * Maps to `leo` in the URL.
     */
    end?: number | string;
}

export interface TextOverlay extends BaseOverlay {
    type: "text";

    /**
     * Specifies the text to be displayed in the overlay. The SDK automatically handles special characters and encoding.
     */
    text: string;

    /**
     * Text can be included in the layer as either `i-{input}` (plain text) or `ie-{base64_encoded_input}` (base64). 
     * By default, the SDK selects the appropriate format based on the input text. 
     * To always use base64 (`ie-{base64}`), set this parameter to `base64`. 
     * To always use plain text (`i-{input}`), set it to `plain`.
     * 
     * Regardless of the encoding method, the input text is always percent-encoded to ensure it is URL-safe.
     */

    encoding: "auto" | "plain" | "base64";

    /**
     * Control styling of the text overlay.
     */
    transformation?: TextOverlayTransformation[];
}

export interface ImageOverlay extends BaseOverlay {
    type: "image";

    /**
     * Specifies the relative path to the image used as an overlay.
     */
    input: string;

    /**
     * The input path can be included in the layer as either `i-{input}` or `ie-{base64_encoded_input}`. 
     * By default, the SDK determines the appropriate format automatically. 
     * To always use base64 encoding (`ie-{base64}`), set this parameter to `base64`. 
     * To always use plain text (`i-{input}`), set it to `plain`.
     * 
     * Regardless of the encoding method:
     * - Leading and trailing slashes are removed.
     * - Remaining slashes within the path are replaced with `@@` when using plain text.
     */
    encoding: "auto" | "plain" | "base64";

    /**
     * Array of transformations to be applied to the overlay image. Supported transformations depends on the base/parent asset.
     * 
     * {@link https://imagekit.io/docs/add-overlays-on-images#list-of-supported-image-transformations-in-image-layers|Image} | {@link https://imagekit.io/docs/add-overlays-on-videos#list-of-transformations-supported-on-image-overlay|Video}
     */
    transformation?: Transformation[];
}

export interface VideoOverlay extends BaseOverlay {
    type: "video";
    /**
     * Specifies the relative path to the video used as an overlay.
     */
    input: string;

    /**
     * The input path can be included in the layer as either `i-{input}` or `ie-{base64_encoded_input}`. 
     * By default, the SDK determines the appropriate format automatically. 
     * To always use base64 encoding (`ie-{base64}`), set this parameter to `base64`. 
     * To always use plain text (`i-{input}`), set it to `plain`.
     * 
     * Regardless of the encoding method:
     * - Leading and trailing slashes are removed.
     * - Remaining slashes within the path are replaced with `@@` when using plain text.
     */
    encoding: "auto" | "plain" | "base64";

    /**
     * Array of transformation to be applied to the overlay video. Except `streamingResolutions`, all other video transformations are supported.
     * 
     * {@link https://imagekit.io/docs/video-transformation|Video Transformations}
     */
    transformation?: Transformation[];
}

export interface SubtitleOverlay extends BaseOverlay {
    type: "subtitle";
    /**
     * Specifies the relative path to the subtitle file used as an overlay.
     */
    input: string;

    /**
     * The input path can be included in the layer as either `i-{input}` or `ie-{base64_encoded_input}`. 
     * By default, the SDK determines the appropriate format automatically. 
     * To always use base64 encoding (`ie-{base64}`), set this parameter to `base64`. 
     * To always use plain text (`i-{input}`), set it to `plain`.
     * 
     * Regardless of the encoding method:
     * - Leading and trailing slashes are removed.
     * - Remaining slashes within the path are replaced with `@@` when using plain text.
     */
    encoding: "auto" | "plain" | "base64";

    /**
     * Control styling of the subtitle.
     * 
     * {@link https://imagekit.io/docs/add-overlays-on-videos#styling-controls-for-subtitles-layer|Styling subtitles}
     */
    transformation?: SubtitleOverlayTransformation[];
}

export interface SolidColorOverlay extends BaseOverlay {
    type: "solidColor";
    /**
     * Specifies the color of the block using an RGB hex code (e.g., `FF0000`), an RGBA code (e.g., `FFAABB50`), or a color name (e.g., `red`).
     * If an 8-character value is provided, the last two characters represent the opacity level (from `00` for 0.00 to `99` for 0.99).
     */
    color: string;

    /**
     * Control width and height of the solid color overlay. Supported transformations depend on the base/parent asset.
     * 
     * {@link https://imagekit.io/docs/add-overlays-on-images#apply-transformation-on-solid-color-overlay|Image} | {@link https://imagekit.io/docs/add-overlays-on-videos#apply-transformations-on-solid-color-block-overlay|Video}
     */
    transformation?: SolidColorOverlayTransformation[];
}

export type TextOverlayTransformation = {
    /**
     * Specifies the maximum width (in pixels) of the overlaid text. The text wraps automatically, and arithmetic expressions (e.g., `bw_mul_0.2` or `bh_div_2`) are supported. Useful when used in conjunction with the `background`.
     */
    width?: number | string;

    /**
     * Specifies the font size of the overlaid text. Accepts a numeric value or an arithmetic expression.
     */
    fontSize?: number | string;

    /**
     * Specifies the font family of the overlaid text. Choose from the [supported fonts list](https://imagekit.io/docs/add-overlays-on-images#supported-text-font-list) or use a [custom font](https://imagekit.io/docs/add-overlays-on-images#change-font-family-in-text-overlay).
     */
    fontFamily?: string;

    /**
     * Specifies the font color of the overlaid text. Accepts an RGB hex code (e.g., `FF0000`), an RGBA code (e.g., `FFAABB50`), or a color name.
     */
    fontColor?: string;

    /**
     * Specifies the inner alignment of the text when width is more than the text length.
     * Supported values: `left`, `right`, and `center` (default).
     */
    innerAlignment?: "left" | "right" | "center";

    /**
     * Specifies the padding around the overlaid text.
     * Can be provided as a single positive integer or multiple values separated by underscores (following CSS shorthand order).
     * Arithmetic expressions are also accepted.
     */
    padding?: number | string;

    /**
     * Specifies the transparency level of the text overlay. Accepts integers from `1` to `9`.
     */
    alpha?: number;

    /**
     * Specifies the typography style of the text.
     * Supported values: `b` for bold, `i` for italics, and `b_i` for bold with italics.
     */
    typography?: "b" | "i" | "b_i";

    /**
     * Specifies the background color of the text overlay.
     * Accepts an RGB hex code, an RGBA code, or a color name.
     */
    background?: string;

    /**
     * Specifies the corner radius of the text overlay.
     * Set to `max` to achieve a circular or oval shape.
     */
    radius?: number | "max";

    /**
     * Specifies the rotation angle of the text overlay.
     * Accepts a numeric value for clockwise rotation or a string prefixed with "N" for counter-clockwise rotation.
     */
    rotation?: number | string;

    /**
     * Flip/mirror the text horizontally, vertically, or in both directions.
     * Acceptable values: `h` (horizontal), `v` (vertical), `h_v` (horizontal and vertical), or `v_h`.
     */
    flip?: "h" | "v" | "h_v" | "v_h";

    /**
     * Specifies the line height for multi-line text overlays. It will come into effect only if the text wraps over multiple lines.
     * Accepts either an integer value or an arithmetic expression.
     */
    lineHeight?: number | string;
}

export type SubtitleOverlayTransformation = {
    /**
     * Specifies the subtitle background color using a standard color name, an RGB color code (e.g., `FF0000`), or an RGBA color code (e.g., `FFAABB50`).
     */
    background?: string;
    /**
     * Sets the font size of subtitle text.
     */
    fontSize?: number | string;
    /**
     * Sets the font family of subtitle text.
     * Refer to the [supported fonts documented](https://imagekit.io/docs/add-overlays-on-images#supported-text-font-list) in the ImageKit transformations guide.
     */
    fontFamily?: string;
    /**
     * Sets the font color of the subtitle text using a standard color name, an RGB color code (e.g., `FF0000`), or an RGBA color code (e.g., `FFAABB50`).
     */
    color?: string;
    /**
     * Sets the typography style of the subtitle text.
     * Supported values: `b` for bold, `i` for italics, and `b_i` for bold with italics.
     */
    typography?: "b" | "i" | "b_i";
    /**
     * Sets the font outline of the subtitle text.
     * Requires the outline width (an integer) and the outline color (as an RGB color code, RGBA color code, or standard web color name) separated by an underscore.
     * Examples: `2_blue`, `2_A1CCDD`, or `2_A1CCDD50`.
     */
    fontOutline?: string;
    /**
     * Sets the font shadow for the subtitle text.
     * Requires the shadow color (as an RGB color code, RGBA color code, or standard web color name) and the shadow indent (an integer) separated by an underscore.
     * Examples: `blue_2`, `A1CCDD_3`, or `A1CCDD50_3`.
     */
    fontShadow?: string;
}

export type SolidColorOverlayTransformation = Pick<Transformation, "width" | "height" | "radius"> & {
    /**
     * Specifies the transparency level of the overlaid solid color layer. Supports integers from `1` to `9`.
     */
    alpha?: number;
}
