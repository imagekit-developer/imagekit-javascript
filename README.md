[<img width="250" alt="ImageKit.io" src="https://raw.githubusercontent.com/imagekit-developer/imagekit-javascript/master/assets/imagekit-light-logo.svg"/>](https://imagekit.io)

# ImageKit.io Javascript SDK

![gzip size](https://img.badgesize.io/https://unpkg.com/imagekit-javascript/dist/imagekit.min.js?compression=gzip&label=gzip)
![brotli size](https://img.badgesize.io/https://unpkg.com/imagekit-javascript/dist/imagekit.min.js?compression=brotli&label=brotli)
![Node CI](https://github.com/imagekit-developer/imagekit-javascript/workflows/Node%20CI/badge.svg)
[![npm version](https://img.shields.io/npm/v/imagekit-javascript)](https://www.npmjs.com/package/imagekit-javascript) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Twitter Follow](https://img.shields.io/twitter/follow/imagekitio?label=Follow&style=social)](https://twitter.com/ImagekitIo)

ImageKit Javascript SDK allows you to use real-time [image resizing](https://docs.imagekit.io/features/image-transformations), [optimization](https://docs.imagekit.io/features/image-optimization), and [file uploading](https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload) in the client-side.

This SDK is lightweight and has no dependency. You can also use this as an ES module.

## Installation

### Using npm
Install `imagekit-javascript`
```
npm install imagekit-javascript
```

Now import ImageKit
```js
import ImageKit from "imagekit-javascript"

// or
const ImageKit = require("imagekit-javascript")
```

### Using CDN
You can download a specific version of this SDK from a global CDN.
```
https://unpkg.com/imagekit-javascript@1.3.0/dist/imagekit.min.js
```

For the latest version, remove the version number i.e.
```
https://unpkg.com/imagekit-javascript/dist/imagekit.min.js
```

Now load it using a `<script>` tag.

```
<script type="text/javascript" src="https://unpkg.com/imagekit-javascript/dist/imagekit.min.js"></script>
```

## Initialization

`urlEndpoint` is required to use the SDK. You can get URL-endpoint from your ImageKit dashboard - https://imagekit.io/dashboard#url-endpoints

```
var imagekit = new ImageKit({
    urlEndpoint: "https://ik.imagekit.io/your_imagekit_id"
});    
```

`publicKey` and `authenticationEndpoint` parameters are required if you want to use the SDK for client-side file upload. You can get these parameters from the developer section in your ImageKit dashboard - https://imagekit.io/dashboard#developers
```
var imagekit = new ImageKit({
    publicKey: "your_public_api_key",
    urlEndpoint: "https://ik.imagekit.io/your_imagekit_id",
    authenticationEndpoint: "http://www.yourserver.com/auth",
});    
```

*Note: Do not include your Private Key in any client-side code, including this SDK or its initialization. If you pass the `privateKey` parameter while initializing this SDK, it throws an error*

## Demo Application

The fastest way to get started is by running the demo application in [samples/sample-app](https://github.com/imagekit-developer/imagekit-javascript/tree/master/samples/sample-app) folder. Follow these steps to run the application locally:

```
git clone https://github.com/imagekit-developer/imagekit-javascript.git

cd imagekit-javascript
```

Create a file `.env` using `sample.env` in the directory `samples/sample-app` and fill in your `PRIVATE_KEY`, `PUBLIC_KEY` and `URL_ENDPOINT` from your [imageKit dashboard](https://imagekit.io/dashboard#developers). `SERVER_PORT` must also be included as per the `sample.env` file.

Now start the sample application by running:

```
yarn startSampleApp
```

## Usage
You can use this SDK for URL generation and client-side file uploads.

### URL Generation

**1. Using image path and image hostname or endpoint**

This method allows you to create a URL using the `path` where the image exists and the URL endpoint (`urlEndpoint`) you want to use to access the image. You can refer to the documentation [here](https://docs.imagekit.io/integration/url-endpoints) to read more about URL endpoints in ImageKit and the section about [image origins](https://docs.imagekit.io/integration/configure-origin) to understand about paths with different kinds of origins.

```
var imageURL = imagekit.url({
    path: "/default-image.jpg",
    urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/endpoint/",
    transformation: [{
        "height": "300",
        "width": "400"
    }]
});
```

This results in a URL like

```
https://ik.imagekit.io/your_imagekit_id/endpoint/tr:h-300,w-400/default-image.jpg
```

**2. Using full image URL**

This method allows you to add transformation parameters to an existing, complete URL that is already mapped to ImageKit using the `src` parameter. This method should be used if you have the complete URL mapped to ImageKit stored in your database.


```
var imageURL = imagekit.url({
    src: "https://ik.imagekit.io/your_imagekit_id/endpoint/default-image.jpg",
    transformation: [{
        "height": "300",
        "width": "400"
    }]
});
```

This results in a URL like

```
https://ik.imagekit.io/your_imagekit_id/endpoint/default-image.jpg?tr=h-300%2Cw-400
```


The `.url()` method accepts the following parameters

| Option           | Description                    |
| :----------------| :----------------------------- |
| urlEndpoint      | Optional. The base URL to be appended before the path of the image. If not specified, the URL Endpoint specified at the time of SDK initialization is used. For example, https://ik.imagekit.io/your_imagekit_id/endpoint/ |
| path             | Conditional. This is the path at which the image exists. For example, `/path/to/image.jpg`. Either the `path` or `src` parameter need to be specified for URL generation. |
| src              | Conditional. This is the complete URL of an image already mapped to ImageKit. For example, `https://ik.imagekit.io/your_imagekit_id/endpoint/path/to/image.jpg`. Either the `path` or `src` parameter need to be specified for URL generation. |
| transformation   | Optional. An array of objects specifying the transformation to be applied in the URL. The transformation name  and the value should be specified as a key-value pair in the object. Different steps of a [chained transformation](https://docs.imagekit.io/features/image-transformations/chained-transformations) can be specified as different objects of the array. The complete list of supported transformations in the SDK and some examples of using them are given later. If you use a transformation name that is not specified in the SDK, it gets applied as it is in the URL. |
| transformationPostion | Optional. The default value is `path` that places the transformation string as a path parameter in the URL. It can also be specified as `query` which adds the transformation string as the query parameter `tr` in the URL. If you use `src` parameter to create the URL, then the transformation string is always added as a query parameter. |
| queryParameters  | Optional. These are the other query parameters that you want to add to the final URL. These can be any query parameters and not necessarily related to ImageKit. Especially useful if you want to add some versioning parameter to your URLs. |

#### Examples of generating URLs

**1. Chained Transformations as a query parameter**
```
var imageURL = imagekit.url({
    path: "/default-image.jpg",
    urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/endpoint/",
    transformation: [{
        "height": "300",
        "width": "400"
    }, {
        "rotation": 90
    }],
    transformationPosition: "query"
});
```
```
https://ik.imagekit.io/your_imagekit_id/endpoint/default-image.jpg?tr=h-300%2Cw-400%3Art-90
```

**2. Sharpening and contrast transforms and a progressive JPG image**

There are some transforms like [Sharpening](https://docs.imagekit.io/features/image-transformations/image-enhancement-and-color-manipulation) that can be added to the URL with or without any other value. To use such transforms without specifying a value, specify the value as "-" in the transformation object. Otherwise, specify the value that you want to be added to this transformation.

```
var imageURL = imagekit.url({
    src: "https://ik.imagekit.io/your_imagekit_id/endpoint/default-image.jpg",
    transformation: [{
        "format": "jpg",
        "progressive": "true",
        "effectSharpen": "-",
        "effectContrast": "1"
    }]
});
```
```
//Note that because `src` parameter was used, the transformation string gets added as a query parameter `tr`
https://ik.imagekit.io/your_imagekit_id/endpoint/default-image.jpg?tr=f-jpg%2Cpr-true%2Ce-sharpen%2Ce-contrast-1
```

#### List of supported transformations

The complete list of transformations supported and their usage in ImageKit can be found [here](https://docs.imagekit.io/features/image-transformations). The SDK gives a name to each transformation parameter, making the code simpler and readable. If a transformation is supported in ImageKit, but a name for it cannot be found in the table below, then use the transformation code from ImageKit docs as the name when using in the `url` function.

| Supported Transformation Name | Translates to parameter |
|-------------------------------|-------------------------|
| height | h |
| width | w |
| aspectRatio | ar |
| quality | q |
| crop | c |
| cropMode | cm |
| x | x |
| y | y |
| focus | fo |
| format | f |
| radius | r |
| background | bg |
| border | bo |
| rotation | rt |
| blur | bl |
| named | n |
| overlayX | ox |
| overlayY | oy |
| overlayFocus | ofo |
| overlayHeight | oh |
| overlayWidth | ow |
| overlayImage | oi |
| overlayImageTrim | oit |
| overlayImageAspectRatio | oiar |
| overlayImageBackground | oibg |
| overlayImageBorder | oib |
| overlayImageDPR | oidpr |
| overlayImageQuality | oiq |
| overlayImageCropping | oic |
| overlayImageTrim | oit |
| overlayText | ot |
| overlayTextFontSize | ots |
| overlayTextFontFamily | otf |
| overlayTextColor | otc |
| overlayTextTransparency | oa |
| overlayAlpha | oa |
| overlayTextTypography | ott |
| overlayBackground | obg |
| overlayTextEncoded | ote |
| overlayTextWidth | otw |
| overlayTextBackground | otbg |
| overlayTextPadding | otp |
| overlayTextInnerAlignment | otia |
| overlayRadius | or |
| progressive | pr |
| lossless | lo |
| trim | t |
| metadata | md |
| colorProfile | cp |
| defaultImage | di |
| dpr | dpr |
| effectSharpen | e-sharpen |
| effectUSM | e-usm |
| effectContrast | e-contrast |
| effectGray | e-grayscale |
| original | orig |


### File Upload

The SDK provides a simple interface using the `.upload()` method to upload files to the ImageKit Media Library. It accepts all the parameters supported by the [ImageKit Upload API](https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload).

The `upload()` method requires `file` and the `fileName` parameter. 

Also, make sure that you have specified `authenticationEndpoint` during SDK initialization. The SDK makes an HTTP GET request to this endpoint and expects a JSON response with three fields, i.e. `signature`, `token`, and `expire`.  

[Learn how to implement authenticationEndpoint](https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload#how-to-implement-authenticationendpoint-endpoint) on your server.

You can pass other parameters supported by the ImageKit upload API using the same parameter name as specified in the upload API documentation. For example, to specify tags for a file at the time of upload, use the `tags` parameter as specified in the [documentation here](https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload).

Sample usage
```
<form action="#" onsubmit="upload()">
    <input type="file" id="file1" />
    <input type="submit" />
</form>
<script type="text/javascript" src="../dist/imagekit.js"></script>

<script>
    /* SDK initilization
     authenticationEndpoint should be implemented on your server. Learn more here - https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload#how-to-implement-authenticationendpoint-endpoint
    */
    var imagekit = new ImageKit({
        publicKey: "your_public_api_key",
        urlEndpoint: "https://ik.imagekit.io/your_imagekit_id",
        authenticationEndpoint: "http://www.yourserver.com/auth"
    });
    
    // Upload function internally uses the ImageKit.io javascript SDK
    function upload(data) {
        var file = document.getElementById("file1");
        imagekit.upload({
            file: file.files[0],
            fileName: "abc1.jpg",
            tags: ["tag1"]
        }, function(err, result) {
            console.log(arguments);
            console.log(imagekit.url({
                src: result.url,
                transformation: [{ height: 300, width: 400}]
            }));
        })
    }
</script>
```

If the upload succeeds, `err` will be `null`, and the `result` will be the same as what is received from ImageKit's servers.
If the upload fails, `err` will be the same as what is received from ImageKit's servers, and the `result` will be null.

