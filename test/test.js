const chai = require("chai");
const sinon = require("sinon");
const requestUtils = require('../utils/request.js');
const fs = require('fs');
const path = require('path');

global.FormData = require('formdata-node');

const expect = chai.expect;
const test_file_path = path.resolve(__dirname, "test_image.png");
opts = {
    publicKey: "test_public_key", 
    urlEndpoint: "https://ik.imagekit.io/test_url_endpoint", 
    authenticationEndpoint: "http://test/auth"
}

var ImageKit = require("../index.js");


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
        });

        describe(".url method", function() {
            it('should generate the correct url with path param', function() {
                const url = imagekit.url({
                    path: "/test_path.jpg",
                    transformation : [{
                        "height" : "300",
                        "width" : "400"
                    }]
                });

                expect(url).to.match(/^https\:\/\/ik\.imagekit\.io\/test\_url\_endpoint\/[^\/]/);
                expect(url).to.match(new RegExp("[^\/]\/tr:"));
                expect(url).to.match(new RegExp(":h-300,w-400"));
                expect(url).to.match(/[^\/]\/test_path\.jpg[^\/][\?]?/);
                expect(url).to.match(/ik\-sdk\-version\=javascript\-\d\.\d\.\d/);
            });

            it('should generate the correct url with path param with multiple leading slash', function() {
                const url = imagekit.url({
                    path: "///test_path.jpg",
                    transformation : [{
                        "height" : "300",
                        "width" : "400"
                    }]
                })
                expect(url).to.match(/^https\:\/\/ik\.imagekit\.io\/test\_url\_endpoint\/[^\/]/);
                expect(url).to.match(new RegExp("[^\/]\/tr:"));
                expect(url).to.match(new RegExp(":h-300,w-400"));
                expect(url).to.match(/[^\/]\/test_path\.jpg[^\/][\?]?/);
                expect(url).to.match(/ik\-sdk\-version\=javascript\-\d\.\d\.\d/);

            });

            it('should generate the correct url with path param with overidden urlEndpoint', function() {
                const url = imagekit.url({
                    urlEndpoint: "https://ik.imagekit.io/test_url_endpoint_alt",
                    path: "/test_path.jpg",
                    transformation : [{
                        "height" : "300",
                        "width" : "400"
                    }]
                })
                expect(url).to.match(/^https\:\/\/ik\.imagekit\.io\/test\_url\_endpoint\_alt\/[^\/]/);
                expect(url).to.match(new RegExp("[^\/]\/tr:"));
                expect(url).to.match(new RegExp(":h-300,w-400"));
                expect(url).to.match(/[^\/]\/test_path\.jpg[^\/][\?]?/);
                expect(url).to.match(/ik\-sdk\-version\=javascript\-\d\.\d\.\d/);

            });

            it('should generate the correct url with path param with transformationPostion as query', function() {
                const url = imagekit.url({
                    path: "/test_path.jpg",
                    transformationPosition: "query",
                    transformation : [{
                        "height" : "300",
                        "width" : "400"
                    }]
                });
                expect(url).to.match(/^https\:\/\/ik\.imagekit\.io\/test\_url\_endpoint\/test\_path\.jpg\?/);
                expect(url).to.match(new RegExp('&tr=h-300%2Cw-400'));
                expect(url).to.match(/ik\-sdk\-version\=javascript\-\d\.\d\.\d/);
            });

            it('should generate the correct url with src param', function() {
                const url = imagekit.url({
                    src : "https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg",
                    transformation : [{
                        "height" : "300",
                        "width" : "400"
                    }]
                });
                expect(url).to.match(/^https\:\/\/ik\.imagekit\.io\/test\_url\_endpoint\/test\_path\_alt\.jpg[^\/]/);
                expect(url).to.match(new RegExp('&tr=h-300%2Cw-400'));
                expect(url).to.match(/ik\-sdk\-version\=javascript\-\d\.\d\.\d/);
            });

            it('should generate the correct url with transformationPostion as query', function() {
                const url = imagekit.url({
                    src : "https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg",
                    transformationPosition: "query",
                    transformation : [{
                        "height" : "300",
                        "width" : "400"
                    }]
                });
                expect(url).to.match(/^https\:\/\/ik\.imagekit\.io\/test\_url\_endpoint\/test\_path\_alt\.jpg\?/);
                expect(url).to.match(new RegExp('&tr=h-300%2Cw-400'));
                expect(url).to.match(/ik\-sdk\-version\=javascript\-\d\.\d\.\d/);
            });

            it('should generate the correct url with query params properly merged', function() {
                const url = imagekit.url({
                    src : "https://ik.imagekit.io/test_url_endpoint/test_path_alt.jpg?t1=v1",
                    queryParameters: {t2: "v2", t3: "v3"},
                    transformation : [{
                        "height" : "300",
                        "width" : "400"
                    }]
                });

                expect(url).to.match(/^https\:\/\/ik\.imagekit\.io\/test\_url\_endpoint\/test\_path\_alt\.jpg\?t1=v1\&/);
                expect(url).to.match(new RegExp('&t2=v2&'));
                expect(url).to.match(new RegExp('&t3=v3&'));
                expect(url).to.match(new RegExp('&tr=h-300%2Cw-400'));
                expect(url).to.match(/ik\-sdk\-version\=javascript\-\d\.\d\.\d/);
            });


            it('should generate the correct chained transformation', function() {
                const url = imagekit.url({
                    path: "/test_path.jpg",
                    transformation : [{
                        "height" : "300",
                        "width" : "400"
                    }, {
                        "rt": "90"
                    }]
                })

                expect(url).to.match(/^https\:\/\/ik\.imagekit\.io\/test\_url\_endpoint\/[^\/]/);
                expect(url).to.match(new RegExp("[^\/]\/tr:"));
                expect(url).to.match(new RegExp(":h-300,w-400:rt-90"));
                expect(url).to.not.match(new RegExp(":rt-90:h-300,w-400"));
                expect(url).to.match(/[^\/]\/test_path\.jpg[^\/][\?]?/);
                expect(url).to.match(/ik\-sdk\-version\=javascript\-\d\.\d\.\d/);
            });


            it('should generate the correct chained transformation url with new undocumented tranforamtion parameter', function() {
                const url = imagekit.url({
                    path: "/test_path.jpg",
                    transformation : [{
                        "height" : "300",
                        "width" : "400"
                    }, {
                        "rndm_trnsf": "abcd"
                    }]
                })

                expect(url).to.match(/^https\:\/\/ik\.imagekit\.io\/test\_url\_endpoint\/[^\/]/);
                expect(url).to.match(new RegExp("[^\/]\/tr:"));
                expect(url).to.match(new RegExp(":h-300,w-400:rndm_trnsf-abcd"));
                expect(url).to.not.match(new RegExp(":rndm_trnsf-abcd:h-300,w-400"));
                expect(url).to.match(/[^\/]\/test_path\.jpg[^\/][\?]?/);
                expect(url).to.match(/ik\-sdk\-version\=javascript\-\d\.\d\.\d/);
            });
            
        });

        describe(".upload method", function() {
            let orderCop;

            before(function() {
                orderCop = sinon.spy();
                sinon.stub(requestUtils, 'generateSignatureToken').callsFake(function (options, callback) {
                    orderCop('signatureCall');
                    callback(null, {
                        signature: "test_signature",
                        expire: 123,
                        token: "test_token"
                    });
                });
                sinon.stub(requestUtils, 'uploadFile').callsFake(function (options, callback) {
                    orderCop('uploadCall');
                    callback(null, "success");
                });

            });   
            
            beforeEach(function() {
                orderCop.resetHistory();
                requestUtils.generateSignatureToken.resetHistory();
                requestUtils.uploadFile.resetHistory();
            });

            it('calls relavant functions in order', function() {
                const fileOptions = {
                    fileName: "test_file_name",
                    file: "test_file",
                };
                imagekit.upload(fileOptions, function(){});

                expect(requestUtils.generateSignatureToken.calledOnce).to.be.true;
                expect(requestUtils.uploadFile.calledOnce).to.be.true;
                expect(orderCop.firstCall.args[0]).to.be.equal('signatureCall');
                expect(orderCop.secondCall.args[0]).to.be.equal('uploadCall');
            });

            it('calls functions with correct arguments', function() {

                const fileOptions = {
                    fileName: "test_file_name",
                    file: "test_file",
                    tags : ["test_tag1", "test_tag2"],
                    customCoordinates: "test_customCoordinates",
                    responseFields: "tags, customCoordinates, isPrivateFile, metadata",
                    useUniqueFileName: true
                };
                imagekit.upload(fileOptions, function(){});

                const arg = requestUtils.uploadFile.getCall(0).args[0];
                expect(arg.get('file')).to.be.equal("test_file");
                expect(arg.get('fileName')).to.be.equal("test_file_name");
                expect(arg.get('token')).to.be.equal("test_token");
                expect(arg.get('expire')).to.be.equal("123");
                expect(arg.get('signature')).to.be.equal("test_signature");
                expect(arg.get('tags')).to.match(new RegExp("test_tag1"));
                expect(arg.get('tags')).to.match(new RegExp("test_tag2"));
                expect(arg.get('customCoordinates')).to.match(new RegExp("test_customCoordinates"));
                expect(arg.get('responseFields')).to.match(new RegExp("tags, customCoordinates, isPrivateFile, metadata"));
                expect(arg.get('useUniqueFileName')).to.be.equal('true');
                expect(arg.get('publicKey')).to.be.equal('test_public_key');
            });    
            
            it('calls functions with correct arguments for missing parameters', function() {
                const fileOptions = {
                    fileName: "test_file_name",
                    file: "test_file",
                };
                imagekit.upload(fileOptions, function(){});

                const arg = requestUtils.uploadFile.getCall(0).args[0];
                expect(arg.get('file')).to.be.equal("test_file");
                expect(arg.get('fileName')).to.be.equal("test_file_name");
                expect(arg.get('tags')).to.not.equal("undefined");
                expect(arg.get('customCoordinates')).to.be.equal(undefined);
                expect(arg.get('customCoordinates')).to.not.equal("undefined");
                expect(arg.get('responseFields')).to.be.equal(undefined);
                expect(arg.get('responseFields')).to.not.equal("undefined");
                expect(arg.get('useUniqueFileName')).to.be.equal(undefined);
                expect(arg.get('useUniqueFileName')).to.not.equal("undefined");
            });

            it('calls functions with base64 file argument', function() {

                const fileOptions = {
                    fileName: "test_file_name",
                    file: fs.readFileSync(test_file_path, 'base64'),
                };
                imagekit.upload(fileOptions, function(){});

                const arg = requestUtils.uploadFile.getCall(0).args[0];
                expect(arg.get('file')).to.match(/^[a-zA-Z0-9\+/]*={0,2}$/);
                expect(arg.get('fileName')).to.be.equal("test_file_name");
            });  

            it('calls functions with url file argument', function() {


                const fileOptions = {
                    fileName: "test_file_name",
                    file: "http://test.url",
                };
                imagekit.upload(fileOptions, function(){});

                const arg = requestUtils.uploadFile.getCall(0).args[0];
                expect(arg.get('file')).to.be.equal("http://test.url");
                expect(arg.get('fileName')).to.be.equal("test_file_name");
            });   
        });
    });
});

