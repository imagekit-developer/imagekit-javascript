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
        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:l-text,ie-${encodeURIComponent(safeBtoa("Minimal Text"))},l-end/base-image.jpg`);
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

        expect(url).equal(`https://ik.imagekit.io/test_url_endpoint/tr:l-text,ie-${encodeURIComponent(safeBtoa("Every thing"))},lxo-10,lyo-20,lfo-center,lso-5,leo-15,ldu-10,w-bw_mul_0.5,fs-20,ff-Arial,co-0000ff,ia-left,pa-5,al-7,tg-b,bg-red,r-10,rt-N45,fl-h,lh-20,l-end:l-image,i-logo.png,lxo-10,lyo-20,lfo-center,lso-5,leo-15,ldu-10,w-bw_mul_0.5,h-bh_mul_0.5,rt-N45,fl-h,l-text,ie-${encodeURIComponent(safeBtoa("Nested text overlay"))},l-end,l-end:l-video,i-play-pause-loop.mp4,lxo-10,lyo-20,lfo-center,lso-5,leo-15,ldu-10,l-end:l-subtitle,i-subtitle.srt,lxo-10,lyo-20,lfo-center,lso-5,leo-15,ldu-10,l-end:l-image,i-ik_canvas,bg-FF0000,lxo-10,lyo-20,lfo-center,lso-5,leo-15,ldu-10,w-bw_mul_0.5,h-bh_mul_0.5,rt-N45,fl-h,l-end/base-image.jpg`)
    });
});
