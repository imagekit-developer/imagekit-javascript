const chai = require("chai");
const expect = chai.expect;
const initializationParams = require("../data").initializationParams;
import ImageKit from "../../src/index";
import { safeBtoa } from "../../src/utils/transformation";
describe("Overlay Transformation Test Cases", function () {
    const imagekit = new ImageKit(initializationParams);

    it('Ignore invalid values if text is missing', function () {
        const url = imagekit.url({
            path: "/base-image.jpg",
            transformation: [{
                overlay: {
                    type: "text"
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/base-image.jpg`);
    });

    it('Ignore invalid values if input', function () {
        const url = imagekit.url({
            path: "/base-image.jpg",
            transformation: [{
                overlay: {
                    type: "image"
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/base-image.jpg`);
    });

    it('Ignore invalid values if input', function () {
        const url = imagekit.url({
            path: "/base-image.jpg",
            transformation: [{
                overlay: {
                    type: "video"
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/base-image.jpg`);
    });

    it('Ignore invalid values if input', function () {
        const url = imagekit.url({
            path: "/base-image.jpg",
            transformation: [{
                overlay: {
                    type: "subtitle"
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/base-image.jpg`);
    });

    it('Ignore invalid values if color is missing', function () {
        const url = imagekit.url({
            path: "/base-image.jpg",
            transformation: [{
                overlay: {
                    type: "solidColor"
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/base-image.jpg`);
    });

    it('Text overlay generates correct URL with encoded overlay text', function () {
        const url = imagekit.url({
            path: "/base-image.jpg",
            transformation: [{
                overlay: {
                    type: "text",
                    text: "Minimal Text",
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:l-text,i-${encodeURIComponent("Minimal Text")},l-end/base-image.jpg`);
    });

    it('Image overlay generates correct URL with input logo.png', function () {
        const url = imagekit.url({
            path: "/base-image.jpg",
            transformation: [{
                overlay: {
                    type: "image",
                    input: "logo.png",
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:l-image,i-logo.png,l-end/base-image.jpg`);
    });

    it('Video overlay generates correct URL with input play-pause-loop.mp4', function () {
        const url = imagekit.url({
            path: "/base-video.mp4",
            transformation: [{
                overlay: {
                    type: "video",
                    input: "play-pause-loop.mp4",
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:l-video,i-play-pause-loop.mp4,l-end/base-video.mp4`);
    });

    it("Subtitle overlay generates correct URL with input subtitle.srt", function () {
        const url = imagekit.url({
            path: "/base-video.mp4",
            transformation: [{
                overlay: {
                    type: "subtitle",
                    input: "subtitle.srt",
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:l-subtitle,i-subtitle.srt,l-end/base-video.mp4`);
    });

    it("Solid color overlay generates correct URL with background color FF0000", function () {
        const url = imagekit.url({
            path: "/base-image.jpg",
            transformation: [{
                overlay: {
                    type: "solidColor",
                    color: "FF0000",
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:l-image,i-ik_canvas,bg-FF0000,l-end/base-image.jpg`);
    });

    it('Combined overlay transformations generate correct URL including nested overlays', function () {
        const url = imagekit.url({
            path: "/base-image.jpg",
            transformation: [
                {
                    // Text overlay
                    overlay: {
                        type: "text",
                        text: "Every thing",
                        position: {
                            x: "10",
                            y: "20",
                            focus: "center"
                        },
                        timing: {
                            start: 5,
                            duration: "10",
                            end: 15
                        },
                        transformation: [{
                            width: "bw_mul_0.5",
                            fontSize: 20,
                            fontFamily: "Arial",
                            fontColor: "0000ff",
                            innerAlignment: "left",
                            padding: 5,
                            alpha: 7,
                            typography: "b",
                            background: "red",
                            radius: 10,
                            rotation: "N45",
                            flip: "h",
                            lineHeight: 20
                        }]
                    }
                },
                {
                    // Image overlay
                    overlay: {
                        type: "image",
                        input: "logo.png",
                        position: {
                            x: "10",
                            y: "20",
                            focus: "center"
                        },
                        timing: {
                            start: 5,
                            duration: "10",
                            end: 15
                        },
                        transformation: [
                            {
                                width: "bw_mul_0.5",
                                height: "bh_mul_0.5",
                                rotation: "N45",
                                flip: "h",
                                overlay: {
                                    type: "text",
                                    text: "Nested text overlay",
                                }
                            }
                        ]
                    }
                },
                {
                    // Video overlay. Just for url generation testing, you can't overlay a video on an image.
                    overlay: {
                        type: "video",
                        input: "play-pause-loop.mp4",
                        position: {
                            x: "10",
                            y: "20",
                            focus: "center"
                        },
                        timing: {
                            start: 5,
                            duration: "10",
                            end: 15
                        },
                        transformations: [{
                            width: "bw_mul_0.5",
                            height: "bh_mul_0.5",
                            rotation: "N45",
                            flip: "h",
                        }]
                    }
                },
                {
                    // Subtitle overlay. Just for url generation testing, you can't overlay a subtitle on an image.
                    overlay: {
                        type: "subtitle",
                        input: "subtitle.srt",
                        position: {
                            x: "10",
                            y: "20",
                            focus: "center"
                        },
                        timing: {
                            start: 5,
                            duration: "10",
                            end: 15
                        },
                        transformations: [{
                            width: "bw_mul_0.5",
                            height: "bh_mul_0.5",
                            rotation: "N45",
                            flip: "h",
                        }]
                    }
                },
                {
                    // Solid color overlay
                    overlay: {
                        type: "solidColor",
                        color: "FF0000",
                        position: {
                            x: "10",
                            y: "20",
                            focus: "center"
                        },
                        timing: {
                            start: 5,
                            duration: "10",
                            end: 15
                        },
                        transformation: [{
                            width: "bw_mul_0.5",
                            height: "bh_mul_0.5",
                            rotation: "N45",
                            flip: "h",
                        }]
                    }
                }
            ]
        });

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:l-text,i-${encodeURIComponent("Every thing")},lxo-10,lyo-20,lfo-center,lso-5,leo-15,ldu-10,w-bw_mul_0.5,fs-20,ff-Arial,co-0000ff,ia-left,pa-5,al-7,tg-b,bg-red,r-10,rt-N45,fl-h,lh-20,l-end:l-image,i-logo.png,lxo-10,lyo-20,lfo-center,lso-5,leo-15,ldu-10,w-bw_mul_0.5,h-bh_mul_0.5,rt-N45,fl-h,l-text,i-${encodeURIComponent("Nested text overlay")},l-end,l-end:l-video,i-play-pause-loop.mp4,lxo-10,lyo-20,lfo-center,lso-5,leo-15,ldu-10,l-end:l-subtitle,i-subtitle.srt,lxo-10,lyo-20,lfo-center,lso-5,leo-15,ldu-10,l-end:l-image,i-ik_canvas,bg-FF0000,lxo-10,lyo-20,lfo-center,lso-5,leo-15,ldu-10,w-bw_mul_0.5,h-bh_mul_0.5,rt-N45,fl-h,l-end/base-image.jpg`)
    });
});


describe("Overlay encoding test cases", function () {
    const imagekit = new ImageKit({
        ...initializationParams,
        urlEndpoint: "https://ik.imagekit.io/demo", // Using real url to test correctness quickly by clicking link
    });

    it('Nested simple path, should use i instead of ie, handle slash properly', function () {
        const url = imagekit.url({
            path: "/medium_cafe_B1iTdD0C.jpg",
            transformation: [{
                overlay: {
                    type: "image",
                    input: "/customer_logo/nykaa.png",
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/demo/tr:l-image,i-customer_logo@@nykaa.png,l-end/medium_cafe_B1iTdD0C.jpg`);
    });

    it('Nested non-simple path, should use ie instead of i', function () {
        const url = imagekit.url({
            path: "/medium_cafe_B1iTdD0C.jpg",
            transformation: [{
                overlay: {
                    type: "image",
                    input: "/customer_logo/Ñykaa.png"
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/demo/tr:l-image,ie-Y3VzdG9tZXJfbG9nby9OzIN5a2FhLnBuZw%3D%3D,l-end/medium_cafe_B1iTdD0C.jpg`);
    });

    it('Simple text overlay, should use i instead of ie', function () {
        const url = imagekit.url({
            path: "/medium_cafe_B1iTdD0C.jpg",
            transformation: [{
                overlay: {
                    type: "text",
                    text: "Manu",
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/demo/tr:l-text,i-Manu,l-end/medium_cafe_B1iTdD0C.jpg`);
    });

    it('Simple text overlay with spaces and other safe characters, should use i instead of ie', function () {
        const url = imagekit.url({
            path: "/medium_cafe_B1iTdD0C.jpg",
            transformation: [{
                overlay: {
                    type: "text",
                    text: "alnum123-._ ",
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/demo/tr:l-text,i-${encodeURIComponent("alnum123-._ ")},l-end/medium_cafe_B1iTdD0C.jpg`);
    });

    it('Non simple text overlay, should use ie instead of i', function () {
        const url = imagekit.url({
            path: "/medium_cafe_B1iTdD0C.jpg",
            transformation: [{
                overlay: {
                    type: "text",
                    text: "Let's use ©, ®, ™, etc",
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/demo/tr:l-text,ie-TGV0J3MgdXNlIMKpLCDCriwg4oSiLCBldGM%3D,l-end/medium_cafe_B1iTdD0C.jpg`);
    });

    it('Text overlay with explicit plain encoding', function () {
        const url = imagekit.url({
            path: "/sample.jpg",
            transformation: [{
                overlay: {
                    type: "text",
                    text: "HelloWorld",
                    encoding: "plain"
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/demo/tr:l-text,i-HelloWorld,l-end/sample.jpg`);
    });

    it('Text overlay with explicit base64 encoding', function () {
        const url = imagekit.url({
            path: "/sample.jpg",
            transformation: [{
                overlay: {
                    type: "text",
                    text: "HelloWorld",
                    encoding: "base64"
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/demo/tr:l-text,ie-${encodeURIComponent(safeBtoa("HelloWorld"))},l-end/sample.jpg`);
    });

    it('Image overlay with explicit plain encoding', function () {
        const url = imagekit.url({
            path: "/sample.jpg",
            transformation: [{
                overlay: {
                    type: "image",
                    input: "/customer/logo.png",
                    encoding: "plain"
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/demo/tr:l-image,i-customer@@logo.png,l-end/sample.jpg`);
    });

    it('Image overlay with explicit base64 encoding', function () {
        const url = imagekit.url({
            path: "/sample.jpg",
            transformation: [{
                overlay: {
                    type: "image",
                    input: "/customer/logo.png",
                    encoding: "base64"
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/demo/tr:l-image,ie-${encodeURIComponent(safeBtoa("customer/logo.png"))},l-end/sample.jpg`);
    });

    it('Video overlay with explicit base64 encoding', function () {
        const url = imagekit.url({
            path: "/sample.mp4",
            transformation: [{
                overlay: {
                    type: "video",
                    input: "/path/to/video.mp4",
                    encoding: "base64"
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/demo/tr:l-video,ie-${encodeURIComponent(safeBtoa("path/to/video.mp4"))},l-end/sample.mp4`);
    });

    it('Subtitle overlay with explicit plain encoding', function () {
        const url = imagekit.url({
            path: "/sample.mp4",
            transformation: [{
                overlay: {
                    type: "subtitle",
                    input: "/sub.srt",
                    encoding: "plain"
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/demo/tr:l-subtitle,i-sub.srt,l-end/sample.mp4`);
    });

    it('Subtitle overlay with explicit base64 encoding', function () {
        const url = imagekit.url({
            path: "/sample.mp4",
            transformation: [{
                overlay: {
                    type: "subtitle",
                    input: "sub.srt",
                    encoding: "base64"
                }
            }]
        });
        expect(url).equal(`https://ik.imagekit.io/demo/tr:l-subtitle,ie-${encodeURIComponent(safeBtoa("sub.srt"))},l-end/sample.mp4`);
    });

    it("Avoid double encoding when transformation string is in query params", function () {
        const url = imagekit.url({
            path: "/sample.jpg",
            transformation: [{
                overlay: {
                    type: "text",
                    text: "Minimal Text"
                }
            }],
            transformationPosition: "query"
        });
        expect(url).equal(`https://ik.imagekit.io/demo/sample.jpg?tr=l-text,i-Minimal%20Text,l-end`);
    });
});
