import { buildSrc } from './url'
import type { SrcOptions } from './interfaces'

const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840] as const
const IMAGE_SIZES = [16, 32, 48, 64, 96, 128, 256, 320, 420] as const

export interface ResponsiveOptions extends SrcOptions {
    width?: number
    sizes?: string
    deviceSizes?: number[]
    imageSizes?: number[]
}

export interface ImageProps {
    src: string
    srcSet?: string
    sizes?: string
    width?: number
    height?: number
}

export function getImageProps(opts: ResponsiveOptions): ImageProps {
    const {
        src,
        urlEndpoint,
        transformation = [],
        queryParameters,
        transformationPosition,
        sizes,
        width,
        deviceSizes = DEVICE_SIZES as unknown as number[],
        imageSizes = IMAGE_SIZES as unknown as number[],
    } = opts

    const allBreakpoints = [...imageSizes, ...deviceSizes].sort((a, b) => a - b)

    const { widths, kind } = pickWidths({
        all: allBreakpoints,
        device: deviceSizes,
        explicit: width,
        sizesAttr: sizes,
    })

    const build = (w: number) =>
        buildSrc({
            src,
            urlEndpoint,
            queryParameters,
            transformationPosition,
            transformation: [
                ...transformation,
                { width: w, crop: "at_max" } // Should never upscale beyond the original width
            ],
        })

    const srcSet =
        widths
            .map((w, i) => `${build(w)} ${kind === 'w' ? w : i + 1}${kind}`)
            .join(', ') || undefined

    return {
        sizes: sizes ?? (kind === 'w' ? '100vw' : undefined),
        srcSet,
        src: build(widths[widths.length - 1]),
        width,
    }
}

function pickWidths({
    all,
    device,
    explicit,
    sizesAttr,
}: {
    all: number[]
    device: number[]
    explicit?: number
    sizesAttr?: string
}): { widths: number[]; kind: 'w' | 'x' } {
    if (sizesAttr) {
        const vwMatches = sizesAttr.match(/(^|\s)(1?\d{1,2})vw/g) || []
        const percents = vwMatches.map((m) => parseInt(m, 10))

        if (percents.length) {
            const smallest = Math.min(...percents) / 100
            const cutOff = device[0] * smallest
            return { widths: all.filter((w) => w >= cutOff), kind: 'w' }
        }

        return { widths: all, kind: 'w' } // ← return allSizes when no vw tokens
    }

    // If sizes is not defined, we need to check if the explicit width is defined. If no width is defined, we can use the deviceSizes as the default.
    if (typeof explicit !== 'number') {
        return { widths: device, kind: 'w' }
    }

    const nearest = (t: number) =>
        all.find((v) => v >= t) || all[all.length - 1]
    const list = Array.from(new Set([nearest(explicit), nearest(explicit * 2)]))
    return { widths: list, kind: 'x' }
}
