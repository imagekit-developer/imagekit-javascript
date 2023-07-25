const chai = require("chai");
const sinon = require("sinon");
global.FormData = require("formdata-node");
global.Blob = require("web-file-polyfill").Blob
global.File = require("web-file-polyfill").File
const expect = chai.expect;
const initializationParams = require("./data").initializationParams
import ImageKit from "../src/index";
var requests, server;
import 'regenerator-runtime/runtime'

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
    "AITags": [{ "name": "Face", "confidence": 99.95, "source": "aws-auto-tagging" }],
    "extensionStatus": { "aws-auto-tagging": "success" }
};

const securityParameters = {
    signature: "test_signature",
    expire: 123,
    token: "test_token"
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

async function sleep(ms = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
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

    it('Invalid options', function () {
        var callback = sinon.spy();

        imagekit.upload(undefined, callback);
        expect(server.requests.length).to.be.equal(0);
        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, { help: "", message: "Invalid uploadOptions parameter" }, null);
    });

    it('Missing fileName', function () {
        const fileOptions = {
            ...securityParameters,
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
            ...securityParameters,
            fileName: "test_file_name",
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);
        expect(server.requests.length).to.be.equal(1);
        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, { help: "", message: "Missing file parameter for upload" }, null);
    });
    
    it('Missing token', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file",
            signature: 'test_signature',
            expire: 123
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);
        expect(server.requests.length).to.be.equal(1);
        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, { message: "Missing token for upload. The SDK expects token, sginature and expire for authentication.", help: "" }, null);
    });

    it('Missing signature', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file",
            token: 'test_token',
            expire: 123
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);
        expect(server.requests.length).to.be.equal(1);
        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, { message: "Missing signature for upload. The SDK expects token, sginature and expire for authentication.", help: "" }, null);
    });

    it('Missing expire', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file",
            token: 'test_token',
            signature: 'test_signature'
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);
        expect(server.requests.length).to.be.equal(1);
        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, { message: "Missing expire for upload. The SDK expects token, sginature and expire for authentication.", help: "" }, null);
    });

    it('Missing public key', function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback, {
            publicKey: ""
        });

        expect(server.requests.length).to.be.equal(1);
        sinon.assert.calledWith(callback, { message: "Missing public key for upload", help: "" }, null);
    });

    it('Upload endpoint network error handling', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        await sleep();

        // Simulate network error on upload API
        server.requests[0].error();
        await sleep();
        sinon.assert.calledWith(callback, { message: "Request to ImageKit upload endpoint failed due to network error", help: "" }, null);
    });

    it('Boolean handling', async function () {
        const fileOptions = {
            ...securityParameters,
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
        await sleep();
        successUploadResponse();
        await sleep();

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

    it('Tag array handling', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            tags: ["test_tag1", "test_tag2"],
            useUniqueFileName: false,
            isPrivateFile: true
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

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

    it('Missing useUniqueFileName', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            tags: ["test_tag1", "test_tag2"],
            isPrivateFile: true
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

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

    it('Missing isPrivateFile', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            tags: ["test_tag1", "test_tag2"]
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

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

    it('With extensions parameter', async function () {
        const fileOptions = {
            ...securityParameters,
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
        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

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
        expect(arg.get('extensions')).to.be.equal(JSON.stringify(fileOptions.extensions));
        expect(arg.get('webhookUrl')).to.be.equal('https://your-domain/?appId=some-id')

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });

    it('Bare minimum request', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            tags: undefined
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

        var arg = server.requests[0].requestBody;
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

    it('Bare minimum request: Blob', async function () {
        const buffer = Buffer.from("test_buffer")
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: buffer
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

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

    it('Error during upload', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        await sleep();
        var errRes = {
            help: "For support kindly contact us at support@imagekit.io .",
            message: "Your account cannot be authenticated."
        }
        errorUploadResponse(500, errRes);
        await sleep();
        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, errRes, null);
    });

    it('Error during upload non 2xx with bad body', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        await sleep();
        server.respondWith("POST", "https://upload.imagekit.io/api/v1/files/upload",
            [
                500,
                { "Content-Type": "application/json" },
                "sdf"
            ]
        );
        server.respond();
        await sleep();
        expect(callback.calledOnce).to.be.true;
        var error = callback.args[0][0];
        expect(error instanceof SyntaxError).to.be.true;
    });

    it('Error during upload 2xx with bad body', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        await sleep();
        server.respondWith("POST", "https://upload.imagekit.io/api/v1/files/upload",
            [
                200,
                { "Content-Type": "application/json" },
                "sdf"
            ]
        );
        server.respond();
        await sleep();
        expect(callback.calledOnce).to.be.true;
        var error = callback.args[0][0];
        expect(error instanceof SyntaxError).to.be.true;
    });

    it('Upload via URL', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "https://ik.imagekit.io/remote-url.jpg"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

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

    it('Overriding public key', async function () {
        var newPublicKey = "override_public_key";

        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "https://ik.imagekit.io/remote-url.jpg"
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback, {
            publicKey: newPublicKey
        });

        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

        var arg = server.requests[0].requestBody;
        expect(arg.get('file')).to.be.equal("https://ik.imagekit.io/remote-url.jpg");
        expect(arg.get('fileName')).to.be.equal("test_file_name");
        expect(arg.get('token')).to.be.equal("test_token");
        expect(arg.get('expire')).to.be.equal("123");
        expect(arg.get('signature')).to.be.equal("test_signature");
        expect(arg.get('publicKey')).to.be.equal('override_public_key');
        expect(arg.get('tags')).to.be.equal(undefined);
        expect(arg.get('isPrivateFile')).to.be.equal(undefined);
        expect(arg.get('useUniqueFileName')).to.be.equal(undefined);
        expect(arg.get('customCoordinates')).to.be.equal(undefined);
        expect(arg.get('responseFields')).to.be.equal(undefined);
        expect(arg.get('extensions')).to.be.equal(undefined);
        expect(arg.get('customMetadata')).to.be.equal(undefined);

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });

    it('With overwrite parameters', async function () {
        const fileOptions = {
            ...securityParameters,
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
        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

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
        expect(arg.get('extensions')).to.be.equal(JSON.stringify(fileOptions.extensions));
        expect(arg.get('overwriteFile')).to.be.equal('false');
        expect(arg.get('overwriteAITags')).to.be.equal('false');
        expect(arg.get('overwriteTags')).to.be.equal('false');
        expect(arg.get('overwriteCustomMetadata')).to.be.equal('false');

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });

    it('With customMetadata', async function () {
        const fileOptions = {
            ...securityParameters,
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
            overwriteCustomMetadata: false,
            customMetadata: {
                brand: "Nike",
                color: "red"
            },
        };
        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

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
        expect(arg.get('extensions')).to.be.equal(JSON.stringify(fileOptions.extensions));
        expect(arg.get('overwriteFile')).to.be.equal('false');
        expect(arg.get('overwriteAITags')).to.be.equal('false');
        expect(arg.get('overwriteTags')).to.be.equal('false');
        expect(arg.get('overwriteCustomMetadata')).to.be.equal('false');
        expect(arg.get('customMetadata')).to.be.equal(JSON.stringify(fileOptions.customMetadata));

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });

    it('Array type fields', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            tags: ["test_tag1", "test_tag2"],
            customCoordinates: "10, 10, 100, 100",
            responseFields: ["tags", "customCoordinates", "isPrivateFile", "metadata"],
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
            overwriteCustomMetadata: false,
            customMetadata: {
                brand: "Nike",
                color: "red"
            },
        };
        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

        var arg = server.requests[0].requestBody;

        expect(arg.get('file')).to.be.equal("test_file");
        expect(arg.get('fileName')).to.be.equal("test_file_name");
        expect(arg.get('token')).to.be.equal("test_token");
        expect(arg.get('expire')).to.be.equal("123");
        expect(arg.get('signature')).to.be.equal("test_signature");
        expect(arg.get('tags')).to.be.equal("test_tag1,test_tag2");
        expect(arg.get('customCoordinates')).to.be.equal("10, 10, 100, 100");
        expect(arg.get('responseFields')).to.be.equal("tags,customCoordinates,isPrivateFile,metadata");
        expect(arg.get('useUniqueFileName')).to.be.equal('false');
        expect(arg.get('isPrivateFile')).to.be.equal('true');
        expect(arg.get('publicKey')).to.be.equal('test_public_key');
        expect(arg.get('extensions')).to.be.equal(JSON.stringify(fileOptions.extensions));
        expect(arg.get('overwriteFile')).to.be.equal('false');
        expect(arg.get('overwriteAITags')).to.be.equal('false');
        expect(arg.get('overwriteTags')).to.be.equal('false');
        expect(arg.get('overwriteCustomMetadata')).to.be.equal('false');
        expect(arg.get('customMetadata')).to.be.equal(JSON.stringify(fileOptions.customMetadata));

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });

    it('check custom XHR object is used', async function () {
        var xhr = new XMLHttpRequest();
        var fun = function () { return "hello from function" };
        xhr.onprogress = fun;
        const fileOptions = {
            ...securityParameters,
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
            xhr
        };
        var callback = sinon.spy();
        imagekit.upload(fileOptions, callback);
        expect(server.requests.length).to.be.equal(1);
        expect(server.requests[0]).to.be.equal(xhr);
        expect(server.requests[0].onprogress.toString()).to.be.equal(fun.toString());
        await sleep();
        successUploadResponse();
        await sleep();

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
        expect(arg.get('extensions')).to.be.equal(JSON.stringify(fileOptions.extensions));

        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });

    it('Upload using promise - success', async function () {
        const fileOptions = {
            ...securityParameters,
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
            ]
        };

        var uploadPromise = imagekit.upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);

        await sleep();
        successUploadResponse();
        await sleep();

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
        expect(arg.get('extensions')).to.be.equal(JSON.stringify(fileOptions.extensions));
        var response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it('Upload using promise - error', async function () {
        var errRes = {
            help: "For support kindly contact us at support@imagekit.io .",
            message: "Your account cannot be authenticated."
        }
        const fileOptions = {
            ...securityParameters,
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
            ]
        };

        try {
            var uploadPromise = imagekit.upload(fileOptions);
            await sleep();
            errorUploadResponse(500, errRes);
            await sleep();
            var response = await uploadPromise;
        } catch (ex) {
            expect(ex).to.be.deep.equal(errRes);
        }
    });

    it('Custom xhr promise', async function () {
        var xhr = new XMLHttpRequest();
        var fun = function () { return "hello from function" };
        xhr.onprogress = fun;
        const fileOptions = {
            ...securityParameters,
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
            xhr
        };
        var uploadPromise = imagekit.upload(fileOptions);

        expect(server.requests.length).to.be.equal(1);


        await sleep();
        successUploadResponse();
        await sleep();

        var arg = server.requests[0].requestBody;
        expect(arg.get('file')).to.be.equal("test_file");
        expect(server.requests[0]).to.be.equal(xhr);
        expect(server.requests[0].onprogress.toString()).to.be.equal(fun.toString());

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
        expect(arg.get('extensions')).to.be.equal(JSON.stringify(fileOptions.extensions));

        var response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it('$ResponseMetadata assertions using promise', async function () {
        var dummyResonseHeaders = {
            "Content-Type": "application/json",
            "x-request-id": "sdfsdfsdfdsf"
        };
        const fileOptions = {
            ...securityParameters,
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
            ]
        };

        var uploadPromise = imagekit.upload(fileOptions)
        expect(server.requests.length).to.be.equal(1);

        await sleep();

        server.respondWith("POST", "https://upload.imagekit.io/api/v1/files/upload",
            [
                200,
                dummyResonseHeaders,
                JSON.stringify(uploadSuccessResponseObj)
            ]
        );
        server.respond();
        await sleep();

        var response = await uploadPromise;
        expect(response.$ResponseMetadata.headers).to.be.deep.equal(dummyResonseHeaders);
        expect(response.$ResponseMetadata.statusCode).to.be.deep.equal(200);
    });

    it('$ResponseMetadata assertions using callback', async function () {
        var dummyResonseHeaders = {
            "Content-Type": "application/json",
            "x-request-id": "sdfsdfsdfdsf"
        };
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file"
        };
        var callback = sinon.spy();
        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);

        await sleep();
        server.respondWith("POST", "https://upload.imagekit.io/api/v1/files/upload",
            [
                200,
                dummyResonseHeaders,
                JSON.stringify(uploadSuccessResponseObj)
            ]
        );
        server.respond();
        await sleep();

        expect(callback.calledOnce).to.be.true;

        var callBackArguments = callback.args[0];
        expect(callBackArguments.length).to.be.eq(2);
        var callbackResult = callBackArguments[1];

        expect(callbackResult).to.be.deep.equal(uploadSuccessResponseObj);
        expect(callbackResult.$ResponseMetadata.headers).to.be.deep.equal(dummyResonseHeaders);
        expect(callbackResult.$ResponseMetadata.statusCode).to.be.deep.equal(200);
    });

    it('Undefined fields should not be sent', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            tags: undefined,
            folder: undefined,
            isPrivateFile: undefined,
            customCoordinates: undefined,
            responseFields: undefined,
            extensions: undefined,
            webhookUrl: undefined,
            overwriteFile: undefined,
            overwriteAITags: undefined,
            overwriteTags: undefined,
            overwriteCustomMetadata: undefined,
            customMetadata: undefined
        };

        var callback = sinon.spy();

        imagekit.upload(fileOptions, callback);

        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

        var arg = server.requests[0].requestBody;
        expect(arg.get('file')).to.be.equal("test_file");
        expect(arg.get('fileName')).to.be.equal("test_file_name");
        expect(arg.get('extensions')).to.be.equal(undefined);
        expect(arg.get('tags')).to.be.equal(undefined);
        expect(arg.get('folder')).to.be.equal(undefined);
        expect(arg.get('isPrivateFile')).to.be.equal(undefined);
        expect(arg.get('customCoordinates')).to.be.equal(undefined);
        expect(arg.get('responseFields')).to.be.equal(undefined);
        expect(arg.get('extensions')).to.be.equal(undefined);
        expect(arg.get('webhookUrl')).to.be.equal(undefined);
        expect(arg.get('overwriteFile')).to.be.equal(undefined);
        expect(arg.get('overwriteAITags')).to.be.equal(undefined);
        expect(arg.get('overwriteTags')).to.be.equal(undefined);
        expect(arg.get('overwriteCustomMetadata')).to.be.equal(undefined);
        expect(arg.get('customMetadata')).to.be.equal(undefined);
        expect(callback.calledOnce).to.be.true;
        sinon.assert.calledWith(callback, null, uploadSuccessResponseObj);
    });
});
