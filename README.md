[<img width="250" alt="ImageKit.io" src="https://raw.githubusercontent.com/imagekit-developer/imagekit-javascript/master/assets/imagekit-light-logo.svg"/>](https://imagekit.io)

# ImageKit.io JavaScript SDK

![gzip size](https://img.badgesize.io/https://unpkg.com/imagekit-javascript/dist/imagekit.min.js?compression=gzip&label=gzip)
![brotli size](https://img.badgesize.io/https://unpkg.com/imagekit-javascript/dist/imagekit.min.js?compression=brotli&label=brotli)
![Node CI](https://github.com/imagekit-developer/imagekit-javascript/workflows/Node%20CI/badge.svg)
[![npm version](https://img.shields.io/npm/v/imagekit-javascript)](https://www.npmjs.com/package/imagekit-javascript) 
[![codecov](https://codecov.io/gh/imagekit-developer/imagekit-javascript/branch/master/graph/badge.svg)](https://codecov.io/gh/imagekit-developer/imagekit-javascript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Twitter Follow](https://img.shields.io/twitter/follow/imagekitio?label=Follow&style=social)](https://twitter.com/ImagekitIo)

Lightweight JavaScript SDK for generating optimized URLs for images and videos, and for handling file uploads via ImageKit.

## Table of Contents
- [Installation](#installation)
- [Initialization](#initialization)
- [URL Generation](#url-generation)
  - [Basic URL Generation](#basic-url-generation)
  - [Advanced URL Generation Examples](#advanced-url-generation-examples)
  - [Supported Transformations](#supported-transformations)
  - [Handling Unsupported Transformations](#handling-unsupported-transformations)
- [File Upload](#file-upload)
  - [Basic Upload Example](#basic-upload-example)
  - [Promise-based Upload Example](#promise-based-upload-example)
- [Demo Application](#demo-application)
- [Changelog](#changelog)

## Installation

### Using npm
Install the SDK via npm:
```bash
npm install imagekit-javascript --save
# or
yarn add imagekit-javascript
```

Then import ImageKit:
```js
import ImageKit from "imagekit-javascript";
// or with CommonJS:
const ImageKit = require("imagekit-javascript");
```

### Using CDN
You can also use the global CDN:

Download a specific version:
```
https://unpkg.com/imagekit-javascript@1.3.0/dist/imagekit.min.js
```
Or for the latest version, remove the version number:
```
https://unpkg.com/imagekit-javascript/dist/imagekit.min.js
```
And include it in your HTML:
```html
<script type="text/javascript" src="https://unpkg.com/imagekit-javascript/dist/imagekit.min.js"></script>
```

## Initialization

Initialize the SDK with your URL endpoint. For URL generation:
```js
var imagekit = new ImageKit({
    urlEndpoint: "https://ik.imagekit.io/your_imagekit_id"
});
```
For client-side file uploads, include your public key:
```js
var imagekit = new ImageKit({
    publicKey: "your_public_api_key",
    urlEndpoint: "https://ik.imagekit.io/your_imagekit_id",
});
```
*Note: Never include your private key in client-side code. If provided, the SDK throws an error.*

## URL Generation

The SDK’s `.url()` method enables you to generate optimized image and video URLs with a variety of transformations.

### Basic URL Generation

1. **Using an Image Path with a URL Endpoint**
    ```js
    var imageURL = imagekit.url({
        path: "/default-image.jpg",
        urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/endpoint/",
        transformation: [{
            "height": "300",
            "width": "400"
        }]
    });
    ```
    *Result Example:*
    ```
    https://ik.imagekit.io/your_imagekit_id/endpoint/tr:h-300,w-400/default-image.jpg
    ```

2. **Using a Full Image URL (src)**
    ```js
    var imageURL = imagekit.url({
        src: "https://ik.imagekit.io/your_imagekit_id/endpoint/default-image.jpg",
        transformation: [{
            "height": "300",
            "width": "400"
        }]
    });
    ```
    *Result Example:*
    ```
    https://ik.imagekit.io/your_imagekit_id/endpoint/default-image.jpg?tr=h-300%2Cw-400
    ```

### Advanced URL Generation Examples

#### Chained Transformations
Apply multiple transformations by passing an array:
```js
var imageURL = imagekit.url({
    path: "/default-image.jpg",
    transformation: [{
        "height": "300",
        "width": "400"
    }, {
        "rotation": 90
    }],
    transformationPosition: "query" // Use query parameter for transformations
});
```
*Result Example:*
```
https://ik.imagekit.io/your_imagekit_id/default-image.jpg?tr=h-300%2Cw-400%3Art-90
```

#### Overlays and Effects
*Text Overlay Example:*
```js
var imageURL = imagekit.url({
    src: "https://ik.imagekit.io/your_imagekit_id/default-image.jpg",
    transformation: [{
        "width": 400,
        "height": 300,
        "raw": "l-text,i-Imagekit,fs-50,l-end"
    }]
});
```
*Image Overlay Example:*
```js
var imageURL = imagekit.url({
    src: "https://ik.imagekit.io/your_imagekit_id/default-image.jpg",
    transformation: [{
        "width": 400,
        "height": 300,
        "raw": "l-image,i-default-image.jpg,w-100,b-10_CDDC39,l-end"
    }]
});
```

#### AI and Advanced Transformations
*Background Removal:*
```js
var imageURL = imagekit.url({
  path: "/sample-image.jpg",
  transformation: [{
    aiRemoveBackground: true
  }]
});
```
*Upscaling:*
```js
var upscaledURL = imagekit.url({
  path: "/sample-image.jpg",
  transformation: [{
    aiUpscale: true
  }]
});
```
*Drop Shadow:*
```js
var dropShadowURL = imagekit.url({
  path: "/sample-image.jpg",
  transformation: [{
    aiDropShadow: "az-45"
  }]
});
```

#### Arithmetic Expressions in Transformations
```js
var imageURL = imagekit.url({
    src: "https://ik.imagekit.io/your_imagekit_id/default-image.jpg",
    transformation: [{
        "width": "iw_div_4",
        "height": "ih_div_2",
        "border": "cw_mul_0.05_yellow"
    }]
});
```

### Supported Transformations

The SDK supports various transformations which are translated to URL parameters as follows:

| Transformation Name        | URL Parameter                                                 |
| -------------------------- | ------------------------------------------------------------- |
| width                      | w                                                             |
| height                     | h                                                             |
| aspectRatio                | ar                                                            |
| quality                    | q                                                             |
| aiRemoveBackground         | e-bgremove                                                    |
| aiRemoveBackgroundExternal | e-removedotbg                                                 |
| aiUpscale                  | e-upscale                                                     |
| aiRetouch                  | e-retouch                                                     |
| aiVariation                | e-genvar                                                      |
| aiDropShadow               | e-dropshadow                                                  |
| aiChangeBackground         | e-changebg                                                    |
| crop                       | c                                                             |
| cropMode                   | cm                                                            |
| x                          | x                                                             |
| y                          | y                                                             |
| xCenter                    | xc                                                            |
| yCenter                    | yc                                                            |
| focus                      | fo                                                            |
| format                     | f                                                             |
| radius                     | r                                                             |
| background                 | bg                                                            |
| border                     | b                                                             |
| rotation                   | rt                                                            |
| blur                       | bl                                                            |
| named                      | n                                                             |
| dpr                        | dpr                                                           |
| progressive                | pr                                                            |
| lossless                   | lo                                                            |
| trim                       | t                                                             |
| metadata                   | md                                                            |
| colorProfile               | cp                                                            |
| defaultImage               | di                                                            |
| original                   | orig                                                          |
| videoCodec                 | vc                                                            |
| audioCodec                 | ac                                                            |
| grayscale                  | e-grayscale                                                   |
| contrastStretch            | e-contrast                                                    |
| shadow                     | e-shadow                                                      |
| sharpen                    | e-sharpen                                                     |
| unsharpMask                | e-usm                                                         |
| gradient                   | e-gradient                                                    |
| opacity                    | o                                                             |
| zoom                       | z                                                             |
| page                       | pg                                                            |
| startOffset                | so                                                            |
| endOffset                  | eo                                                            |
| duration                   | du                                                            |
| streamingResolutions       | sr                                                            |
| raw                        | The string provided in raw will be added in the URL as it is. |
| flip                       | fl                                                            |

### Handling Unsupported Transformations

If you specify a transformation parameter that is not explicitly supported by the SDK, it is added “as-is” in the generated URL. This provides flexibility for using new or custom transformations without waiting for an SDK update.

## File Upload

The SDK offers a simple interface via the `.upload()` method to upload files to the ImageKit Media Library. This method requires the following:
- **file** (mandatory)
- **fileName** (mandatory)
- Security parameters: **signature**, **token**, and **expire**

Before invoking the upload, generate the necessary security parameters as per the [ImageKit Upload API documentation](https://imagekit.io/docs/api-reference/upload-file/upload-file#how-to-implement-client-side-file-upload).

### Basic Upload Example

Below is an HTML form example that uses a callback for handling the upload response:

```html
<form action="#" onsubmit="upload(); return false;">
    <input type="file" id="file1" />
    <input type="submit" />
</form>
<script src="../dist/imagekit.js"></script>
<script>
    var imagekit = new ImageKit({
        publicKey: "your_public_api_key",
        urlEndpoint: "https://ik.imagekit.io/your_imagekit_id",
    });
    
    function upload() {
        var file = document.getElementById("file1");
        imagekit.upload({
            file: file.files[0],
            fileName: "abc1.jpg",
            token: 'generated_token',
            signature: 'generated_signature',
            expire: 'generated_expire'
        }, function(err, result) {
            if(err){
                console.error(err);
            } else {
                console.log(result);
            }
        });
    }
</script>
```

### Promise-based Upload Example

You can also use promises for a cleaner asynchronous approach:
```js
imagekit.upload({
    file: file.files[0],
    fileName: "abc1.jpg",
    token: 'generated_token',
    signature: 'generated_signature',
    expire: 'generated_expire'
}).then(result => {
    console.log(result);
}).catch(error => {
    console.error(error);
});
```

## Demo Application

For the fastest way to get started, check out the demo application in the [samples/sample-app](https://github.com/imagekit-developer/imagekit-javascript/tree/master/samples/sample-app) folder.

To run the demo locally:
```bash
git clone https://github.com/imagekit-developer/imagekit-javascript.git
cd imagekit-javascript
```
Then, create a `.env` file in the `samples/sample-app` directory based on `sample.env` and provide your `PRIVATE_KEY`, `PUBLIC_KEY`, and `URL_ENDPOINT` from your ImageKit dashboard. Finally, start the demo:
```bash
yarn startSampleApp
```

## Changelog

For a detailed history of changes, please refer to [CHANGELOG.md](CHANGELOG.md).
