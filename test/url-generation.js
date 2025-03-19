const chai = require("chai");
const pkg = require("../package.json");
global.FormData = require('formdata-node');
const expect = chai.expect;
const initializationParams = require("./data").initializationParams
import ImageKit from "../src/index";

describe("URL generation", function () {

    var imagekit = new ImageKit(initializationParams);

    it('no path no src', function () {
        const url = imagekit.url({});

        expect(url).equal("");
    });

    it('invalid src url', function () {
        const url = imagekit.url({ src: "/" });

        expect(url).equal("");
    });

    it('no transformation path', function () {
        const url = imagekit.url({
            path: "/test_path.jpg"
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg`);
    });

    it('no transformation src', function () {
        const url = imagekit.url({
            src: "https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg"
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg`);
    });

    it('Undefined parameters with path', function () {
        const url = imagekit.url({
            path: "/test_path_alt.jpg",
            transformation: undefined,
            transformationPosition: undefined,
            src: undefined,
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg`);
    });

    it('should generate the url without sdk-version', function () {
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

    it('should generate the correct url with path param', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                "height": "300",
                "width": "400"
            }]
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400/test_path.jpg`);
    });

    it('should generate the correct url with path param with multiple leading slash', function () {
        const url = imagekit.url({
            path: "///test_path.jpg",
            transformation: [{
                "height": "300",
                "width": "400"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400/test_path.jpg`);

    });

    it('should generate the correct url with path param with overidden urlEndpoint', function () {
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

    it('should generate the correct url with path param with transformationPostion as query', function () {
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

    it('should generate the correct url with src param', function () {
        const url = imagekit.url({
            src: "https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg",
            transformation: [{
                "height": "300",
                "width": "400"
            }]
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg?tr=h-300%2Cw-400`);
    });

    it('should generate the correct url with transformationPostion as query', function () {
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

    it('should generate the correct url with query params properly merged', function () {
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


    it('should generate the correct chained transformation', function () {
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


    it('should generate the correct chained transformation url with new undocumented tranforamtion parameter', function () {
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

    it('Overlay image', function () {
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

    it('Overlay image with slash in path', function () {
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

    it('Border', function () {
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

    it('transformation with empty key and empty value', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                "": ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:-/test_path.jpg`);
    });

    /**
     * Provided to provide support to a new transform without sdk update
     */
    it('transformation with undefined transform', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                "undefined-transform": "true"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:undefined-transform-true/test_path.jpg`);
    });

    it('transformation with empty value', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                defaultImage: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:di-/test_path.jpg`);
    });

    it('transformation with - value', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                effectContrast: "-"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-contrast/test_path.jpg`);
    });

    it('skip transformation if it is undefined or null', function () {
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

    it('skip transformation if it is false', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                defaultImage: "/test_path.jpg",
                effectContrast: false
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:di-test_path.jpg/test_path1.jpg`);
    });

    it('include just key if value is empty string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                defaultImage: "/test_path.jpg",
                shadow: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:di-test_path.jpg,e-shadow/test_path1.jpg`);
    });

    it('include value if set', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                defaultImage: "/test_path.jpg",
                shadow: "bl-15_st-40_x-10_y-N5"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:di-test_path.jpg,e-shadow-bl-15_st-40_x-10_y-N5/test_path1.jpg`);
    });

    it('trim with true as boolean', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                defaultImage: "/test_path.jpg",
                trim: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:di-test_path.jpg,t-true/test_path1.jpg`);
    });

    it('trim with true as string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                defaultImage: "/test_path.jpg",
                trim: "true"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:di-test_path.jpg,t-true/test_path1.jpg`);
    });

    it('ai remove background', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiRemoveBackground: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-bgremove/test_path1.jpg`);
    });

    it('ai remove background true as string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiRemoveBackground: "true"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-bgremove/test_path1.jpg`);
    });

    it('ai remove background other than true', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiRemoveBackground: "false"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg`);
    });

    it('ai remove background external', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiRemoveBackgroundExternal: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-removedotbg/test_path1.jpg`);
    });

    it('ai remove background external true as string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiRemoveBackgroundExternal: "true"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-removedotbg/test_path1.jpg`);
    });

    it('ai remove background external other than true', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiRemoveBackgroundExternal: "false"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path1.jpg`);
    });

    it('gradient with string value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                gradient: "ld-top_from-green_to-00FF0010_sp-1"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-gradient-ld-top_from-green_to-00FF0010_sp-1/test_path1.jpg`);
    });

    it('gradient with empty string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                gradient: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-gradient/test_path1.jpg`);
    });

    it('gradient with true value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                gradient: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-gradient/test_path1.jpg`);
    });

    it('aiDropShadow with true value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiDropShadow: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-dropshadow/test_path1.jpg`);
    });

    it('aiDropShadow with empty string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiDropShadow: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-dropshadow/test_path1.jpg`);
    });

    it('aiDropShadow with string value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aiDropShadow: "az-45"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-dropshadow-az-45/test_path1.jpg`);
    });

    it('shadow with true value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                shadow: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-shadow/test_path1.jpg`);
    });

    it('shadow with empty string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                shadow: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-shadow/test_path1.jpg`);
    });

    it('shadow with string value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                shadow: "bl-15_st-40_x-10_y-N5"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-shadow-bl-15_st-40_x-10_y-N5/test_path1.jpg`);
    });

    it('sharpen with true value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                sharpen: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-sharpen/test_path1.jpg`);
    });

    it('sharpen with empty string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                sharpen: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-sharpen/test_path1.jpg`);
    });

    it('sharpen with number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                sharpen: 10
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-sharpen-10/test_path1.jpg`);
    });

    it('unsharpMask with true value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                unsharpMask: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-usm/test_path1.jpg`);
    });

    it('unsharpMask with empty string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                unsharpMask: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-usm/test_path1.jpg`);
    });

    it('unsharpMask with string value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                unsharpMask: "2-2-0.8-0.024"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:e-usm-2-2-0.8-0.024/test_path1.jpg`);
    });

    it('trim with true value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                trim: true
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:t-true/test_path1.jpg`);
    });

    it('trim with empty string', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                trim: ""
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:t-true/test_path1.jpg`);
    });

    it('trim with number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                trim: 5
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:t-5/test_path1.jpg`);
    });

    // Width parameter tests
    it('width with number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                width: 400
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:w-400/test_path1.jpg`);
    });

    it('width with string value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                width: "400"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:w-400/test_path1.jpg`);
    });

    it('width with arithmetic expression', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                width: "iw_div_2"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:w-iw_div_2/test_path1.jpg`);
    });

    // Height parameter tests
    it('height with number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                height: 300
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300/test_path1.jpg`);
    });

    it('height with string value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                height: "300"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300/test_path1.jpg`);
    });

    it('height with arithmetic expression', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                height: "ih_mul_0.5"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-ih_mul_0.5/test_path1.jpg`);
    });

    // AspectRatio parameter tests
    it('aspectRatio with string value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aspectRatio: "4:3"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:ar-4:3/test_path1.jpg`);
    });

    it('aspectRatio with alternate format', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aspectRatio: "4_3"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:ar-4_3/test_path1.jpg`);
    });

    it('aspectRatio with expression', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                aspectRatio: "iar_div_2"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:ar-iar_div_2/test_path1.jpg`);
    });

    // Background parameter tests
    it('background with solid color', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                background: "FF0000"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:bg-FF0000/test_path1.jpg`);
    });

    it('background with blurred option', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                background: "blurred"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:bg-blurred/test_path1.jpg`);
    });

    it('background with genfill option', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                background: "genfill"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:bg-genfill/test_path1.jpg`);
    });

    // Crop parameter tests
    it('crop with force value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                crop: "force"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:c-force/test_path1.jpg`);
    });

    it('crop with at_max value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                crop: "at_max"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:c-at_max/test_path1.jpg`);
    });

    // CropMode parameter tests
    it('cropMode with pad_resize value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                cropMode: "pad_resize"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:cm-pad_resize/test_path1.jpg`);
    });

    it('cropMode with extract value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                cropMode: "extract"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:cm-extract/test_path1.jpg`);
    });

    // Focus parameter tests
    it('focus with string value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                focus: "center"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:fo-center/test_path1.jpg`);
    });

    it('focus with face detection', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                focus: "face"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:fo-face/test_path1.jpg`);
    });

    // Quality parameter test
    it('quality with number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                quality: 80
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:q-80/test_path1.jpg`);
    });

    // Coordinate parameters tests
    it('x with number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                x: 10
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:x-10/test_path1.jpg`);
    });

    it('y with number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                y: 20
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:y-20/test_path1.jpg`);
    });

    it('xCenter with number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                xCenter: 30
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:xc-30/test_path1.jpg`);
    });

    it('yCenter with number value', function () {
        const url = imagekit.url({
            path: "/test_path1.jpg",
            transformation: [{
                yCenter: 40
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:yc-40/test_path1.jpg`);
    });

    it('All combined', function () {
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
