const chai = require("chai");
const expect = chai.expect;
const initializationParams = require("./data").initializationParams
const ImageKit = require(".."); // This will automatically pick main module (cjs bundle) as per package.json


describe("Initialization checks", function () {
    var imagekit = new ImageKit(initializationParams);

    it('should have options object', function () {
        expect(imagekit.options).to.be.an('object');
    });

    it('should have correctly initialized options object.', function () {
        expect(imagekit.options).to.have.property('publicKey').to.be.equal(initializationParams.publicKey);
        expect(imagekit.options).to.have.property('urlEndpoint').to.be.equal(initializationParams.urlEndpoint);
        expect(imagekit.options).to.have.property('authenticationEndpoint').to.be.equal(initializationParams.authenticationEndpoint);
    });

    it("should have callable functions 'url' and 'upload'", function () {
        expect(imagekit.url).to.exist.and.to.be.a('function');
        expect(imagekit.upload).to.exist.and.to.be.a('function');
    });

    it('only urlEndpoint is required parameter', function () {
        let imagekit = new ImageKit({
            urlEndpoint: initializationParams.urlEndpoint
        });

        expect(imagekit.options).to.be.an('object');
        expect(imagekit.options).to.have.property('urlEndpoint').to.be.equal(initializationParams.urlEndpoint);
        expect(imagekit.url).to.exist.and.to.be.a('function');
        expect(imagekit.upload).to.exist.and.to.be.a('function');

    });
});