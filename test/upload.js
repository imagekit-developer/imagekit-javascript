const chai = require("chai");
const sinon = require("sinon");
global.FormData = require('formdata-node');
const expect = chai.expect;
const initializationParams = require("./data").initializationParams
const ImageKit = require(".."); // This will automatically pick main module (cjs bundle) as per package.json
var requests, server;

const uploadSuccessResponseObj = {
    "fileId": "598821f949c0a938d57563bd",
    "name": "file1.jpg",
    "url": "https://ik.imagekit.io/your_imagekit_id/images/products/file1.jpg",
    "thumbnailUrl": "https://ik.imagekit.io/your_imagekit_id/tr:n-media_library_thumbnail/images/products/file1.jpg",
    "height": 300,
    "width": 200,
    "size": 83622,
    "filePath": "/images/products/file1.jpg",
    "tags": ["t-shirt", "round-neck", "sale2019"],
    "isPrivateFile": false,
    "customCoordinates": null,
    "fileType": "image"
};

function successSignature() {
    server.respondWith("GET", initializationParams.authenticationEndpoint,
        [
            200,
            { "Content-Type": "application/json" },
            JSON.stringify({
                signature: "test_signature",
                expire: 123,
                token: "test_token"
            })
        ]);
    server.respond();
}
function successUploadResponse() {
    server.respondWith("POST", "https://upload.imagekit.io/api/v1/files/upload",
        [
            200,
            { "Content-Type": "application/json" },
            JSON.stringify(uploadSuccessResponseObj)
        ]
    );
    server.respond();
}

function errorUploadResponse(statusCode, obj) {
    obj = obj || {
        "message": "Your account cannot be authenticated.",
        "help": "For support kindly contact us at support@imagekit.io ."
    };
    server.respondWith("POST", "https://upload.imagekit.io/api/v1/files/upload",
        [
            statusCode || 400,
            { "Content-Type": "application/json" },
            JSON.stringify(obj)
        ]
    );
    server.respond();
}

describe("File upload", function () {

    var imagekit = new ImageKit(initializationParams);

    beforeEach(() => {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        requests = [];
        global.XMLHttpRequest.onCreate = function (req) { requests.push(req); };
        server = sinon.createFakeServer();
    });

    afterEach(() => {
        // Like before we must clean up when tampering with globals.
        global.XMLHttpRequest.restore();
        server.restore();
    });

    it('Missing fileName', function () {
        const fileOptions = {
            file: "https://ik.imagekit.io/remote-url.jpg"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);
        expect(server.requests.length).to.be.equal(0);
        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, { help: "", message: "Missing fileName parameter for upload" }, null);
    });

    it('Missing file', function () {
        const fileOptions = {
            fileName: "test_file_name",
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);
        expect(server.requests.length).to.be.equal(0);
        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, { help: "", message: "Missing file parameter for upload" }, null);
    });

    it('Boolean handling', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file",
            tags: "test_tag1,test_tag2",
            customCoordinates: "10, 10, 100, 100",
            responseFields: "tags, customCoordinates, isPrivateFile, metadata",
            useUniqueFileName: false,
            isPrivateFile: true
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        successSignature();
        expect(server.requests.length).to.be.equal(2);
        successUploadResponse();

        var arg = server.requests[1].requestBody;
        expect(arg.get('file')).to.be.equal("test_file");
        expect(arg.get('fileName')).to.be.equal("test_file_name");
        expect(arg.get('token')).to.be.equal("test_token");
        expect(arg.get('expire')).to.be.equal("123");
        expect(arg.get('signature')).to.be.equal("test_signature");
        expect(arg.get('tags')).to.be.equal("test_tag1,test_tag2");
        expect(arg.get('customCoordinates')).to.be.equal("10, 10, 100, 100");
        expect(arg.get('responseFields')).to.be.equal("tags, customCoordinates, isPrivateFile, metadata");
        expect(arg.get('useUniqueFileName')).to.be.equal('false');
        expect(arg.get('isPrivateFile')).to.be.equal('true');
        expect(arg.get('publicKey')).to.be.equal('test_public_key');

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });

    it('Tag array handling', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file",
            tags: ["test_tag1", "test_tag2"],
            useUniqueFileName: false,
            isPrivateFile: true
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        successSignature();
        expect(server.requests.length).to.be.equal(2);
        successUploadResponse();

        var arg = server.requests[1].requestBody;
        expect(arg.get('file')).to.be.equal("test_file");
        expect(arg.get('fileName')).to.be.equal("test_file_name");
        expect(arg.get('token')).to.be.equal("test_token");
        expect(arg.get('expire')).to.be.equal("123");
        expect(arg.get('signature')).to.be.equal("test_signature");
        expect(arg.get('tags')).to.be.equal("test_tag1,test_tag2");
        expect(arg.get('useUniqueFileName')).to.be.equal('false');
        expect(arg.get('isPrivateFile')).to.be.equal('true');
        expect(arg.get('publicKey')).to.be.equal('test_public_key');

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });

    it('Missing useUniqueFileName', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file",
            tags: ["test_tag1", "test_tag2"],
            isPrivateFile: true
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        successSignature();
        expect(server.requests.length).to.be.equal(2);
        successUploadResponse();

        var arg = server.requests[1].requestBody;
        expect(arg.get('file')).to.be.equal("test_file");
        expect(arg.get('fileName')).to.be.equal("test_file_name");
        expect(arg.get('token')).to.be.equal("test_token");
        expect(arg.get('expire')).to.be.equal("123");
        expect(arg.get('signature')).to.be.equal("test_signature");
        expect(arg.get('tags')).to.be.equal("test_tag1,test_tag2");
        expect(arg.get('isPrivateFile')).to.be.equal('true');
        expect(arg.get('publicKey')).to.be.equal('test_public_key');
        expect(arg.get('useUniqueFileName')).to.be.equal(undefined);
        expect(arg.get('customCoordinates')).to.be.equal(undefined);
        expect(arg.get('responseFields')).to.be.equal(undefined);

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });

    it('Missing isPrivateFile', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file",
            tags: ["test_tag1", "test_tag2"]
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        successSignature();
        expect(server.requests.length).to.be.equal(2);
        successUploadResponse();

        var arg = server.requests[1].requestBody;
        expect(arg.get('file')).to.be.equal("test_file");
        expect(arg.get('fileName')).to.be.equal("test_file_name");
        expect(arg.get('token')).to.be.equal("test_token");
        expect(arg.get('expire')).to.be.equal("123");
        expect(arg.get('signature')).to.be.equal("test_signature");
        expect(arg.get('tags')).to.be.equal("test_tag1,test_tag2");
        expect(arg.get('publicKey')).to.be.equal('test_public_key');
        expect(arg.get('isPrivateFile')).to.be.equal(undefined);
        expect(arg.get('useUniqueFileName')).to.be.equal(undefined);
        expect(arg.get('customCoordinates')).to.be.equal(undefined);
        expect(arg.get('responseFields')).to.be.equal(undefined);

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });

    it('Bare minimum request', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        successSignature();
        expect(server.requests.length).to.be.equal(2);
        successUploadResponse();

        var arg = server.requests[1].requestBody;
        expect(arg.get('file')).to.be.equal("test_file");
        expect(arg.get('fileName')).to.be.equal("test_file_name");
        expect(arg.get('token')).to.be.equal("test_token");
        expect(arg.get('expire')).to.be.equal("123");
        expect(arg.get('signature')).to.be.equal("test_signature");
        expect(arg.get('publicKey')).to.be.equal('test_public_key');
        expect(arg.get('tags')).to.be.equal(undefined);
        expect(arg.get('isPrivateFile')).to.be.equal(undefined);
        expect(arg.get('useUniqueFileName')).to.be.equal(undefined);
        expect(arg.get('customCoordinates')).to.be.equal(undefined);
        expect(arg.get('responseFields')).to.be.equal(undefined);

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });

    it('Error during upload', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        successSignature();
        expect(server.requests.length).to.be.equal(2);
        var errRes = {
            help: "For support kindly contact us at support@imagekit.io .",
            message: "Your account cannot be authenticated."
        }
        errorUploadResponse(500, errRes);
        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, errRes, null);
    });

    it('Upload via URL', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "https://ik.imagekit.io/remote-url.jpg"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        successSignature();
        expect(server.requests.length).to.be.equal(2);
        successUploadResponse();

        var arg = server.requests[1].requestBody;
        expect(arg.get('file')).to.be.equal("https://ik.imagekit.io/remote-url.jpg");
        expect(arg.get('fileName')).to.be.equal("test_file_name");
        expect(arg.get('token')).to.be.equal("test_token");
        expect(arg.get('expire')).to.be.equal("123");
        expect(arg.get('signature')).to.be.equal("test_signature");
        expect(arg.get('publicKey')).to.be.equal('test_public_key');
        expect(arg.get('tags')).to.be.equal(undefined);
        expect(arg.get('isPrivateFile')).to.be.equal(undefined);
        expect(arg.get('useUniqueFileName')).to.be.equal(undefined);
        expect(arg.get('customCoordinates')).to.be.equal(undefined);
        expect(arg.get('responseFields')).to.be.equal(undefined);

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });
});


