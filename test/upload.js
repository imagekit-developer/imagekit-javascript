const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
import 'regenerator-runtime/runtime';
import { upload } from "../src/index";
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError
} from '../src/upload';

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
    "AITags": [{ "name": "Face", "confidence": 99.95, "source": "aws-auto-tagging" }],
    "extensionStatus": { "aws-auto-tagging": "success" }
};

const securityParameters = {
    signature: "test_signature",
    expire: 123,
    token: "test_token",
    publicKey: "test_public_key",
};

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
    return true;
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

describe("File upload", async function () {
    beforeEach(() => {
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        requests = [];
        global.XMLHttpRequest.onCreate = function (req) { requests.push(req); };
        server = sinon.createFakeServer();
    });

    afterEach(() => {
        global.XMLHttpRequest.restore();
        server.restore();
    });

    it('Invalid options', async function () {
        try {
            await upload();
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitInvalidRequestError).to.be.true;
            expect(ex.message).to.be.equal("Invalid options provided for upload");
        }
    });

    it('Missing fileName', async function () {
        const fileOptions = {
            ...securityParameters,
            file: "https://ik.imagekit.io/remote-url.jpg"
        };

        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitInvalidRequestError).to.be.true;
            expect(ex.message).to.be.equal("Missing fileName parameter for upload");
        }
    });

    it('Missing file', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
        };

        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitInvalidRequestError).to.be.true;
            expect(ex.message).to.be.equal("Missing file parameter for upload");
        }
    });

    it('Missing token', async function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file",
            signature: 'test_signature',
            expire: 123,
            // Omit token
            publicKey: 'test_public_key'
        };

        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitInvalidRequestError).to.be.true;
            expect(ex.message).to.be.equal("Missing token for upload. The SDK expects token, signature and expire for authentication.");
        }
    });

    it('Missing signature', async function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file",
            token: 'test_token',
            expire: 123,
            publicKey: 'test_public_key'
            // Omit signature
        };

        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitInvalidRequestError).to.be.true;
            expect(ex.message).to.be.equal("Missing signature for upload. The SDK expects token, signature and expire for authentication.");
        }
    });

    it('Missing expire', async function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file",
            token: 'test_token',
            signature: 'test_signature',
            publicKey: 'test_public_key'
            // Omit expire
        };

        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitInvalidRequestError).to.be.true;
            expect(ex.message).to.be.equal("Missing expire for upload. The SDK expects token, signature and expire for authentication.");
        }
    });

    it('Missing public key', async function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file",
            token: 'test_token',
            signature: 'test_signature',
            expire: 123
            // Omit publicKey
        };

        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitInvalidRequestError).to.be.true;
            expect(ex.message).to.be.equal("Missing public key for upload");
        }
    });

    it('Upload endpoint network error handling', async function () {
        const fileOptions = {
            fileName: "test_file_name",
            file: "test_file",
            token: 'test_token',
            signature: 'test_signature',
            expire: 123,
            publicKey: 'test_public_key'
        };

        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        await sleep();
        // Simulate network error on upload API
        server.requests[0].error();
        await sleep();
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitUploadNetworkError).to.be.true;
            expect(ex.message).to.be.equal("Request to ImageKit upload endpoint failed due to network error");
        }
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

        const uploadPromise = upload(fileOptions);
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

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
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

        const uploadPromise = upload(fileOptions);
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

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it('Missing useUniqueFileName', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            tags: ["test_tag1", "test_tag2"],
            isPrivateFile: true
        };

        const uploadPromise = upload(fileOptions);
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

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it('Missing isPrivateFile', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            tags: ["test_tag1", "test_tag2"]
        };

        const uploadPromise = upload(fileOptions);
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

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
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
        const uploadPromise = upload(fileOptions);
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
        expect(arg.get('webhookUrl')).to.be.equal('https://your-domain/?appId=some-id');

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it('Bare minimum request', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            tags: undefined
        };

        const uploadPromise = upload(fileOptions);
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

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it('Bare minimum request: Blob', async function () {
        const buffer = Buffer.from("test_buffer");
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: buffer
        };

        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

        var arg = server.requests[0].requestBody;
        // It's a blob now, check size
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

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it('Error during upload', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file"
        };

        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        await sleep();
        var errRes = {
            help: "For support kindly contact us at support@imagekit.io .",
            message: "Your account cannot be authenticated."
        };
        errorUploadResponse(401, errRes);
        await sleep();
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitInvalidRequestError).to.be.true;
            expect(ex.message).to.be.equal("Your account cannot be authenticated.");
        }
    });

    it('Error during upload non 2xx with bad body', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file"
        };

        const uploadPromise = upload(fileOptions);
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
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            // The response body is invalid JSON => SyntaxError
            expect(ex instanceof ImageKitServerError).to.be.true;
            expect(ex.message).to.be.equal("Server error occurred while uploading the file. This is rare and usually temporary.");
        }
    });

    it('Error during upload 2xx with bad body', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file"
        };

        const uploadPromise = upload(fileOptions);
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
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof SyntaxError).to.be.true;
        }
    });

    it('Upload via URL', async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "https://ik.imagekit.io/remote-url.jpg"
        };

        const uploadPromise = upload(fileOptions);
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

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it('Overriding public key', async function () {
        var newPublicKey = "override_public_key";

        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "https://ik.imagekit.io/remote-url.jpg"
        };

        const uploadPromise = upload({
            ...fileOptions,
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

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
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
                { name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }
            ],
            overwriteFile: false,
            overwriteAITags: false,
            overwriteTags: false,
            overwriteCustomMetadata: false
        };
        const uploadPromise = upload(fileOptions);
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

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
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
                { name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }
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
        const uploadPromise = upload(fileOptions);
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

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
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
                { name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }
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
        const uploadPromise = upload(fileOptions);
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

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
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
                { name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }
            ],
            xhr
        };
        const uploadPromise = upload(fileOptions);
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

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
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
                { name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }
            ]
        };

        const uploadPromise = upload(fileOptions);
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
        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it('Server 5xx error with proper json and message', async function () {
        var errRes = {
            help: "For support kindly contact us at support@imagekit.io .",
            message: "Something went wrong"
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
                { name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }
            ]
        };

        try {
            const uploadPromise = upload(fileOptions);
            await sleep();
            errorUploadResponse(500, errRes);
            await sleep();
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitServerError).to.be.true;
            expect(ex.message).to.be.equal("Something went wrong");
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
                { name: "aws-auto-tagging", minConfidence: 80, maxTags: 10 }
            ],
            xhr
        };
        const uploadPromise = upload(fileOptions);

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

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it('$ResponseMetadata assertions using promise', async function () {
        var dummyResponseHeaders = {
            "content-type": "application/json",
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

        var uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);

        await sleep();

        server.respondWith("POST", "https://upload.imagekit.io/api/v1/files/upload",
            [
                200,
                dummyResponseHeaders,
                JSON.stringify(uploadSuccessResponseObj)
            ]
        );
        server.respond();
        await sleep();

        const response = await uploadPromise;
        // Make sure your upload.ts preserves the case of "Content-Type"
        expect(response.$ResponseMetadata.headers).to.deep.equal(dummyResponseHeaders);
        expect(response.$ResponseMetadata.statusCode).to.equal(200);
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

        const uploadPromise = upload(fileOptions);
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

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it("With pre and post transformation", async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            responseFields: "tags, customCoordinates, isPrivateFile, metadata",
            useUniqueFileName: false,
            transformation: { pre: "w-100", post: [{ type: "transformation", value: "w-100" }] },
        };
        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

        var arg = server.requests[0].requestBody;

        expect(arg.get("file")).to.be.equal("test_file");
        expect(arg.get("fileName")).to.be.equal("test_file_name");
        expect(arg.get("responseFields")).to.be.equal("tags, customCoordinates, isPrivateFile, metadata");
        expect(arg.get("useUniqueFileName")).to.be.equal("false");
        expect(arg.get("publicKey")).to.be.equal("test_public_key");
        expect(arg.get("transformation")).to.be.equal(JSON.stringify(fileOptions.transformation));

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it("With pre transformation", async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            responseFields: "tags, customCoordinates, isPrivateFile, metadata",
            useUniqueFileName: false,
            transformation: { pre: "w-100" },
        };
        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

        var arg = server.requests[0].requestBody;

        expect(arg.get("file")).to.be.equal("test_file");
        expect(arg.get("fileName")).to.be.equal("test_file_name");
        expect(arg.get("responseFields")).to.be.equal("tags, customCoordinates, isPrivateFile, metadata");
        expect(arg.get("useUniqueFileName")).to.be.equal("false");
        expect(arg.get("publicKey")).to.be.equal("test_public_key");
        expect(arg.get("transformation")).to.be.equal(JSON.stringify(fileOptions.transformation));

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it("With post transformation", async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            responseFields: "tags, customCoordinates, isPrivateFile, metadata",
            useUniqueFileName: false,
            transformation: { post: [{ type: "transformation", value: "w-100" }] },
        };
        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

        var arg = server.requests[0].requestBody;

        expect(arg.get("file")).to.be.equal("test_file");
        expect(arg.get("fileName")).to.be.equal("test_file_name");
        expect(arg.get("responseFields")).to.be.equal("tags, customCoordinates, isPrivateFile, metadata");
        expect(arg.get("useUniqueFileName")).to.be.equal("false");
        expect(arg.get("publicKey")).to.be.equal("test_public_key");
        expect(arg.get("transformation")).to.be.equal(JSON.stringify(fileOptions.transformation));

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it("Server 5xx without message", async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            responseFields: "tags, customCoordinates, isPrivateFile, metadata",
            useUniqueFileName: false
        };
        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        await sleep();
        var errRes = {
            help: ""
        };
        errorUploadResponse(500, errRes);
        await sleep();
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitServerError).to.be.true;
            expect(ex.message).to.be.equal("Server error occurred while uploading the file. This is rare and usually temporary.");
        }
    });

    it("Should return error for an invalid pre transformation", async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            responseFields: "tags, customCoordinates, isPrivateFile, metadata",
            useUniqueFileName: false,
            transformation: { pre: "" },
        };
        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        await sleep();
        var errRes = {
            help: "",
            message: "Invalid pre transformation parameter.",
        };
        errorUploadResponse(500, errRes);
        await sleep();
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitInvalidRequestError).to.be.true;
            expect(ex.message).to.be.equal("Invalid pre transformation parameter.");
        }
    });

    it("Should return error for an invalid post transformation of type abs", async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            responseFields: "tags, customCoordinates, isPrivateFile, metadata",
            useUniqueFileName: false,
            transformation: { post: [{ type: "abs", value: "" }] },
        };
        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        await sleep();
        var errRes = {
            help: "",
            message: "Invalid post transformation parameter.",
        };
        errorUploadResponse(500, errRes);
        await sleep();
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitInvalidRequestError).to.be.true;
            expect(ex.message).to.be.equal("Invalid post transformation parameter.");
        }
    });

    it("Should return error for an invalid post transformation of type transformation", async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            responseFields: "tags, customCoordinates, isPrivateFile, metadata",
            useUniqueFileName: false,
            transformation: { post: [{ type: "transformation", value: "" }] },
        };
        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        await sleep();
        var errRes = {
            help: "",
            message: "Invalid post transformation parameter.",
        };
        errorUploadResponse(500, errRes);
        await sleep();
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitInvalidRequestError).to.be.true;
            expect(ex.message).to.be.equal("Invalid post transformation parameter.");
        }
    });

    it("Should return error for an invalid post transformation if it's not an array", async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            responseFields: "tags, customCoordinates, isPrivateFile, metadata",
            useUniqueFileName: false,
            transformation: { post: {} },
        };
        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        await sleep();
        var errRes = {
            help: "",
            message: "Invalid post transformation parameter.",
        };
        errorUploadResponse(500, errRes);
        await sleep();
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitInvalidRequestError).to.be.true;
            expect(ex.message).to.be.equal("Invalid post transformation parameter.");
        }
    });

    it("With checks option", async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            responseFields: "tags, customCoordinates, isPrivateFile, metadata",
            useUniqueFileName: false,
            checks: "'request.folder' : '/'",
        };
        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        await sleep();
        successUploadResponse();
        await sleep();

        var arg = server.requests[0].requestBody;
        expect(arg.get("file")).to.be.equal("test_file");
        expect(arg.get("fileName")).to.be.equal("test_file_name");
        expect(arg.get("responseFields")).to.be.equal("tags, customCoordinates, isPrivateFile, metadata");
        expect(arg.get("useUniqueFileName")).to.be.equal("false");
        expect(arg.get("publicKey")).to.be.equal("test_public_key");
        expect(arg.get('checks')).to.be.equal("'request.folder' : '/'");

        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it('onProgress callback is triggered during upload', async function () {
        const progressSpy = sinon.spy();
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            onProgress: progressSpy
        };
        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        server.requests[0].uploadProgress({ lengthComputable: true, loaded: 50, total: 100 });

        await sleep();
        expect(progressSpy.calledOnce).to.be.true;
        successUploadResponse();
        await sleep();
        expect(progressSpy.calledTwice).to.be.true; // final progress
        const response = await uploadPromise;
        expect(response).to.be.deep.equal(uploadSuccessResponseObj);
    });

    it('Abort signal aborts the upload', async function () {
        const abortController = new AbortController();
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            signal: abortController.signal
        };
        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        abortController.abort();
        await sleep();
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitAbortError).to.be.true;
            expect(ex.reason.name).to.be.equal("AbortError");
        }
    });

    it('Abort signal aborts the upload with reason', async function () {
        const abortController = new AbortController();
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            signal: abortController.signal
        };
        const uploadPromise = upload(fileOptions);
        expect(server.requests.length).to.be.equal(1);
        abortController.abort("abort reason");
        await sleep();
        try {
            await uploadPromise;
            throw new Error('Should have thrown error');
        } catch (ex) {
            expect(ex instanceof ImageKitAbortError).to.be.true;
            expect(ex.reason).to.be.equal("abort reason");
        }
    });

    it("Already aborted signal should abort upload immediately", async function () {
        const abortController = new AbortController();
        // Abort the signal before calling upload
        abortController.abort();
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            signal: abortController.signal
        };
        try {
            await upload(fileOptions);
            throw new Error("Should have thrown error");
        } catch (ex) {
            expect(ex instanceof ImageKitAbortError).to.be.true;
            expect(ex.reason && ex.reason.name).to.be.equal("AbortError");
        }
    });

    it("Error during upload 4xx with invalid JSON response", async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file"
        };
        const uploadPromise = upload(fileOptions);
        // errorUploadResponse(400, `{sd`);
        server.respondWith("POST", "https://upload.imagekit.io/api/v1/files/upload",
            [
                400,
                { "Content-Type": "application/json" },
                "sdf"
            ]
        );
        server.respond();
        try {
            await uploadPromise;
            throw new Error("Should have thrown error");
        } catch (ex) {
            expect(ex).to.be.instanceOf(SyntaxError);
        }
    });

    it("Should return error for an invalid transformation object in upload", async function () {
        const fileOptions = {
            ...securityParameters,
            fileName: "test_file_name",
            file: "test_file",
            transformation: 123
        };
        try {
            await upload(fileOptions);
            throw new Error("Should have thrown error");
        } catch (ex) {
            expect(ex instanceof ImageKitInvalidRequestError).to.be.true;
            expect(ex.message).to.be.equal("Invalid transformation parameter. Please include at least pre, post, or both.");
        }
    });
});
