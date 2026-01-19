/**
 * {@link https://imagekit.io/docs/transformations}
 */
export const supportedTransforms: { [key: string]: string } = {
  // Basic sizing & layout
  width: "w",
  height: "h",
  aspectRatio: "ar",
  background: "bg",
  border: "b",
  crop: "c",
  cropMode: "cm",
  dpr: "dpr",
  focus: "fo",
  quality: "q",
  x: "x",
  xCenter: "xc",
  y: "y",
  yCenter: "yc",
  format: "f",
  videoCodec: "vc",
  audioCodec: "ac",
  radius: "r",
  rotation: "rt",
  blur: "bl",
  named: "n",
  defaultImage: "di",
  flip: "fl",
  original: "orig",
  startOffset: "so",
  endOffset: "eo",
  duration: "du",
  streamingResolutions: "sr",

  // AI & advanced effects
  grayscale: "e-grayscale",
  aiUpscale: "e-upscale",
  aiRetouch: "e-retouch",
  aiVariation: "e-genvar",
  aiDropShadow: "e-dropshadow",
  aiChangeBackground: "e-changebg",
  aiEdit: "e-edit",
  aiRemoveBackground: "e-bgremove",
  aiRemoveBackgroundExternal: "e-removedotbg",
  contrastStretch: "e-contrast",
  shadow: "e-shadow",
  sharpen: "e-sharpen",
  unsharpMask: "e-usm",
  gradient: "e-gradient",
  colorReplace: "cr",
  distort: "e-distort",

  // Other flags & finishing
  progressive: "pr",
  lossless: "lo",
  colorProfile: "cp",
  metadata: "md",
  opacity: "o",
  trim: "t",
  zoom: "z",
  page: "pg",
  layerMode: "lm",

  // Text overlay transformations which are not defined yet
  fontSize: "fs",
  fontFamily: "ff",
  fontColor: "co",
  innerAlignment: "ia",
  padding: "pa",
  alpha: "al",
  typography: "tg",
  lineHeight: "lh",

  // Subtitles transformations which are not defined
  fontOutline: "fol",
  fontShadow: "fsh",

  // Raw pass-through
  raw: "raw",
};



export default supportedTransforms