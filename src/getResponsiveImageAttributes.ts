import type { SrcOptions } from './interfaces'
import { buildSrc } from './url'

/* Default break‑point pools */
const DEFAULT_DEVICE_BREAKPOINTS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840] as const
const DEFAULT_IMAGE_BREAKPOINTS = [16, 32, 48, 64, 96, 128, 256, 320, 420] as const

export interface GetImageAttributesOptions extends SrcOptions {
  width?: number               // explicit rendered width
  sizes?: string               // the HTML sizes value
  deviceBreakpoints?: number[] // override default device break‑points
  imageBreakpoints?: number[]  // override tiny image break‑points
}

export interface ResponsiveImageAttributes {
  src: string
  srcSet?: string
  sizes?: string
  width?: number
}

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

  return {
    src: buildURL(candidates[candidates.length - 1]), // largest candidate
    srcSet,
    sizes: sizes ?? (descriptorKind === 'w' ? '100vw' : undefined),
    width,
  }
}

function computeCandidateWidths(params: {
  allBreakpoints: number[]
  deviceBreakpoints: number[]
  explicitWidth?: number
  sizesAttr?: string
}): { candidates: number[]; descriptorKind: 'w' | 'x' } {
  const { allBreakpoints, deviceBreakpoints, explicitWidth, sizesAttr } = params

  /* --- sizes attribute present ----------------------------------- */
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
    /* no vw → give the full break‑point list */
    return { candidates: allBreakpoints, descriptorKind: 'w' }
  }

  /* --- no sizes attr ------------------------------------------------ */
  if (typeof explicitWidth !== 'number') {
    return { candidates: deviceBreakpoints, descriptorKind: 'w' }
  }

  /* DPR strategy: 1× & 2× nearest break‑points */
  const nearest = (t: number) =>
    allBreakpoints.find((n) => n >= t) || allBreakpoints[allBreakpoints.length - 1]

  const unique = Array.from(
    new Set([nearest(explicitWidth), nearest(explicitWidth * 2)]),
  )

  return { candidates: unique, descriptorKind: 'x' }
}
