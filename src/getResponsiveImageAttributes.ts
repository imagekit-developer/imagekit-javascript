import type { SrcOptions } from './interfaces'
import { buildSrc } from './url'

/* Default break‑point pools */
const DEFAULT_DEVICE_BREAKPOINTS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840] as const
const DEFAULT_IMAGE_BREAKPOINTS = [16, 32, 48, 64, 96, 128, 256, 384] as const

export interface GetImageAttributesOptions extends SrcOptions {
  /**
   * The intended display width (in pixels) of the image on screen.
   * Used for calculating `srcSet` with a pixel-density (DPR) strategy.
   * If omitted, a width-based strategy using breakpoints will be applied.
   */
  width?: number

  /**
   * The `sizes` attribute for the image element. 
   * Typically used to indicate how the image will scale across different viewport sizes (e.g., "100vw").
   * Presence of `sizes` triggers a width-based `srcSet` strategy.
   */
  sizes?: string

  /**
   * An optional custom list of device width breakpoints (in pixels).
   * If not specified, defaults to `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]`.
   * Recommended to align with your target audience's common screen widths.
   */
  deviceBreakpoints?: number[]

  /**
   * An optional list of custom image breakpoints (in pixels).
   * These are merged with the device breakpoints to compute the final list of candidate widths.
   * Defaults to `[16, 32, 48, 64, 96, 128, 256, 384]`.
   */
  imageBreakpoints?: number[]
}

/**
 * Resulting set of attributes suitable for an HTML `<img>` element.
 * Useful for enabling responsive image loading.
 */
export interface ResponsiveImageAttributes {
  src: string
  srcSet?: string
  sizes?: string
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

  const allBreakpoints = [...imageBreakpoints, ...deviceBreakpoints].sort((a, b) => a - b)

  const { candidates, descriptorKind } = computeCandidateWidths({
    allBreakpoints,
    deviceBreakpoints,
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
