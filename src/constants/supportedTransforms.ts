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

  // Old deprecated mappings
  effectSharpen: "e-sharpen",
  effectUSM: "e-usm",
  effectContrast: "e-contrast",
  effectGray: "e-grayscale",
  effectShadow: "e-shadow",
  effectGradient: "e-gradient",
  rotate: "rt",

  // AI & advanced effects
  grayscale: "e-grayscale",
  aiUpscale: "e-upscale",
  aiRetouch: "e-retouch",
  aiVariation: "e-genvar",
  aiDropShadow: "e-dropshadow",
  aiChangeBackground: "e-changebg",
  aiRemoveBackground: "e-bgremove",
  aiRemoveBackgroundExternal: "e-removedotbg",
  contrastStretch: "e-contrast",
  shadow: "e-shadow",
  sharpen: "e-sharpen",
  unsharpMask: "e-usm",
  gradient: "e-gradient",

  // Other flags & finishing
  progressive: "pr",
  lossless: "lo",
  colorProfile: "cp",
  metadata: "md",
  opacity: "o",
  trim: "t",
  zoom: "z",
  page: "pg",

  // Raw pass-through
  raw: "raw",
};



export default supportedTransforms