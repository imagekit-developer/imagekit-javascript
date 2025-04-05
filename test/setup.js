// test-setup.js (loaded before your tests)
global.FormData = require("formdata-node");
global.Blob = require("web-file-polyfill").Blob
global.File = require("web-file-polyfill").File
global.ProgressEvent = class FakeProgressEvent {
    constructor(type, init = {}) {
        this.type = type;
        this.lengthComputable = init.lengthComputable || false;
        this.loaded = init.loaded || 0;
        this.total = init.total || 0;
    }
};
