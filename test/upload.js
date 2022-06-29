const chai = require("chai");
const sinon = require("sinon");
global.FormData = require("formdata-node");
global.Blob = require("web-file-polyfill").Blob
global.File = require("web-file-polyfill").File
const expect = chai.expect;
const initializationParams = require("./data").initializationParams
import ImageKit from "../src/index";
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
    "fileType": "image",
    "AITags":[{"name":"Face","confidence":99.95,"source":"aws-auto-tagging"}],
    "extensionStatus":{"aws-auto-tagging":"success"}
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

function nonSuccessErrorSignature() {
    server.respondWith("GET", initializationParams.authenticationEndpoint,
        [
            403,
            { "Content-Type": "application/json" },
            JSON.stringify({
                error: "Not allowed"
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

    it('Invalid Options', function () {

        var callback = sinon.spy();

        imagekit.upload(undefined, callback);
        expect(server.requests.length).to.be.equal(1);
        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, { help: "", message: "Invalid uploadOptions parameter" }, null);
    });

    it('Missing fileName', function () {
        const fileOptions = {
            file: "https://ik.imagekit.io/remote-url.jpg"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);
        expect(server.requests.length).to.be.equal(1);
        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, { help: "", message: "Missing fileName parameter for upload" }, null);
    });

    it('Missing file', function () {
        const fileOptions = {
            fileName: "test_file_name",
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);
        expect(server.requests.length).to.be.equal(1);
        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, { help: "", message: "Missing file parameter for upload" }, null);
    });

    it('Missing authEndpoint', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback, {
            authenticationEndpoint : ""
        });

        expect(server.requests.length).to.be.equal(1);
        sinon.assert.calledWith(callback, { message: "Missing authentication endpoint for upload", help: "" }, null);
    });

    it('Missing public key', function(){
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback, {
            publicKey : ""
        });

        expect(server.requests.length).to.be.equal(1);
        sinon.assert.calledWith(callback, { message: "Missing public key for upload", help: "" }, null);
    });

    it('Auth endpoint network error handling', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback, {
            authenticationEndpoint : "https://does-not-exist-sdfsdf/aut"
        });

        expect(server.requests.length).to.be.equal(2);

        // Simulate network error on authentication endpoint
        server.requests[1].error();
        sinon.assert.calledWith(callback, { message: "Request to authenticationEndpoint failed due to network error", help: "" }, null);
    });

    it('Auth endpoint non 200 status code handling', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(2);

        // Simulate non 200 response on authentication endpoint
        nonSuccessErrorSignature();
        sinon.assert.calledWith(callback, { error: "Not allowed" }, null);
    });

    it('Upload endpoint network error handling', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(2);
        successSignature();

        // Simulate network error on upload API
        server.requests[0].error();
        sinon.assert.calledWith(callback, { message: "Request to ImageKit upload endpoint failed due to network error", help: "" }, null);
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

        expect(server.requests.length).to.be.equal(2);
        successSignature();
        successUploadResponse();

        var arg = server.requests[0].requestBody;
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

        expect(server.requests.length).to.be.equal(2);
        successSignature();
        successUploadResponse();

        var arg = server.requests[0].requestBody;
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

        expect(server.requests.length).to.be.equal(2);
        successSignature();
        successUploadResponse();

        var arg = server.requests[0].requestBody;
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

        expect(server.requests.length).to.be.equal(2);
        successSignature();
        successUploadResponse();

        var arg = server.requests[0].requestBody;
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

    it('With extensions parameter', function(){
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file",
            tags: "test_tag1,test_tag2",
            customCoordinates: "10, 10, 100, 100",
            responseFields: "tags, customCoordinates, isPrivateFile, metadata",
            useUniqueFileName: false,
            isPrivateFile: true,
            extensions: [
                {
                    name: "aws-auto-tagging",
                    minConfidence: 80,
                    maxTags: 10
                }
            ],
            webhookUrl: "https://your-domain/?appId=some-id"
        };
        var jsonStringifiedExtensions = JSON.stringify(fileOptions.extensions);
        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(2);
        successSignature();
        successUploadResponse();

        var arg = server.requests[0].requestBody;

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
        expect(arg.get('extensions')).to.be.equal(jsonStringifiedExtensions);
        expect(arg.get('webhookUrl')).to.be.equal('https://your-domain/?appId=some-id')

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });

    it('Bare minimum request', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file",
            tags: undefined
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(2);
        successSignature();
        successUploadResponse();

        var arg = server.requests[0].requestBody;
        expect(arg.get('file')).to.be.equal("test_file");
        expect(arg.get('fileName')).to.be.equal("test_file_name");
        expect(arg.get('token')).to.be.equal("test_token");
        expect(arg.get('expire')).to.be.equal("123");
        expect(arg.get('signature')).to.be.equal("test_signature");
        expect(arg.get('publicKey')).to.be.equal('test_public_key');
        expect(arg.get('tags')).to.be.equal('undefined');
        expect(arg.get('isPrivateFile')).to.be.equal(undefined);
        expect(arg.get('useUniqueFileName')).to.be.equal(undefined);
        expect(arg.get('customCoordinates')).to.be.equal(undefined);
        expect(arg.get('responseFields')).to.be.equal(undefined);

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });

    it('Bare minimum request: Blob', function () {
        const buffer = Buffer.from("test_buffer")
        const fileOptions = {
            fileName: "test_file_name",
            file: buffer
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(2);
        successSignature();
        successUploadResponse();

        var arg = server.requests[0].requestBody;

        expect(arg.get('file').size).to.be.eq(buffer.length);
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

        expect(server.requests.length).to.be.equal(2);
        successSignature();
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

        expect(server.requests.length).to.be.equal(2);
        successSignature();
        successUploadResponse();

        var arg = server.requests[0].requestBody;
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

    it('Overriding public key and authentication endpoint', function () {
        var newAuthEndpoint = "http://test/auth-override";
        var newPublicKey = "override_public_key";

        const fileOptions = {
            fileName: "test_file_name",
            file: "https://ik.imagekit.io/remote-url.jpg"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback, {
            authenticationEndpoint: newAuthEndpoint,
            publicKey: newPublicKey
        });

        expect(server.requests.length).to.be.equal(2);
        server.respondWith("GET", newAuthEndpoint,
        [
            200,
            { "Content-Type": "application/json" },
            JSON.stringify({
                signature: "override_test_signature",
                expire: 123123,
                token: "override_test_token"
            })
        ]);
        server.respond();
        successUploadResponse();

        var arg = server.requests[0].requestBody;
        expect(arg.get('file')).to.be.equal("https://ik.imagekit.io/remote-url.jpg");
        expect(arg.get('fileName')).to.be.equal("test_file_name");
        expect(arg.get('token')).to.be.equal("override_test_token");
        expect(arg.get('expire')).to.be.equal("123123");
        expect(arg.get('signature')).to.be.equal("override_test_signature");
        expect(arg.get('publicKey')).to.be.equal('override_public_key');
        expect(arg.get('tags')).to.be.equal(undefined);
        expect(arg.get('isPrivateFile')).to.be.equal(undefined);
        expect(arg.get('useUniqueFileName')).to.be.equal(undefined);
        expect(arg.get('customCoordinates')).to.be.equal(undefined);
        expect(arg.get('responseFields')).to.be.equal(undefined);

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });

    it('With overwrite parameters', function(){
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file",
            tags: "test_tag1,test_tag2",
            customCoordinates: "10, 10, 100, 100",
            responseFields: "tags, customCoordinates, isPrivateFile, metadata",
            useUniqueFileName: false,
            isPrivateFile: true,
            extensions: [
                {
                    name: "aws-auto-tagging",
                    minConfidence: 80,
                    maxTags: 10
                }
            ],
            overwriteFile: false,
            overwriteAITags: false,
            overwriteTags: false,
            overwriteCustomMetadata: false
        };
        var jsonStringifiedExtensions = JSON.stringify(fileOptions.extensions);
        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(2);
        successSignature();
        successUploadResponse();

        var arg = server.requests[0].requestBody;

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
        expect(arg.get('extensions')).to.be.equal(jsonStringifiedExtensions);
        expect(arg.get('overwriteFile')).to.be.equal('false');
        expect(arg.get('overwriteAITags')).to.be.equal('false');
        expect(arg.get('overwriteTags')).to.be.equal('false');
        expect(arg.get('overwriteCustomMetadata')).to.be.equal('false');

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });
});


