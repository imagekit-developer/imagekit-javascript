import { test, expect } from "./fixtures";

async function buildSrc(page: import("@playwright/test").Page, opts: any): Promise<string> {
  return page.evaluate((o) => (window as any).buildSrc(o), opts);
}

test.describe("URL generation", () => {
    test('should return an empty string when src is not provided', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query"
        });

        expect(url).toBe("");
    });

    test('should return an empty string when src is /', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/"
        });

        expect(url).toBe("https://ik.imagekit.io/test_url_endpoint/");
    });

    test('should return an empty string when src is invalid', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "https://"
        });

        expect(url).toBe("");
    });

    test('should generate a valid URL when src is provided without transformation', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path.jpg"
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg`);
    });

    test('should generate a valid URL when a src is provided without transformation', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg"
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg`);
    });

    test('should generate a valid URL when undefined transformation parameters are provided with path', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            src: "/test_path_alt.jpg",
            transformation: undefined,
            transformationPosition: "query"
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg`);
    });

    test("By default transformationPosition should be query", async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            src: "/test_path.jpg",
            transformation: [
                {
                    height: "300",
                    width: "400"
                },
                {
                    rotation: 90
                }
            ]
        });
        expect(url).toBe("https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=h-300,w-400:rt-90");
    });

    test('should generate the URL without sdk version', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            src: "/test_path.jpg",
            transformation: [
                {
                    height: "300",
                    width: "400"
                }
            ],
            transformationPosition: "path"
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400/test_path.jpg`);
    });

    test('should generate the correct URL with a valid src and transformation', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path.jpg",
            transformation: [
                {
                    height: "300",
                    width: "400"
                }
            ]
        });

        // Now transformed URL goes into query since transformationPosition is "query".
        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=h-300,w-400`);
    });

    test('should generate the correct URL when the provided path contains multiple leading slashes', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "///test_path.jpg",
            transformation: [
                {
                    height: "300",
                    width: "400"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=h-300,w-400`);
    });

    test('should generate the correct URL when the urlEndpoint is overridden', async ({ page }) => {
        const url = await buildSrc(page, {
            // We do not override urlEndpoint here
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint_alt",
            transformationPosition: "query",
            src: "/test_path.jpg",
            transformation: [
                {
                    height: "300",
                    width: "400"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint_alt/test_path.jpg?tr=h-300,w-400`);
    });

    test('should generate the correct URL with transformationPosition as query parameter when src is provided', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            src: "/test_path.jpg",
            transformationPosition: "query",
            transformation: [
                {
                    height: "300",
                    width: "400"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=h-300,w-400`);
    });

    test('should generate the correct URL with a valid src parameter and transformation', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg",
            transformation: [
                {
                    height: "300",
                    width: "400"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg?tr=h-300,w-400`);
    });

    test('should generate the correct URL with transformationPosition as query parameter when absolute src is provided', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            src: "https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg",
            transformationPosition: "query",
            transformation: [
                {
                    height: "300",
                    width: "400"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg?tr=h-300,w-400`);
    });

    test('should merge query parameters correctly in the generated URL', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg?t1=v1",
            queryParameters: { t2: "v2", t3: "v3" },
            transformation: [
                {
                    height: "300",
                    width: "400"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg?t1=v1&t2=v2&t3=v3&tr=h-300,w-400`);
    });

    test('should generate the correct URL with chained transformations', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path.jpg",
            transformation: [
                {
                    height: "300",
                    width: "400"
                },
                {
                    rt: "90"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=h-300,w-400:rt-90`);
    });

    test('should generate the correct URL with chained transformations including a new undocumented transformation parameter', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path.jpg",
            transformation: [
                {
                    height: "300",
                    width: "400"
                },
                {
                    rndm_trnsf: "abcd"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=h-300,w-400:rndm_trnsf-abcd`);
    });

    test('should generate the correct URL when overlay image transformation is provided', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path.jpg",
            transformation: [
                {
                    height: "300",
                    width: "400",
                    raw: "l-image,i-overlay.jpg,w-100,b-10_CDDC39,l-end"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=h-300,w-400,l-image,i-overlay.jpg,w-100,b-10_CDDC39,l-end`);
    });

    test('should generate the correct URL when overlay image transformation contains a slash in the overlay path', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path.jpg",
            transformation: [
                {
                    height: "300",
                    width: "400",
                    raw: "l-image,i-/path/to/overlay.jpg,w-100,b-10_CDDC39,l-end"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=h-300,w-400,l-image,i-/path/to/overlay.jpg,w-100,b-10_CDDC39,l-end`);
    });

    test('should generate the correct URL when border transformation is applied', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path.jpg",
            transformation: [
                {
                    height: "300",
                    width: "400",
                    border: "20_FF0000"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=h-300,w-400,b-20_FF0000`);
    });

    test('should generate the correct URL when transformation has empty key and value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path.jpg",
            transformation: [
                {
                    "": ""
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg`);
    });

    test('should generate the correct URL when an undefined transform is provided', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path.jpg",
            transformation: [
                {
                    "undefined-transform": "true"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=undefined-transform-true`);
    });

    test('should generate the correct URL when transformation key has an empty value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path.jpg",
            transformation: [
                {
                    defaultImage: ""
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=di-`);
    });

    test('should generate the correct URL when transformation key has \'-\' as its value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path.jpg",
            transformation: [
                {
                    contrastStretch: "-"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=e-contrast`);
    });

    test('should skip transformation parameters that are undefined or null', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    defaultImage: "/test_path.jpg",
                    quality: undefined,
                    contrastStretch: null
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=di-test_path.jpg`);
    });

    test('should skip transformation parameters that are false', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    defaultImage: "/test_path.jpg",
                    contrastStretch: false
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=di-test_path.jpg`);
    });

    test('should include only the key when transformation value is an empty string', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    defaultImage: "/test_path.jpg",
                    shadow: ""
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=di-test_path.jpg,e-shadow`);
    });

    test('should include both key and value when transformation parameter value is provided', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    defaultImage: "/test_path.jpg",
                    shadow: "bl-15_st-40_x-10_y-N5"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=di-test_path.jpg,e-shadow-bl-15_st-40_x-10_y-N5`);
    });

    test('should generate the correct URL when trim transformation is set to true as a boolean', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    defaultImage: "/test_path.jpg",
                    trim: true
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=di-test_path.jpg,t-true`);
    });

    test('should generate the correct URL when trim transformation is set to true as a string', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    defaultImage: "/test_path.jpg",
                    trim: "true"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=di-test_path.jpg,t-true`);
    });

    test('should generate the correct URL for AI background removal when set to true', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    aiRemoveBackground: true
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-bgremove`);
    });

    test('should generate the correct URL for AI background removal when \'true\' is provided as a string', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    aiRemoveBackground: "true"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-bgremove`);
    });

    test('should not apply AI background removal when value is not true', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    aiRemoveBackground: "false"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg`);
    });

    test('should generate the correct URL for external AI background removal when set to true', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    aiRemoveBackgroundExternal: true
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-removedotbg`);
    });

    test('should generate the correct URL for external AI background removal when \'true\' is provided as a string', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    aiRemoveBackgroundExternal: "true"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-removedotbg`);
    });

    test('should not apply external AI background removal when value is not true', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    aiRemoveBackgroundExternal: "false"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg`);
    });

    test('should generate the correct URL when gradient transformation is provided as a string', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    gradient: "ld-top_from-green_to-00FF0010_sp-1"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-gradient-ld-top_from-green_to-00FF0010_sp-1`);
    });

    test('should generate the correct URL when gradient transformation is provided as an empty string', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    gradient: ""
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-gradient`);
    });

    test('should generate the correct URL when gradient transformation is set to true', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    gradient: true
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-gradient`);
    });

    test('should generate the correct URL when AI drop shadow transformation is set to true', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    aiDropShadow: true
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-dropshadow`);
    });

    test('should generate the correct URL when AI drop shadow transformation is provided as an empty string', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    aiDropShadow: ""
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-dropshadow`);
    });

    test('should generate the correct URL when AI drop shadow transformation is provided with a specific string value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    aiDropShadow: "az-45"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-dropshadow-az-45`);
    });

    test('should generate the correct URL when shadow transformation is set to true', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    shadow: true
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-shadow`);
    });

    test('should generate the correct URL when shadow transformation is provided as an empty string', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    shadow: ""
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-shadow`);
    });

    test('should generate the correct URL when shadow transformation is provided with a specific string value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    shadow: "bl-15_st-40_x-10_y-N5"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-shadow-bl-15_st-40_x-10_y-N5`);
    });

    test('should generate the correct URL when sharpen transformation is set to true', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    sharpen: true
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-sharpen`);
    });

    test('should generate the correct URL when sharpen transformation is provided as an empty string', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    sharpen: ""
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-sharpen`);
    });

    test('should generate the correct URL when sharpen transformation is provided with a number value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    sharpen: 10
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-sharpen-10`);
    });

    test('should generate the correct URL when unsharpMask transformation is set to true', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    unsharpMask: true
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-usm`);
    });

    test('should generate the correct URL when unsharpMask transformation is provided as an empty string', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    unsharpMask: ""
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-usm`);
    });

    test('should generate the correct URL when unsharpMask transformation is provided with a string value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    unsharpMask: "2-2-0.8-0.024"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=e-usm-2-2-0.8-0.024`);
    });

    test('should generate the correct URL for trim transformation when set to true (boolean)', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    trim: true
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=t-true`);
    });

    test('should generate the correct URL for trim transformation when provided as an empty string', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    trim: ""
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=t-true`);
    });

    test('should generate the correct URL for trim transformation when provided with a number value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    trim: 5
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=t-5`);
    });

    // Width parameter tests
    test('should generate the correct URL for width transformation when provided with a number value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    width: 400
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=w-400`);
    });

    test('should generate the correct URL for width transformation when provided with a string value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    width: "400"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=w-400`);
    });

    test('should generate the correct URL for width transformation when provided with an arithmetic expression', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    width: "iw_div_2"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=w-iw_div_2`);
    });

    // Height parameter tests
    test('should generate the correct URL for height transformation when provided with a number value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    height: 300
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=h-300`);
    });

    test('should generate the correct URL for height transformation when provided with a string value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    height: "300"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=h-300`);
    });

    test('should generate the correct URL for height transformation when provided with an arithmetic expression', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    height: "ih_mul_0.5"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=h-ih_mul_0.5`);
    });

    // AspectRatio parameter tests
    test('should generate the correct URL for aspectRatio transformation when provided with a string value in colon format', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    aspectRatio: "4:3"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=ar-4:3`);
    });

    test('should generate the correct URL for aspectRatio transformation when provided with an alternate underscore format', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    aspectRatio: "4_3"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=ar-4_3`);
    });

    test('should generate the correct URL for aspectRatio transformation when provided with an arithmetic expression', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    aspectRatio: "iar_div_2"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=ar-iar_div_2`);
    });

    // Background parameter tests
    test('should generate the correct URL for background transformation when provided with a solid color', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    background: "FF0000"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=bg-FF0000`);
    });

    test('should generate the correct URL for background transformation when provided with the blurred option', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    background: "blurred"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=bg-blurred`);
    });

    test('should generate the correct URL for background transformation when provided with the genfill option', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    background: "genfill"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=bg-genfill`);
    });

    // Crop parameter tests
    test('should generate the correct URL for crop transformation when provided with force value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    crop: "force"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=c-force`);
    });

    test('should generate the correct URL for crop transformation when provided with at_max value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    crop: "at_max"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=c-at_max`);
    });

    // CropMode parameter tests
    test('should generate the correct URL for cropMode transformation when provided with pad_resize', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    cropMode: "pad_resize"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=cm-pad_resize`);
    });

    test('should generate the correct URL for cropMode transformation when provided with extract value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    cropMode: "extract"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=cm-extract`);
    });

    // Focus parameter tests
    test('should generate the correct URL for focus transformation when provided with a string value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    focus: "center"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=fo-center`);
    });

    test('should generate the correct URL for focus transformation when face detection is specified', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    focus: "face"
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=fo-face`);
    });

    // Quality parameter test
    test('should generate the correct URL for quality transformation when provided with a number value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    quality: 80
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=q-80`);
    });

    // Coordinate parameters tests
    test('should generate the correct URL for x coordinate transformation when provided with a number value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    x: 10
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=x-10`);
    });

    test('should generate the correct URL for y coordinate transformation when provided with a number value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    y: 20
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=y-20`);
    });

    test('should generate the correct URL for xCenter transformation when provided with a number value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    xCenter: 30
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=xc-30`);
    });

    test('should generate the correct URL for yCenter transformation when provided with a number value', async ({ page }) => {
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path1.jpg",
            transformation: [
                {
                    yCenter: 40
                }
            ]
        });

        expect(url).toBe(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg?tr=yc-40`);
    });

    test('Including deprecated properties', async ({ page }) => {
        // This is just testing how the SDK constructs the URL, not actual valid transformations.
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path.jpg",
            transformation: [
                {
                    height: 300,
                    width: 400,
                    aspectRatio: '4-3',
                    quality: 40,
                    crop: 'force',
                    cropMode: 'extract',
                    focus: 'left',
                    format: 'jpeg',
                    radius: 50,
                    bg: "A94D34",
                    border: "5-A94D34",
                    rotation: 90,
                    blur: 10,
                    named: "some_name",
                    progressive: true,
                    lossless: true,
                    trim: 5,
                    metadata: true,
                    colorProfile: true,
                    defaultImage: "/folder/file.jpg/",
                    dpr: 3,
                    sharpen: 10,
                    unsharpMask: "2-2-0.8-0.024",
                    contrastStretch: true,
                    grayscale: true,
                    shadow: "bl-15_st-40_x-10_y-N5",
                    gradient: "from-red_to-white",
                    original: true,
                    raw: "h-200,w-300,l-image,i-logo.png,l-end"
                }
            ]
        });

        expect(url).toBe(
            `https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=h-300,w-400,ar-4-3,q-40,c-force,cm-extract,fo-left,f-jpeg,r-50,bg-A94D34,b-5-A94D34,rt-90,bl-10,n-some_name,pr-true,lo-true,t-5,md-true,cp-true,di-folder@@file.jpg,dpr-3,e-sharpen-10,e-usm-2-2-0.8-0.024,e-contrast,e-grayscale,e-shadow-bl-15_st-40_x-10_y-N5,e-gradient-from-red_to-white,orig-true,h-200,w-300,l-image,i-logo.png,l-end`
        );
    });

    test('should generate the correct URL with many transformations, including video and AI transforms', async ({ page }) => {
        // Example test with comprehensive transformations
        const url = await buildSrc(page, {
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint",
            transformationPosition: "query",
            src: "/test_path.jpg",
            transformation: [
                {
                    height: 300,
                    width: 400,
                    aspectRatio: '4-3',
                    quality: 40,
                    crop: 'force',
                    cropMode: 'extract',
                    focus: 'left',
                    format: 'jpeg',
                    radius: 50,
                    bg: "A94D34",
                    border: "5-A94D34",
                    rotation: 90,
                    blur: 10,
                    named: "some_name",
                    progressive: true,
                    lossless: true,
                    trim: 5,
                    metadata: true,
                    colorProfile: true,
                    defaultImage: "/folder/file.jpg/",
                    dpr: 3,
                    x: 10,
                    y: 20,
                    xCenter: 30,
                    yCenter: 40,
                    flip: "h",
                    opacity: 0.8,
                    zoom: 2,
                    // Video transformations
                    videoCodec: "h264",
                    audioCodec: "aac",
                    startOffset: 5,
                    endOffset: 15,
                    duration: 10,
                    streamingResolutions: ["1440", "1080"],
                    // AI transformations
                    grayscale: true,
                    aiUpscale: true,
                    aiRetouch: true,
                    aiVariation: true,
                    aiDropShadow: true,
                    aiChangeBackground: "prompt-car",
                    aiEdit: 'prompt-make it vintage',
                    aiRemoveBackground: true,
                    contrastStretch: true,
                    shadow: "bl-15_st-40_x-10_y-N5",
                    sharpen: 10,
                    unsharpMask: "2-2-0.8-0.024",
                    gradient: "from-red_to-white",
                    original: true,
                    page: "2_4",
                    raw: "h-200,w-300,l-image,i-logo.png,l-end",
                    // New transformation parameters
                    colorReplace: 'FF0000_50_00FF00',
                    distort: 'p-50_50_150_50_150_150_50_150',
                }
            ]
        });

        expect(url).toBe(
            `https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=h-300,w-400,ar-4-3,q-40,c-force,cm-extract,fo-left,f-jpeg,r-50,bg-A94D34,b-5-A94D34,rt-90,bl-10,n-some_name,pr-true,lo-true,t-5,md-true,cp-true,di-folder@@file.jpg,dpr-3,x-10,y-20,xc-30,yc-40,fl-h,o-0.8,z-2,vc-h264,ac-aac,so-5,eo-15,du-10,sr-1440_1080,e-grayscale,e-upscale,e-retouch,e-genvar,e-dropshadow,e-changebg-prompt-car,e-edit-prompt-make it vintage,e-bgremove,e-contrast,e-shadow-bl-15_st-40_x-10_y-N5,e-sharpen-10,e-usm-2-2-0.8-0.024,e-gradient-from-red_to-white,orig-true,pg-2_4,h-200,w-300,l-image,i-logo.png,l-end,cr-FF0000_50_00FF00,e-distort-p-50_50_150_50_150_150_50_150`
        );
    });
});
