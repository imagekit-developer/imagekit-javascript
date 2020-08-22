const chai = require("chai");
const sinon = require("sinon");
// const requestUtils = require('../src/utils/request.js');
const fs = require('fs');
const path = require('path');
const pkg = require("../package.json");
const nock = require('nock');
global.FormData = require('formdata-node');
const expect = chai.expect;
const test_file_path = path.resolve(__dirname, "data/test_image.png");
const initializationParams = require("./data").initializationParams
const ImageKit = require(".."); // This will automatically pick main module (cjs bundle) as per package.json

describe("File upload", function () {

    var imagekit = new ImageKit(initializationParams);
    

    // let orderCop;

    // before(function () {
    //     orderCop = sinon.spy();
    //     sinon.stub(requestUtils, 'generateSignatureToken').callsFake(function (options, callback) {
    //         orderCop('signatureCall');
    //         callback(null, {
    //             signature: "test_signature",
    //             expire: 123,
    //             token: "test_token"
    //         });
    //     });
    //     sinon.stub(requestUtils, 'uploadFile').callsFake(function (options, callback) {
    //         orderCop('uploadCall');
    //         callback(null, "success");
    //     });

    // });

    // beforeEach(function () {
    //     orderCop.resetHistory();
    //     requestUtils.generateSignatureToken.resetHistory();
    //     requestUtils.uploadFile.resetHistory();
    // });

    // it('calls relavant functions in order', function () {
    //     const fileOptions = {
    //         fileName: "test_file_name",
    //         file: "test_file",
    //     };
    //     imagekit.upload(fileOptions, function () { });

    //     expect(requestUtils.generateSignatureToken.calledOnce).to.be.true;
    //     expect(requestUtils.uploadFile.calledOnce).to.be.true;
    //     expect(orderCop.firstCall.args[0]).to.be.equal('signatureCall');
    //     expect(orderCop.secondCall.args[0]).to.be.equal('uploadCall');
    // });

    // it('calls functions with correct arguments', function () {

    //     const fileOptions = {
    //         fileName: "test_file_name",
    //         file: "test_file",
    //         tags: ["test_tag1", "test_tag2"],
    //         customCoordinates: "test_customCoordinates",
    //         responseFields: "tags, customCoordinates, isPrivateFile, metadata",
    //         useUniqueFileName: true
    //     };
    //     imagekit.upload(fileOptions, function () { });

    //     const arg = requestUtils.uploadFile.getCall(0).args[0];
    //     expect(arg.get('file')).to.be.equal("test_file");
    //     expect(arg.get('fileName')).to.be.equal("test_file_name");
    //     expect(arg.get('token')).to.be.equal("test_token");
    //     expect(arg.get('expire')).to.be.equal("123");
    //     expect(arg.get('signature')).to.be.equal("test_signature");
    //     expect(arg.get('tags')).to.match(new RegExp("test_tag1"));
    //     expect(arg.get('tags')).to.match(new RegExp("test_tag2"));
    //     expect(arg.get('customCoordinates')).to.match(new RegExp("test_customCoordinates"));
    //     expect(arg.get('responseFields')).to.match(new RegExp("tags, customCoordinates, isPrivateFile, metadata"));
    //     expect(arg.get('useUniqueFileName')).to.be.equal('true');
    //     expect(arg.get('publicKey')).to.be.equal('test_public_key');
    // });

    // it('calls functions with correct arguments for missing parameters', function () {
    //     const fileOptions = {
    //         fileName: "test_file_name",
    //         file: "test_file",
    //     };
    //     imagekit.upload(fileOptions, function () { });

    //     const arg = requestUtils.uploadFile.getCall(0).args[0];
    //     expect(arg.get('file')).to.be.equal("test_file");
    //     expect(arg.get('fileName')).to.be.equal("test_file_name");
    //     expect(arg.get('tags')).to.not.equal("undefined");
    //     expect(arg.get('customCoordinates')).to.be.equal(undefined);
    //     expect(arg.get('customCoordinates')).to.not.equal("undefined");
    //     expect(arg.get('responseFields')).to.be.equal(undefined);
    //     expect(arg.get('responseFields')).to.not.equal("undefined");
    //     expect(arg.get('useUniqueFileName')).to.be.equal(undefined);
    //     expect(arg.get('useUniqueFileName')).to.not.equal("undefined");
    // });

    // it('calls functions with base64 file argument', function () {

    //     const fileOptions = {
    //         fileName: "test_file_name",
    //         file: fs.readFileSync(test_file_path, 'base64'),
    //     };
    //     imagekit.upload(fileOptions, function () { });

    //     const arg = requestUtils.uploadFile.getCall(0).args[0];
    //     expect(arg.get('file')).to.match(/^[a-zA-Z0-9\+/]*={0,2}$/);
    //     expect(arg.get('fileName')).to.be.equal("test_file_name");
    // });

    // it('calls functions with url file argument', function () {


    //     const fileOptions = {
    //         fileName: "test_file_name",
    //         file: "http://test.url",
    //     };
    //     imagekit.upload(fileOptions, function () { });

    //     const arg = requestUtils.uploadFile.getCall(0).args[0];
    //     expect(arg.get('file')).to.be.equal("http://test.url");
    //     expect(arg.get('fileName')).to.be.equal("test_file_name");
    // });
});


