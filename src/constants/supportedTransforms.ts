/**
 * @link https://docs.imagekit.io/features/image-transformations
 */
const supportedTransforms: { [key: string]: string } = {
  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#width-w
   */
  width: "w",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#height-h
   */
  height: "h",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#aspect-ratio-ar
   */
  aspectRatio: "ar",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#quality-q
   */
  quality: "q",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#crop-crop-modes-and-focus
   */
  crop: "c",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#crop-crop-modes-and-focus
   */
  cropMode: "cm",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#focus-fo
   */
  focus: "fo",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#examples-focus-using-cropped-image-coordinates
   */
  x: "x",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#examples-focus-using-cropped-image-coordinates
   */
  y: "y",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#format-f
   */
  format: "f",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#radius-r
   */
  radius: "r",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#background-color-bg
   */
  background: "bg",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#border-b
   */
  border: "b",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#rotate-rt
   */
  rotation: "rt",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#rotate-rt
   */
  rotate: "rt",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#blur-bl
   */
  blur: "bl",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#named-transformation-n
   */
  named: "n",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#progressive-image-pr
   */
  progressive: "pr",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#lossless-webp-and-png-lo
   */
  lossless: "lo",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#trim-edges-t
   */
  trim: "t",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#image-metadata-md
   */
  metadata: "md",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#color-profile-cp
   */
  colorProfile: "cp",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#default-image-di
   */
  defaultImage: "di",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#dpr-dpr
   */
  dpr: "dpr",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/image-enhancement-and-color-manipulation#sharpen-e-sharpen
   */
  effectSharpen: "e-sharpen",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/image-enhancement-and-color-manipulation#unsharp-mask-e-usm
   */
  effectUSM: "e-usm",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/image-enhancement-and-color-manipulation#contrast-stretch-e-contrast
   */
  effectContrast: "e-contrast",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#grayscale-e-grayscale
   */
  effectGray: "e-grayscale",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/resize-crop-and-other-transformations#original-image-orig
   */
  original: "orig",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/image-enhancement-and-color-manipulation#shadow-e-shadow
   */
  effectShadow: "e-shadow",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/image-enhancement-and-color-manipulation#gradient-e-gradient
   */
  effectGradient: "e-gradient",

  /**
   * @link https://docs.imagekit.io/features/image-transformations/conditional-transformations
   */
   raw: "raw",
}


export default supportedTransforms