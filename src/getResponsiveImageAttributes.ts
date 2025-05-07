import type { SrcOptions } from './interfaces'
import { buildSrc } from './url'

/* Default break‑point pools */
const DEFAULT_DEVICE_BREAKPOINTS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840] as const
const DEFAULT_IMAGE_BREAKPOINTS = [16, 32, 48, 64, 96, 128, 256, 384] as const

export interface GetImageAttributesOptions extends SrcOptions {
  /**
    * The intended display width of the image in pixels, 
    * used **only when the `sizes` attribute is not provided**.
    *
    * Triggers a DPR-based strategy (1x and 2x variants) and generates `x` descriptors in `srcSet`.
    * 
    * Ignored if `sizes` is present.
    */
  width?: number

  /**
   * The value for the HTML `sizes` attribute 
   * (e.g., `"100vw"` or `"(min-width:768px) 50vw, 100vw"`).
   *
   * - If it includes one or more `vw` units, breakpoints smaller than the corresponding percentage of the smallest device width are excluded.
   * - If it contains no `vw` units, the full breakpoint list is used.
   *
   * Enables a width-based strategy and generates `w` descriptors in `srcSet`.
   */
  sizes?: string

  /**
   * Custom list of **device-width breakpoints** in pixels.
   * These define common screen widths for responsive image generation.
   *
   * Defaults to `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]`.
   * Sorted automatically.
   */
  deviceBreakpoints?: number[]

  /**
   * Custom list of **image-specific breakpoints** in pixels.
   * Useful for generating small variants (e.g., placeholders or thumbnails).
   *
   * Merged with `deviceBreakpoints` before calculating `srcSet`.
   * Defaults to `[16, 32, 48, 64, 96, 128, 256, 384]`.
   * Sorted automatically.
   */
  imageBreakpoints?: number[]
}

/**
 * Resulting set of attributes suitable for an HTML `<img>` element.
 * Useful for enabling responsive image loading.
 */
export interface ResponsiveImageAttributes {
  /** URL for the *largest* candidate (assigned to plain `src`). */
  src: string
  /** Candidate set with `w` or `x` descriptors. */
  srcSet?: string
  /** `sizes` returned (or synthesised as `100vw`). */
  sizes?: string
  /** Width as a number (if `width` was provided). */
  width?: number
}

/**
 * Generates a responsive image URL, `srcSet`, and `sizes` attributes
 * based on the input options such as `width`, `sizes`, and breakpoints.
 */
export function getResponsiveImageAttributes(
  opts: GetImageAttributesOptions
): ResponsiveImageAttributes {
  const {
    src,
    urlEndpoint,
    transformation = [],
    queryParameters,
    transformationPosition,
    sizes,
    width,
    deviceBreakpoints = DEFAULT_DEVICE_BREAKPOINTS as unknown as number[],
    imageBreakpoints = DEFAULT_IMAGE_BREAKPOINTS as unknown as number[],
  } = opts

  const sortedDeviceBreakpoints = [...deviceBreakpoints].sort((a, b) => a - b);
  const sortedImageBreakpoints = [...imageBreakpoints].sort((a, b) => a - b);
  const allBreakpoints = [...sortedImageBreakpoints, ...sortedDeviceBreakpoints].sort((a, b) => a - b);

  const { candidates, descriptorKind } = computeCandidateWidths({
    allBreakpoints,
    deviceBreakpoints: sortedDeviceBreakpoints,
    explicitWidth: width,
    sizesAttr: sizes,
  })

  /* helper to build a single ImageKit URL */
  const buildURL = (w: number) =>
    buildSrc({
      src,
      urlEndpoint,
      queryParameters,
      transformationPosition,
      transformation: [
        ...transformation,
        { width: w, crop: 'at_max' }, // never upscale beyond original
      ],
    })

  /* build srcSet */
  const srcSet =
    candidates
      .map((w, i) => `${buildURL(w)} ${descriptorKind === 'w' ? w : i + 1}${descriptorKind}`)
      .join(', ') || undefined

  const finalSizes = sizes ?? (descriptorKind === 'w' ? '100vw' : undefined)

  return {
    src: buildURL(candidates[candidates.length - 1]), // largest candidate
    srcSet,
    ...(finalSizes ? { sizes: finalSizes } : {}), // include only when defined
    ...(width !== undefined ? { width } : {}),  // include only when defined
  }
}

function computeCandidateWidths(params: {
  allBreakpoints: number[]
  deviceBreakpoints: number[]
  explicitWidth?: number
  sizesAttr?: string
}): { candidates: number[]; descriptorKind: 'w' | 'x' } {
  const { allBreakpoints, deviceBreakpoints, explicitWidth, sizesAttr } = params

  // Strategy 1: Width-based srcSet (`w`) using viewport `vw` hints
  if (sizesAttr) {
    const vwTokens = sizesAttr.match(/(^|\s)(1?\d{1,2})vw/g) || []
    const vwPercents = vwTokens.map((t) => parseInt(t, 10))

    if (vwPercents.length) {
      const smallestRatio = Math.min(...vwPercents) / 100
      const minRequiredPx = deviceBreakpoints[0] * smallestRatio
      return {
        candidates: allBreakpoints.filter((w) => w >= minRequiredPx),
        descriptorKind: 'w',
      }
    }

    // No usable `vw` found: fallback to all breakpoints
    return { candidates: allBreakpoints, descriptorKind: 'w' }
  }

  // Strategy 2: Fallback using explicit image width using device breakpoints
  if (typeof explicitWidth !== 'number') {
    return { candidates: deviceBreakpoints, descriptorKind: 'w' }
  }

  // Strategy 3: Use 1x and 2x nearest breakpoints for `x` descriptor
  const nearest = (t: number) =>
    allBreakpoints.find((n) => n >= t) || allBreakpoints[allBreakpoints.length - 1]

  const unique = Array.from(
    new Set([nearest(explicitWidth), nearest(explicitWidth * 2)]),
  )

  return { candidates: unique, descriptorKind: 'x' }
}
