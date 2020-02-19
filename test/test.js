const chai = require("chai");
const sinon = require("sinon");

const expect = chai.expect;

opts = {
    publicKey: "test_public_key", 
    urlEndpoint: "https://ik.imagekit.io/test_url_endpoint", 
    authenticationEndpoint: "http://test/auth"
}

var ImageKit = require("../");


describe("Testing SDK", function () {

    describe("Imagekit Class", function () {

        var imagekit = new ImageKit(opts);

        describe("imagekit instance", function () {
            it('should have options object', function () {
                expect(imagekit.options).to.be.an('object');
            });

            it('should have correctly initialized options object.', function() {
                expect(imagekit.options).to.have.property('publicKey').to.be.equal(opts.publicKey);
                expect(imagekit.options).to.have.property('urlEndpoint').to.be.equal(opts.urlEndpoint);
                expect(imagekit.options).to.have.property('authenticationEndpoint').to.be.equal(opts.authenticationEndpoint);
            });

            it("should have callable functions 'url' and 'upload'", function() {
                expect(imagekit.url).to.exist.and.to.be.a('function');
                expect(imagekit.upload).to.exist.and.to.be.a('function');
            });

            describe(".url method", function() {
                it('should generate the correct url with path param', function() {
                    const url = imagekit.url({
                        path: "/test_path.jpg",
                        transformation : [{
                            "height" : "300",
                            "width" : "400"
                        }]
                    })
                    expect(url).to.match(/^https\:\/\/ik\.imagekit\.io\/test\_url\_endpoint/);
                    expect(url).to.match(new RegExp("\/tr:"));
                    expect(url).to.match(new RegExp("w-400"));
                    expect(url).to.match(new RegExp("h-300"));
                    expect(url).to.match(/\/test_path\.jpg[^\/][\?]?/);
                });

                it('should generate the correct url with src param', function() {
                    const url = imagekit.url({
                        src : "https://ik.imagekit.io/test_url_endpoint/endpoint/test_path.jpg",
                        transformation : [{
                            "height" : "300",
                            "width" : "400"
                        }]
                    });
                    expect(url).to.match(/^https\:\/\/ik\.imagekit\.io\/test_url_endpoint\/endpoint\/test\_path\.jpg/);
                    expect(url).to.match(/\&tr=/);
                    expect(url).to.match(new RegExp("w-400"));
                    expect(url).to.match(new RegExp("h-300"));
                });
            });

            describe(".upload method", function() {
                const requestUtils = require('../utils/request.js');
                sinon.stub(requestUtils, 'generateSignatureToken').callsFake(function (options, callback) {
                    callback(null, {
                        signature: "test_signature",
                        expire: 123,
                        token: "test_token"
                    })
                });

                sinon.stub(requestUtils, 'uploadFile').callsFake(function (options, callback) {
                    callback(null, "success")
                });

                global.FormData = require('formdata-node');


                const fileOptions = {
                    fileName: "test_file_name",
                    file: "test_file",
                };

                it('calls relavant functions in order', function() {
                    imagekit.upload(fileOptions, function(){});
                    expect(requestUtils.generateSignatureToken.calledOnce).to.be.true;
                    expect(requestUtils.uploadFile.calledOnce).to.be.true;
                });

                it('calls functions with correct arguments', function() {
                    const arg = requestUtils.uploadFile.getCall(0).args[0];
                    expect(arg.get('file')).to.be.equal("test_file");
                    expect(arg.get('fileName')).to.be.equal("test_file_name");
                    expect(arg.get('token')).to.be.equal("test_token");
                    expect(arg.get('expire')).to.be.equal("123");
                    expect(arg.get('signature')).to.be.equal("test_signature");
                });
                
            });
        });
    });
});

