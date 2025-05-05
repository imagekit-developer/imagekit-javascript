const { expect } = require('chai');
const { getResponsiveImageAttributes } = require('../src/getResponsiveImageAttributes');

describe('getResponsiveImageAttributes', () => {
  it('bare minimum input', () => {
    const out = getResponsiveImageAttributes({
      src: 'sample.jpg',
      urlEndpoint: 'https://ik.imagekit.io/demo',
    });
    // Expected object based on default deviceBreakpoints and imageBreakpoints:
    expect(out).to.deep.equal({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max",
      srcSet: "https://ik.imagekit.io/demo/sample.jpg?tr=w-640,c-at_max 640w, https://ik.imagekit.io/demo/sample.jpg?tr=w-750,c-at_max 750w, https://ik.imagekit.io/demo/sample.jpg?tr=w-828,c-at_max 828w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1080,c-at_max 1080w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1200,c-at_max 1200w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1920,c-at_max 1920w, https://ik.imagekit.io/demo/sample.jpg?tr=w-2048,c-at_max 2048w, https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max 3840w",
      sizes: "100vw"
    });
  });

  it('sizes provided (100vw)', () => {
    const out = getResponsiveImageAttributes({
      src: 'sample.jpg',
      urlEndpoint: 'https://ik.imagekit.io/demo',
      sizes: '100vw',
    });
    // With a sizes value of "100vw", the function should use the same breakpoints as in the bare minimum case.
    expect(out).to.deep.equal({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max",
      srcSet: "https://ik.imagekit.io/demo/sample.jpg?tr=w-640,c-at_max 640w, https://ik.imagekit.io/demo/sample.jpg?tr=w-750,c-at_max 750w, https://ik.imagekit.io/demo/sample.jpg?tr=w-828,c-at_max 828w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1080,c-at_max 1080w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1200,c-at_max 1200w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1920,c-at_max 1920w, https://ik.imagekit.io/demo/sample.jpg?tr=w-2048,c-at_max 2048w, https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max 3840w",
      sizes: "100vw"
    });
  });

  it('width only – DPR strategy', () => {
    const out = getResponsiveImageAttributes({
      src: 'sample.jpg',
      urlEndpoint: 'https://ik.imagekit.io/demo',
      width: 400,
    });
    // When width is provided without sizes attribute, the DPR strategy should be used.
    expect(out).to.deep.equal({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=w-828,c-at_max",
      srcSet: "https://ik.imagekit.io/demo/sample.jpg?tr=w-640,c-at_max 1x, https://ik.imagekit.io/demo/sample.jpg?tr=w-828,c-at_max 2x",
      width: 400
    });
  });

  it('custom breakpoints', () => {
    const out = getResponsiveImageAttributes({
      src: 'sample.jpg',
      urlEndpoint: 'https://ik.imagekit.io/demo',
      deviceBreakpoints: [200, 400, 800],
      imageBreakpoints: [100],
    });
    // For custom breakpoints, the breakpoints will be derived from the provided arrays.
    expect(out).to.deep.equal({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=w-800,c-at_max",
      srcSet: "https://ik.imagekit.io/demo/sample.jpg?tr=w-200,c-at_max 200w, https://ik.imagekit.io/demo/sample.jpg?tr=w-400,c-at_max 400w, https://ik.imagekit.io/demo/sample.jpg?tr=w-800,c-at_max 800w",
      sizes: "100vw"
    });
  });

  it('preserves caller transformations', () => {
    const out = getResponsiveImageAttributes({
      src: 'sample.jpg',
      urlEndpoint: 'https://ik.imagekit.io/demo',
      width: 500,
      transformation: [{ height: 300 }],
    });
    // The provided transformation should be preserved in the output.
    expect(out).to.deep.equal({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=h-300:w-1080,c-at_max",
      srcSet: "https://ik.imagekit.io/demo/sample.jpg?tr=h-300:w-640,c-at_max 1x, https://ik.imagekit.io/demo/sample.jpg?tr=h-300:w-1080,c-at_max 2x",
      width: 500
    });
  });

  it('both sizes and width passed', () => {
    const out = getResponsiveImageAttributes({
      src: 'sample.jpg',
      urlEndpoint: 'https://ik.imagekit.io/demo',
      sizes: '50vw',
      width: 600,
    });
    // Both sizes and width are provided, so the function should apply the sizes attribute while using width for DPR strategy.
    expect(out).to.deep.equal({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max",
      srcSet: "https://ik.imagekit.io/demo/sample.jpg?tr=w-384,c-at_max 384w, https://ik.imagekit.io/demo/sample.jpg?tr=w-640,c-at_max 640w, https://ik.imagekit.io/demo/sample.jpg?tr=w-750,c-at_max 750w, https://ik.imagekit.io/demo/sample.jpg?tr=w-828,c-at_max 828w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1080,c-at_max 1080w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1200,c-at_max 1200w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1920,c-at_max 1920w, https://ik.imagekit.io/demo/sample.jpg?tr=w-2048,c-at_max 2048w, https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max 3840w",
      sizes: "50vw",
      width: 600
    });
  });

  it('multiple transformations', () => {
    const out = getResponsiveImageAttributes({
      src: 'sample.jpg',
      urlEndpoint: 'https://ik.imagekit.io/demo',
      width: 450,
      transformation: [
        { height: 300 },
        { aiRemoveBackground: true }
      ]
    });
    // Multiple caller transformations should be combined appropriately.
    expect(out).to.deep.equal({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=h-300:e-bgremove:w-1080,c-at_max",
      srcSet: "https://ik.imagekit.io/demo/sample.jpg?tr=h-300:e-bgremove:w-640,c-at_max 1x, https://ik.imagekit.io/demo/sample.jpg?tr=h-300:e-bgremove:w-1080,c-at_max 2x",
      width: 450
    });
  });

  it('sizes causes breakpoint pruning (33vw path)', () => {
    const out = getResponsiveImageAttributes({
      src: 'sample.jpg',
      urlEndpoint: 'https://ik.imagekit.io/demo',
      sizes: '(min-width: 800px) 33vw, 100vw',
    });
    // When specified with a sizes attribute that prunes breakpoints, the output should reflect the pruned values.
    expect(out).to.deep.equal({
      src: "https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max",
      srcSet: "https://ik.imagekit.io/demo/sample.jpg?tr=w-256,c-at_max 256w, https://ik.imagekit.io/demo/sample.jpg?tr=w-384,c-at_max 384w, https://ik.imagekit.io/demo/sample.jpg?tr=w-640,c-at_max 640w, https://ik.imagekit.io/demo/sample.jpg?tr=w-750,c-at_max 750w, https://ik.imagekit.io/demo/sample.jpg?tr=w-828,c-at_max 828w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1080,c-at_max 1080w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1200,c-at_max 1200w, https://ik.imagekit.io/demo/sample.jpg?tr=w-1920,c-at_max 1920w, https://ik.imagekit.io/demo/sample.jpg?tr=w-2048,c-at_max 2048w, https://ik.imagekit.io/demo/sample.jpg?tr=w-3840,c-at_max 3840w",
      sizes: "(min-width: 800px) 33vw, 100vw"
    });
  });

  it("Using queryParameters and transformationPosition", () => {
    const out = getResponsiveImageAttributes({
      src: 'sample.jpg',
      urlEndpoint: 'https://ik.imagekit.io/demo',
      width: 450,
      transformation: [
        { height: 300 },
        { aiRemoveBackground: true }
      ],
      queryParameters: {
        key: "value"
      },
      transformationPosition: "path"
    });
    // The function should respect the transformation position and query parameters.
    expect(out).to.deep.equal({
      src: "https://ik.imagekit.io/demo/tr:h-300:e-bgremove:w-1080,c-at_max/sample.jpg?key=value",
      srcSet: "https://ik.imagekit.io/demo/tr:h-300:e-bgremove:w-640,c-at_max/sample.jpg?key=value 1x, https://ik.imagekit.io/demo/tr:h-300:e-bgremove:w-1080,c-at_max/sample.jpg?key=value 2x",
      width: 450
    });
  })
});
