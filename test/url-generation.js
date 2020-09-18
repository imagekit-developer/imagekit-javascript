const chai = require("chai");
const pkg = require("../package.json");
global.FormData = require('formdata-node');
const expect = chai.expect;
const initializationParams = require("./data").initializationParams
const ImageKit = require(".."); // This will automatically pick main module (cjs bundle) as per package.json

describe("URL generation", function () {

    var imagekit = new ImageKit(initializationParams);

    it('no transformation path', function () {
        const url = imagekit.url({
            path: "/test_path.jpg"
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg?ik-sdk-version=javascript-${pkg.version}`);
    });

    it('no transformation src', function () {
        const url = imagekit.url({
            src: "https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg"
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg?ik-sdk-version=javascript-${pkg.version}`);
    });

    it('Undefined parameters with path', function () {
        const url = imagekit.url({
            path: "/test_path_alt.jpg",
            transformation: undefined,
            transformationPosition: undefined,
            src: undefined,
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg?ik-sdk-version=javascript-${pkg.version}`);
    });

    it('should generate the correct url with path param', function () {
        const url = imagekit.url({
            path: "/test_path.jpg",
            transformation: [{
                "height": "300",
                "width": "400"
            }]
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400/test_path.jpg?ik-sdk-version=javascript-${pkg.version}`);
    });

    it('should generate the correct url with path param with multiple leading slash', function () {
        const url = imagekit.url({
            path: "///test_path.jpg",
            transformation: [{
                "height": "300",
                "width": "400"
            }]
        })

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400/test_path.jpg?ik-sdk-version=javascript-${pkg.version}`);

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

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint_alt/tr:h-300,w-400/test_path.jpg?ik-sdk-version=javascript-${pkg.version}`);

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

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path.jpg?ik-sdk-version=javascript-${pkg.version}&tr=h-300%2Cw-400`);
    });

    it('should generate the correct url with src param', function () {
        const url = imagekit.url({
            src: "https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg",
            transformation: [{
                "height": "300",
                "width": "400"
            }]
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg?ik-sdk-version=javascript-${pkg.version}&tr=h-300%2Cw-400`);
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

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg?ik-sdk-version=javascript-${pkg.version}&tr=h-300%2Cw-400`);
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

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg?t1=v1&ik-sdk-version=javascript-${pkg.version}&t2=v2&t3=v3&tr=h-300%2Cw-400`);
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

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400:rt-90/test_path.jpg?ik-sdk-version=javascript-${pkg.version}`);
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

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:h-300,w-400:rndm_trnsf-abcd/test_path.jpg?ik-sdk-version=javascript-${pkg.version}`);
    });
});


