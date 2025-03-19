const chai = require("chai");
const pkg = require("../package.json");
global.FormData = require('formdata-node');
const expect = chai.expect;
const initializationParams = require("./data").initializationParams
import ImageKit from "../src/index";

describe("URL generation", function () {

    var imagekit = new ImageKit(initializationParams);

    it('should return an empty string when neither path nor src is provided', function () {
        const url = imagekit.url({});

        expect(url).equal("");
    });

    it('should return an empty string for an invalid src URL', function () {
        const url = imagekit.url({ src: "/" });

        expect(url).equal("");
    });

    it('should generate a valid URL when a path is provided without transformation', function () {
        const url = imagekit.url({
            path: "/test_path.jpg"
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg`);
    });

    it('should generate a valid URL when a src is provided without transformation', function () {
        const url = imagekit.url({
            src: "https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg"
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg`);
    });

    it('should generate a valid URL when undefined transformation parameters are provided with path', function () {
        const url = imagekit.url({
            path: "/test_path_alt.jpg",
            transformation: undefined,
            transformationPosition: undefined,
            src: undefined,
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg`);
    });

    it('should generate the URL without sdk version', function () {
        const ik = new ImageKit({ ...initializationParams, sdkVersion: "" })

        const url = ik.url({
            path: "/test_path.jpg",
            transformation: [{
                "height": "300",
                "width": "400"
            }]
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400/test_path.jpg`);
    });

    it('should generate the correct URL with a valid path and transformation', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                "height": "300",
                "width": "400"
            }]
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400/test_path.jpg`);
    });

    it('should generate the correct URL when the provided path contains multiple leading slashes', function () {
        const url = imagekit.url({
            path: "///test_path.jpg",
            transformation: [{
                "height": "300",
                "width": "400"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400/test_path.jpg`);

    });

    it('should generate the correct URL when the urlEndpoint is overridden', function () {
        const url = imagekit.url({
            urlEndpoint: "https://ik.imagekit.io/test_url_endpoint_alt",
            path: "/test_path.jpg",
            transformation: [{
                "height": "300",
                "width": "400"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint_alt/tr:h-300,w-400/test_path.jpg`);

    });

    it('should generate the correct URL with transformationPosition as query parameter when path is provided', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformationPosition: "query",
            transformation: [{
                "height": "300",
                "width": "400"
            }]
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=h-300%2Cw-400`);
    });

    it('should generate the correct URL with a valid src parameter and transformation', function () {
        const url = imagekit.url({
            src: "https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg",
            transformation: [{
                "height": "300",
                "width": "400"
            }]
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg?tr=h-300%2Cw-400`);
    });

    it('should generate the correct URL with transformationPosition as query parameter when src is provided', function () {
        const url = imagekit.url({
            src: "https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg",
            transformationPosition: "query",
            transformation: [{
                "height": "300",
                "width": "400"
            }]
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg?tr=h-300%2Cw-400`);
    });

    it('should merge query parameters correctly in the generated URL', function () {
        const url = imagekit.url({
            src: "https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg?t1=v1",
            queryParameters: { t2: "v2", t3: "v3" },
            transformation: [{
                "height": "300",
                "width": "400"
            }]
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg?t1=v1&t2=v2&t3=v3&tr=h-300%2Cw-400`);
    });


    it('should generate the correct URL with chained transformations', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                "height": "300",
                "width": "400"
            }, {
                "rt": "90"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400:rt-90/test_path.jpg`);
    });


    it('should generate the correct URL with chained transformations including a new undocumented transformation parameter', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                "height": "300",
                "width": "400"
            }, {
                "rndm_trnsf": "abcd"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400:rndm_trnsf-abcd/test_path.jpg`);
    });

    it('should generate the correct URL when overlay image transformation is provided', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                "height": "300",
                "width": "400",
                "raw": "l-image,i-overlay.jpg,w-100,b-10_CDDC39,l-end"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400,l-image,i-overlay.jpg,w-100,b-10_CDDC39,l-end/test_path.jpg`);
    });

    it('should generate the correct URL when overlay image transformation contains a slash in the overlay path', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                "height": "300",
                "width": "400",
                "raw": "l-image,i-/path/to/overlay.jpg,w-100,b-10_CDDC39,l-end"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400,l-image,i-/path/to/overlay.jpg,w-100,b-10_CDDC39,l-end/test_path.jpg`);
    });

    it('should generate the correct URL when border transformation is applied', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                "height": "300",
                "width": "400",
                border: "20_FF0000"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400,b-20_FF0000/test_path.jpg`);
    });

    it('should generate the correct URL when transformation has empty key and value', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                "": ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg`);
    });

    /**
     * Provided to provide support to a new transform without sdk update
     */
    it('should generate the correct URL when an undefined transform is provided', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                "undefined-transform": "true"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:undefined-transform-true/test_path.jpg`);
    });

    it('should generate the correct URL when transformation key has an empty value', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                defaultImage: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:di-/test_path.jpg`);
    });

    it('should generate the correct URL when transformation key has \'-\' as its value', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                effectContrast: "-"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-contrast/test_path.jpg`);
    });

    it('should skip transformation parameters that are undefined or null', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                defaultImage: "/test_path.jpg",
                quality: undefined,
                effectContrast: null
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:di-test_path.jpg/test_path1.jpg`);
    });

    it('should skip transformation parameters that are false', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                defaultImage: "/test_path.jpg",
                effectContrast: false
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:di-test_path.jpg/test_path1.jpg`);
    });

    it('should include only the key when transformation value is an empty string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                defaultImage: "/test_path.jpg",
                shadow: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:di-test_path.jpg,e-shadow/test_path1.jpg`);
    });

    it('should include both key and value when transformation parameter value is provided', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                defaultImage: "/test_path.jpg",
                shadow: "bl-15_st-40_x-10_y-N5"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:di-test_path.jpg,e-shadow-bl-15_st-40_x-10_y-N5/test_path1.jpg`);
    });

    it('should generate the correct URL when trim transformation is set to true as a boolean', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                defaultImage: "/test_path.jpg",
                trim: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:di-test_path.jpg,t-true/test_path1.jpg`);
    });

    it('should generate the correct URL when trim transformation is set to true as a string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                defaultImage: "/test_path.jpg",
                trim: "true"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:di-test_path.jpg,t-true/test_path1.jpg`);
    });

    it('should generate the correct URL for AI background removal when set to true', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiRemoveBackground: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-bgremove/test_path1.jpg`);
    });

    it('should generate the correct URL for AI background removal when \'true\' is provided as a string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiRemoveBackground: "true"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-bgremove/test_path1.jpg`);
    });

    it('should not apply AI background removal when value is not true', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiRemoveBackground: "false"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg`);
    });

    it('should generate the correct URL for external AI background removal when set to true', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiRemoveBackgroundExternal: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-removedotbg/test_path1.jpg`);
    });

    it('should generate the correct URL for external AI background removal when \'true\' is provided as a string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiRemoveBackgroundExternal: "true"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-removedotbg/test_path1.jpg`);
    });

    it('should not apply external AI background removal when value is not true', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiRemoveBackgroundExternal: "false"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg`);
    });

    it('should generate the correct URL when gradient transformation is provided as a string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                gradient: "ld-top_from-green_to-00FF0010_sp-1"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-gradient-ld-top_from-green_to-00FF0010_sp-1/test_path1.jpg`);
    });

    it('should generate the correct URL when gradient transformation is provided as an empty string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                gradient: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-gradient/test_path1.jpg`);
    });

    it('should generate the correct URL when gradient transformation is set to true', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                gradient: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-gradient/test_path1.jpg`);
    });

    it('should generate the correct URL when AI drop shadow transformation is set to true', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiDropShadow: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-dropshadow/test_path1.jpg`);
    });

    it('should generate the correct URL when AI drop shadow transformation is provided as an empty string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiDropShadow: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-dropshadow/test_path1.jpg`);
    });

    it('should generate the correct URL when AI drop shadow transformation is provided with a specific string value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiDropShadow: "az-45"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-dropshadow-az-45/test_path1.jpg`);
    });

    it('should generate the correct URL when shadow transformation is set to true', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                shadow: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-shadow/test_path1.jpg`);
    });

    it('should generate the correct URL when shadow transformation is provided as an empty string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                shadow: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-shadow/test_path1.jpg`);
    });

    it('should generate the correct URL when shadow transformation is provided with a specific string value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                shadow: "bl-15_st-40_x-10_y-N5"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-shadow-bl-15_st-40_x-10_y-N5/test_path1.jpg`);
    });

    it('should generate the correct URL when sharpen transformation is set to true', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                sharpen: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-sharpen/test_path1.jpg`);
    });

    it('should generate the correct URL when sharpen transformation is provided as an empty string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                sharpen: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-sharpen/test_path1.jpg`);
    });

    it('should generate the correct URL when sharpen transformation is provided with a number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                sharpen: 10
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-sharpen-10/test_path1.jpg`);
    });

    it('should generate the correct URL when unsharpMask transformation is set to true', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                unsharpMask: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-usm/test_path1.jpg`);
    });

    it('should generate the correct URL when unsharpMask transformation is provided as an empty string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                unsharpMask: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-usm/test_path1.jpg`);
    });

    it('should generate the correct URL when unsharpMask transformation is provided with a string value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                unsharpMask: "2-2-0.8-0.024"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-usm-2-2-0.8-0.024/test_path1.jpg`);
    });

    it('should generate the correct URL for trim transformation when set to true (boolean)', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                trim: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:t-true/test_path1.jpg`);
    });

    it('should generate the correct URL for trim transformation when provided as an empty string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                trim: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:t-true/test_path1.jpg`);
    });

    it('should generate the correct URL for trim transformation when provided with a number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                trim: 5
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:t-5/test_path1.jpg`);
    });

    // Width parameter tests
    it('should generate the correct URL for width transformation when provided with a number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                width: 400
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:w-400/test_path1.jpg`);
    });

    it('should generate the correct URL for width transformation when provided with a string value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                width: "400"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:w-400/test_path1.jpg`);
    });

    it('should generate the correct URL for width transformation when provided with an arithmetic expression', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                width: "iw_div_2"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:w-iw_div_2/test_path1.jpg`);
    });

    // Height parameter tests
    it('should generate the correct URL for height transformation when provided with a number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                height: 300
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300/test_path1.jpg`);
    });

    it('should generate the correct URL for height transformation when provided with a string value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                height: "300"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300/test_path1.jpg`);
    });

    it('should generate the correct URL for height transformation when provided with an arithmetic expression', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                height: "ih_mul_0.5"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-ih_mul_0.5/test_path1.jpg`);
    });

    // AspectRatio parameter tests
    it('should generate the correct URL for aspectRatio transformation when provided with a string value in colon format', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aspectRatio: "4:3"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:ar-4:3/test_path1.jpg`);
    });

    it('should generate the correct URL for aspectRatio transformation when provided with an alternate underscore format', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aspectRatio: "4_3"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:ar-4_3/test_path1.jpg`);
    });

    it('should generate the correct URL for aspectRatio transformation when provided with an arithmetic expression', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aspectRatio: "iar_div_2"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:ar-iar_div_2/test_path1.jpg`);
    });

    // Background parameter tests
    it('should generate the correct URL for background transformation when provided with a solid color', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                background: "FF0000"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:bg-FF0000/test_path1.jpg`);
    });

    it('should generate the correct URL for background transformation when provided with the blurred option', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                background: "blurred"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:bg-blurred/test_path1.jpg`);
    });

    it('should generate the correct URL for background transformation when provided with the genfill option', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                background: "genfill"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:bg-genfill/test_path1.jpg`);
    });

    // Crop parameter tests
    it('should generate the correct URL for crop transformation when provided with force value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                crop: "force"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:c-force/test_path1.jpg`);
    });

    it('should generate the correct URL for crop transformation when provided with at_max value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                crop: "at_max"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:c-at_max/test_path1.jpg`);
    });

    // CropMode parameter tests
    it('should generate the correct URL for cropMode transformation when provided with pad_resize', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                cropMode: "pad_resize"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:cm-pad_resize/test_path1.jpg`);
    });

    it('should generate the correct URL for cropMode transformation when provided with extract value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                cropMode: "extract"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:cm-extract/test_path1.jpg`);
    });

    // Focus parameter tests
    it('should generate the correct URL for focus transformation when provided with a string value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                focus: "center"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:fo-center/test_path1.jpg`);
    });

    it('should generate the correct URL for focus transformation when face detection is specified', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                focus: "face"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:fo-face/test_path1.jpg`);
    });

    // Quality parameter test
    it('should generate the correct URL for quality transformation when provided with a number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                quality: 80
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:q-80/test_path1.jpg`);
    });

    // Coordinate parameters tests
    it('should generate the correct URL for x coordinate transformation when provided with a number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                x: 10
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:x-10/test_path1.jpg`);
    });

    it('should generate the correct URL for y coordinate transformation when provided with a number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                y: 20
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:y-20/test_path1.jpg`);
    });

    it('should generate the correct URL for xCenter transformation when provided with a number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                xCenter: 30
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:xc-30/test_path1.jpg`);
    });

    it('should generate the correct URL for yCenter transformation when provided with a number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                yCenter: 40
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:yc-40/test_path1.jpg`);
    });

    it('Including deprecated properties', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
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
                defaultImage: "/folder/file.jpg/", //trailing and leading slash case 
                dpr: 3,
                effectSharpen: 10,
                effectUSM: "2-2-0.8-0.024",
                effectContrast: true,
                effectGray: true,
                effectShadow: 'bl-15_st-40_x-10_y-N5',
                effectGradient: 'from-red_to-white',
                original: true,
                raw: "h-200,w-300,l-image,i-logo.png,l-end"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400,ar-4-3,q-40,c-force,cm-extract,fo-left,f-jpeg,r-50,bg-A94D34,b-5-A94D34,rt-90,bl-10,n-some_name,pr-true,lo-true,t-5,md-true,cp-true,di-folder@@file.jpg,dpr-3,e-sharpen-10,e-usm-2-2-0.8-0.024,e-contrast,e-grayscale,e-shadow-bl-15_st-40_x-10_y-N5,e-gradient-from-red_to-white,orig-true,h-200,w-300,l-image,i-logo.png,l-end/test_path.jpg`);
    });

    it('should generate the correct URL when comprehensive transformations, including video and AI transformations, are applied', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
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
                defaultImage: "/folder/file.jpg/", //trailing and leading slash case 
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
                aiRemoveBackground: true,
                contrastStretch: true,
                shadow: 'bl-15_st-40_x-10_y-N5',
                sharpen: 10,
                unsharpMask: "2-2-0.8-0.024",
                gradient: 'from-red_to-white',
                original: true,
                page: "2_4",
                raw: "h-200,w-300,l-image,i-logo.png,l-end"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400,ar-4-3,q-40,c-force,cm-extract,fo-left,f-jpeg,r-50,bg-A94D34,b-5-A94D34,rt-90,bl-10,n-some_name,pr-true,lo-true,t-5,md-true,cp-true,di-folder@@file.jpg,dpr-3,x-10,y-20,xc-30,yc-40,fl-h,o-0.8,z-2,vc-h264,ac-aac,so-5,eo-15,du-10,sr-1440_1080,e-grayscale,e-upscale,e-retouch,e-genvar,e-dropshadow,e-changebg-prompt-car,e-bgremove,e-contrast,e-shadow-bl-15_st-40_x-10_y-N5,e-sharpen-10,e-usm-2-2-0.8-0.024,e-gradient-from-red_to-white,orig-true,pg-2_4,h-200,w-300,l-image,i-logo.png,l-end/test_path.jpg`);
    });
});
