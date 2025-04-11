const { buildTransformationString } = require("../../src/index");
const { expect } = require('chai');

describe('buildTransformationString', function () {
  it('should return an empty string when no transformations are provided', function () {
    const result = buildTransformationString([{}]);
    expect(result).to.equal('');
  });

  it('should generate a transformation string for width only', function () {
    const result = buildTransformationString([{ width: 300 }]);
    expect(result).to.equal('w-300');
  });

  it('should generate a transformation string for multiple transformations', function () {
    const result = buildTransformationString([
      {
        overlay: {
          type: 'text',
          text: 'Hello',
        }
      }
    ]);
    expect(result).to.equal('l-text,i-Hello,l-end');
  });
});
