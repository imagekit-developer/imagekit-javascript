[<img width="250" alt="ImageKit.io" src="https://raw.githubusercontent.com/imagekit-developer/imagekit-javascript/master/assets/imagekit-light-logo.svg"/>](https://imagekit.io)

# ImageKit.io JavaScript SDK

![gzip size](https://img.badgesize.io/https://unpkg.com/imagekit-javascript/dist/imagekit.min.js?compression=gzip&label=gzip)
![brotli size](https://img.badgesize.io/https://unpkg.com/imagekit-javascript/dist/imagekit.min.js?compression=brotli&label=brotli)
![Node CI](https://github.com/imagekit-developer/imagekit-javascript/workflows/Node%20CI/badge.svg)
[![npm version](https://img.shields.io/npm/v/imagekit-javascript)](https://www.npmjs.com/package/imagekit-javascript) 
[![codecov](https://codecov.io/gh/imagekit-developer/imagekit-javascript/branch/master/graph/badge.svg)](https://codecov.io/gh/imagekit-developer/imagekit-javascript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Twitter Follow](https://img.shields.io/twitter/follow/imagekitio?label=Follow&style=social)](https://twitter.com/ImagekitIo)

A lightweight JavaScript SDK for generating image and video URLs with transformations, and for uploading files directly from the browser to ImageKit. This SDK is intended for use in the browser only. For Node.js, please refer to our official [Node.js SDK](https://github.com/imagekit-developer/imagekit-nodejs).

## Table of Contents
- [Installation](#installation)
- [Initialization](#initialization)
- [URL Generation](#url-generation)
  - [Basic URL Generation](#basic-url-generation)
  - [Advanced URL Generation Examples](#advanced-url-generation-examples)
    - [Chained Transformations](#chained-transformations)
    - [Overlays and Effects](#overlays-and-effects)
    - [AI and Advanced Transformations](#ai-and-advanced-transformations)
    - [Arithmetic Expressions in Transformations](#arithmetic-expressions-in-transformations)
  - [Supported Transformations](#supported-transformations)
  - [Handling Unsupported Transformations](#handling-unsupported-transformations)
- [File Upload](#file-upload)
  - [Basic Upload Example](#basic-upload-example)
  - [Promise-based Upload Example](#promise-based-upload-example)
- [Test Examples](#test-examples)
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
Or for the latest version, remove the version number (don't use in production as it may break your code if a new major version is released):
```
https://unpkg.com/imagekit-javascript/dist/imagekit.min.js
```

And include it in your HTML:
```html
<script type="text/javascript" src="https://unpkg.com/imagekit-javascript/dist/imagekit.min.js"></script>
```

## Initialization
To use the SDK, initialize it with your ImageKit URL endpoint. You can get the URL endpoint [here](https://imagekit.io/dashboard/url-endpoints) and your public API key from the [developer section](https://imagekit.io/dashboard/developer/api-keys):

```js
var imagekit = new ImageKit({
    urlEndpoint: "https://ik.imagekit.io/your_imagekit_id", // Required
    transformationPosition: "query", // Optional, defaults to "query"
    publicKey: "your_public_api_key", // Optional, required only for client-side file uploads
});
```

### Initialization Options

| Option                 | Description                                                                                                                                                                                                                                         | Example                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| urlEndpoint            | Required. Your ImageKit URL endpoint or custom domain.                                                                                                                                                                                              | `urlEndpoint: "https://ik.imagekit.io/your_id"` |
| transformationPosition | Optional. Specifies whether transformations are added as URL path segments (`path`) or query parameters (`query`). The default is `query`, which allows you to perform wildcard purges and remove all generated transformations from the CDN cache. | `transformationPosition: "query"`               |
| publicKey              | Optional. Your public API key for client-side uploads.                                                                                                                                                                                              | `publicKey: "your_public_api_key"`              |


## URL Generation

The SDK’s `.url()` method enables you to generate optimized image and video URLs with a variety of transformations.

The method accepts an object with the following parameters:

| Option          | Description                                                                                                                                                                                                            | Example                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| path            | The relative path of the image. Either `src` or `path` must be provided.                                                                                                                                               | `"/path/to/image.jpg"`                                        |
| src             | The full URL of an image already mapped to ImageKit. Either `src` or `path` must be provided.                                                                                                                          | `"https://ik.imagekit.io/your_imagekit_id/path/to/image.jpg"` |
| transformation  | An array of objects specifying the transformations to be applied in the URL. Each object contains key-value pairs representing transformation parameters. See [supported transformations](#supported-transformations). | `[ { width: 300, height: 400 } ]`                             |
| queryParameters | Additional query parameters to be appended to the URL.                                                                                                                                                                 | `{ v: 1 }`                                                    |

Optionally, you can include `transformationPosition` and `urlEndpoint` in the object to override the initialization settings for a specific `.url()` call.

### Basic URL Generation

*A simple height and width transformation:*

```js
var imageURL = imagekit.url({
    path: "/default-image.jpg",
    urlEndpoint: "https://ik.imagekit.io/your_imagekit_id/endpoint/",
    transformation: [{
        height: 300,
        width: 400
    }]
});
```

*Result Example:*
```
https://ik.imagekit.io/your_imagekit_id/endpoint/default-image.jpg?tr=h-300,w-400
```

SDK automatically generates the URL based on the provided parameters. The generated URL includes the base URL, path, and transformation parameters.

### Advanced URL Generation Examples

#### Chained Transformations
Apply multiple transformations by passing an array:
```js
var imageURL = imagekit.url({
    path: "/default-image.jpg",
    transformation: [{
        height: 300,
        width: 400
    }, {
        rotation: 90
    }],
});
```

*Result Example:*
```
https://ik.imagekit.io/your_imagekit_id/default-image.jpg?tr=h-300,w-400:rt-90
```

#### Overlays and Effects
*Text Overlay Example:*
```js
var imageURL = imagekit.url({
    src: "https://ik.imagekit.io/your_imagekit_id/default-image.jpg",
    transformation: [{
        width: 400,
        height: 300,
        overlay: {
            text: "Imagekit",
            fontSize: 50,
            color: "red",
            position: {
                x: 10,
                y: 20
            }
        }
    }]
});
```

*Image Overlay Example:*

```js
var imageURL = imagekit.url({
    src: "https://ik.imagekit.io/your_imagekit_id/default-image.jpg",
    transformation: [{
        width: 400,
        height: 300,
        overlay: {
            type: "image",
            input: "logo.png",
            transformation: [{
                width: 100,
                border: "10_CDDC39"
            }],
            position: {
                focus: "top_left"
            }
        }
    }]
});
```

*Video Overlay Example:*

```js
var videoOverlayURL = imagekit.url({
    src: "https://ik.imagekit.io/your_imagekit_id/base-video.mp4",
    transformation: [{
        overlay: {
            type: "video",
            input: "overlay-video.mp4",
            position: { 
                x: "10", 
                y: "20" 
            },
            timing: { 
                start: 5, 
                duration: 10 
            }
        }
    }]
});
```

*Subtitle Overlay Example:*

```js
var subtitleOverlayURL = imagekit.url({
    src: "https://ik.imagekit.io/your_imagekit_id/base-video.mp4",
    transformation: [{
        overlay: {
            type: "subtitle",
            input: "subtitle.vtt",
            transformation: [{
                fontSize: 16,
                fontFamily: "Arial"
            }],
            position: { 
                focus: "bottom" 
            },
            timing: { 
                start: 0, 
                duration: 5 
            }
        }
    }]
});
```

*Solid Color Overlay Example:*
```js
var solidColorOverlayURL = imagekit.url({
    src: "https://ik.imagekit.io/your_imagekit_id/base-image.jpg",
    transformation: [{
        overlay: {
            type: "solidColor",
            color: "FF0000",
            transformation: [{
                width: 100,
                height: 50,
                alpha: 5
            }],
            position: { x: 20, y: 20 }
        }
    }]
});
```

##### Overlay Options

ImageKit supports various overlay types, including text, image, video, subtitle, and solid color overlays. Each overlay type has specific configuration options to customize the overlay appearance and behavior. To learn more about how overlays work, refer to the [ImageKit documentation](https://imagekit.io/docs/transformations#overlay-using-layers).

The table below outlines the available overlay configuration options:

| Option         | Description                                                                                                                                                                                                                                                                                                                                                                                                      | Example                                                         |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| type           | Specifies the type of overlay. Supported values: `text`, `image`, `video`, `subtitle`, `solidColor`.                                                                                                                                                                                                                                                                                                             | `type: "text"`                                                  |
| text           | (For text overlays) The text content to display.                                                                                                                                                                                                                                                                                                                                                                 | `text: "ImageKit"`                                              |
| input          | (For image, video, or subtitle overlays) Relative path to the overlay asset.                                                                                                                                                                                                                                                                                                                                     | `input: "logo.png"` or `input: "overlay-video.mp4"`             |
| color          | (For solidColor overlays) RGB/RGBA hex code or color name for the overlay color.                                                                                                                                                                                                                                                                                                                                 | `color: "FF0000"`                                               |
| encoding       | Accepted values: `auto`, `plain`, `base64`. [Check this](#encoding-options) for more details.                                                                                                                                                                                                                                                                                                                    | `encoding: "auto"`                                              |
| transformation | An array of transformation objects to style the overlay. <br> - [Text Overlay Transformations](#text-overlay-transformations) <br> - [Subtitle Overlay Transformations](#subtitle-overlay-transformations) <br> - Image and video overlays support most [transformations](#supported-transformations). <br> See [ImageKit docs](https://imagekit.io/docs/transformations#overlay-using-layers) for more details. | `transformation: [{ fontSize: 50 }]`                            |
| position       | Sets the overlay’s position relative to the base asset. Accepts an object with `x`, `y`, or `focus`. The `focus` value can be one of: `center`, `top`, `left`, `bottom`, `right`, `top_left`, `top_right`, `bottom_left`, or `bottom_right`.                                                                                                                                                                     | `position: { x: 10, y: 20 }` or `position: { focus: "center" }` |
| timing         | (For video base) Specifies when the overlay appears using `start`, `duration`, and `end` (in seconds); if both `duration` and `end` are set, `duration` is ignored.                                                                                                                                                                                                                                              | `timing: { start: 5, duration: 10 }`                            |

##### Encoding Options

Overlay encoding options define how the overlay input is converted for URL construction. When set to `auto`, the SDK automatically determines whether to use plain text or Base64 encoding based on the input content.

For text overlays:
- If `auto` is used, the SDK checks the text overlay input: if it is URL-safe, it uses the format `i-{input}` (plain text); otherwise, it applies Base64 encoding with the format `ie-{base64_encoded_input}`.
- You can force a specific method by setting encoding to `plain` (always use `i-{input}`) or `base64` (always use `ie-{base64}`).
- Note: In all cases, the text is percent-encoded to ensure URL safety.

For image, video, and subtitle overlays:
- The input path is processed by removing any leading/trailing slashes and replacing inner slashes with `@@` when `plain` is used.
- Similarly, if `auto` is used, the SDK determines whether to apply plain text or Base64 encoding based on the characters present.
- For explicit behavior, use `plain` or `base64` to enforce the desired encoding.

Use `auto` for most cases to let the SDK optimize encoding, and use `plain` or `base64` when a specific encoding method is required.

##### Solid Color Overlay Transformations

| Option | Description                                                                                                                        | Example         |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| width  | Specifies the width of the solid color overlay block (in pixels or as an arithmetic expression).                                   | `width: 100`    |
| height | Specifies the height of the solid color overlay block (in pixels or as an arithmetic expression).                                  | `height: 50`    |
| radius | Specifies the corner radius of the solid color overlay block or shape. Can be a number or `"max"` for circular/oval shapes.        | `radius: "max"` |
| alpha  | Specifies the transparency level of the solid color overlay. Supports integers from 1 (most transparent) to 9 (least transparent). | `alpha: 5`      |

##### Text Overlay Transformations

| Option         | Description                                                                                                                                                              | Example                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| width          | Specifies the maximum width (in pixels) of the overlaid text. The text wraps automatically, and arithmetic expressions are supported (e.g., `bw_mul_0.2` or `bh_div_2`). | `width: 400`               |
| fontSize       | Specifies the font size of the overlaid text. Accepts a numeric value or an arithmetic expression.                                                                       | `fontSize: 50`             |
| fontFamily     | Specifies the font family of the overlaid text. Choose from the supported fonts or provide a custom font.                                                                | `fontFamily: "Arial"`      |
| fontColor      | Specifies the font color of the overlaid text. Accepts an RGB hex code, an RGBA code, or a standard color name.                                                          | `fontColor: "FF0000"`      |
| innerAlignment | Specifies the inner alignment of the text when it doesn’t occupy the full width. Supported values: `left`, `right`, `center`.                                            | `innerAlignment: "center"` |
| padding        | Specifies the padding around the text overlay. Can be a single integer or multiple values separated by underscores; arithmetic expressions are accepted.                 | `padding: 10`              |
| alpha          | Specifies the transparency level of the text overlay. Accepts an integer between `1` and `9`.                                                                            | `alpha: 5`                 |
| typography     | Specifies the typography style of the text. Supported values: `b` for bold, `i` for italics, and `b_i` for bold with italics.                                            | `typography: "b"`          |
| background     | Specifies the background color of the text overlay. Accepts an RGB hex code, an RGBA code, or a color name.                                                              | `background: "red"`        |
| radius         | Specifies the corner radius of the text overlay. Accepts a numeric value or `max` for circular/oval shape.                                                               | `radius: "max"`            |
| rotation       | Specifies the rotation angle of the text overlay. Accepts a numeric value for clockwise rotation or a string prefixed with `N` for counterclockwise rotation.            | `rotation: 90`             |
| flip           | Specifies the flip option for the text overlay. Supported values: `h`, `v`, `h_v`, `v_h`.                                                                                | `flip: "h"`                |
| lineHeight     | Specifies the line height for multi-line text. Accepts a numeric value or an arithmetic expression.                                                                      | `lineHeight: 1.5`          |

##### Subtitle Overlay Transformations

| Option      | Description                                                                                               | Example                 |
| ----------- | --------------------------------------------------------------------------------------------------------- | ----------------------- |
| background  | Specifies the subtitle background color using a standard color name, RGB color code, or RGBA color code.  | `background: "blue"`    |
| fontSize    | Sets the font size of subtitle text.                                                                      | `fontSize: 16`          |
| fontFamily  | Sets the font family of subtitle text.                                                                    | `fontFamily: "Arial"`   |
| color       | Specifies the font color of subtitle text using standard color name, RGB, or RGBA color code.             | `color: "FF0000"`       |
| typography  | Sets the typography style of subtitle text. Supported values: `b`, `i`, `b_i`.                            | `typography: "b"`       |
| fontOutline | Specifies the font outline for subtitles. Requires an outline width and color separated by an underscore. | `fontOutline: "2_blue"` |
| fontShadow  | Specifies the font shadow for subtitles. Requires shadow color and indent separated by an underscore.     | `fontShadow: "blue_2"`  |

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
        width: "iw_div_4",
        height: "ih_div_2",
        border: "cw_mul_0.05_yellow"
    }]
});
```

### Supported Transformations

The SDK gives a name to each transformation parameter (e.g. `height` maps to `h`, `width` maps to `w`). If the property does not match any of the following supported options, it is added as is.

If you want to generate transformations without any modifications, use the `raw` parameter.

Check ImageKit [transformation documentation](https://imagekit.io/docs/transformations) for more details.

| Transformation Name        | URL Parameter                                                                                  |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| width                      | w                                                                                              |
| height                     | h                                                                                              |
| aspectRatio                | ar                                                                                             |
| quality                    | q                                                                                              |
| aiRemoveBackground         | e-bgremove (ImageKit powered)                                                                  |
| aiRemoveBackgroundExternal | e-removedotbg (Using third party)                                                              |
| aiUpscale                  | e-upscale                                                                                      |
| aiRetouch                  | e-retouch                                                                                      |
| aiVariation                | e-genvar                                                                                       |
| aiDropShadow               | e-dropshadow                                                                                   |
| aiChangeBackground         | e-changebg                                                                                     |
| crop                       | c                                                                                              |
| cropMode                   | cm                                                                                             |
| x                          | x                                                                                              |
| y                          | y                                                                                              |
| xCenter                    | xc                                                                                             |
| yCenter                    | yc                                                                                             |
| focus                      | fo                                                                                             |
| format                     | f                                                                                              |
| radius                     | r                                                                                              |
| background                 | bg                                                                                             |
| border                     | b                                                                                              |
| rotation                   | rt                                                                                             |
| blur                       | bl                                                                                             |
| named                      | n                                                                                              |
| dpr                        | dpr                                                                                            |
| progressive                | pr                                                                                             |
| lossless                   | lo                                                                                             |
| trim                       | t                                                                                              |
| metadata                   | md                                                                                             |
| colorProfile               | cp                                                                                             |
| defaultImage               | di                                                                                             |
| original                   | orig                                                                                           |
| videoCodec                 | vc                                                                                             |
| audioCodec                 | ac                                                                                             |
| grayscale                  | e-grayscale                                                                                    |
| contrastStretch            | e-contrast                                                                                     |
| shadow                     | e-shadow                                                                                       |
| sharpen                    | e-sharpen                                                                                      |
| unsharpMask                | e-usm                                                                                          |
| gradient                   | e-gradient                                                                                     |
| flip                       | fl                                                                                             |
| opacity                    | o                                                                                              |
| zoom                       | z                                                                                              |
| page                       | pg                                                                                             |
| startOffset                | so                                                                                             |
| endOffset                  | eo                                                                                             |
| duration                   | du                                                                                             |
| streamingResolutions       | sr                                                                                             |
| overlay                    | Generates the correct layer syntax for image, video, text, subtitle, and solid color overlays. |
| raw                        | The string provided in raw will be added in the URL as is.                                     |

### Handling Unsupported Transformations

If you specify a transformation parameter that is not explicitly supported by the SDK, it is added “as-is” in the generated URL. This provides flexibility for using new or custom transformations without waiting for an SDK update.

For example:
```js
var imageURL = imagekit.url({
    path: "/test_path.jpg",
    transformation: [{
        newparam: "cool"
    }]
});
// Generated URL: https://ik.imagekit.io/test_url_endpoint/test_path.jpg?tr=newparam-cool
```

## File Upload

The SDK offers a simple interface via the `.upload()` method to upload files to the ImageKit Media Library. This method requires the following:
- **file** (mandatory)
- **fileName** (mandatory)
- Security parameters: **signature**, **token**, and **expire**

Before invoking the upload, generate the necessary security parameters as per the [ImageKit Upload API documentation](https://imagekit.io/docs/api-reference/upload-file/upload-file#how-to-implement-client-side-file-upload).

### Upload Options
| Option                  | Description                                                                                                                                             | Example                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| file                    | The file content to be uploaded. Accepts binary, base64 string, or URL.                                                                                 | `file: fileInput.files[0]`                               |
| fileName                | The name to assign to the uploaded file. Supports alphanumeric characters, dot, underscore, and dash.                                                   | `fileName: "myImage.jpg"`                                |
| signature               | HMAC-SHA1 digest computed using the private API key. Must be calculated on the server side.                                                             | `signature: "generated_signature"`                       |
| token                   | A unique token to prevent duplicate upload retries. Typically a V4 UUID or similar unique string.                                                       | `token: "unique_upload_token"`                           |
| expire                  | Unix timestamp (in seconds) indicating the signature expiry time (should be within 1 hour).                                                             | `expire: 1616161616`                                     |
| useUniqueFileName       | Boolean flag to automatically generate a unique filename if set to true. Defaults to true.                                                              | `useUniqueFileName: true`                                |
| folder                  | The folder path where the file will be uploaded. Automatically creates nested folders if they don’t exist.                                              | `folder: "/images/uploads"`                              |
| isPrivateFile           | Boolean to mark the file as private, restricting access to the original file URL. Defaults to false.                                                    | `isPrivateFile: false`                                   |
| tags                    | Tags to associate with the file. Can be a comma-separated string or an array of tags.                                                                   | `tags: "summer,holiday"` or `tags: ["summer","holiday"]` |
| customCoordinates       | Specifies an area of interest in the image formatted as `x,y,width,height`.                                                                             | `customCoordinates: "10,10,100,100"`                     |
| responseFields          | Comma-separated list of fields to include in the upload response.                                                                                       | `responseFields: "tags,customCoordinates"`               |
| extensions              | Array of extension objects for additional image processing.                                                                                             | `extensions: [{ name: "auto-tagging" }]`                 |
| webhookUrl              | URL to which the final status of extension processing will be sent.                                                                                     | `webhookUrl: "https://example.com/webhook"`              |
| overwriteFile           | Boolean flag indicating whether to overwrite a file if it exists. Defaults to true.                                                                     | `overwriteFile: true`                                    |
| overwriteAITags         | Boolean flag to remove AITags from a file if overwritten. Defaults to true.                                                                             | `overwriteAITags: true`                                  |
| overwriteTags           | Boolean flag that determines if existing tags should be removed when new tags are not provided. Defaults to true when file is overwritten without tags. | `overwriteTags: true`                                    |
| overwriteCustomMetadata | Boolean flag dictating if existing custom metadata should be removed when not provided. Defaults to true under similar conditions as tags.              | `overwriteCustomMetadata: true`                          |
| customMetadata          | Stringified JSON or an object containing custom metadata key-value pairs to associate with the file.                                                    | `customMetadata: {author: "John Doe"}`                   |
| transformation          | Optional transformation object to apply during the upload process. It follows the same structure as in URL generation.                                  | `transformation: { pre: "w-200,h-200", post: [...] }`    |
| xhr                     | An optional XMLHttpRequest object provided to monitor upload progress.                                                                                  | `xhr: new XMLHttpRequest()`                              |
| checks                  | Optional string value for specifying server-side checks to run before file upload.                                                                      | `checks: "file.size' < '1MB'"`                           |

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

## Test Examples

For a quick demonstration of the SDK features, check the test suite:
- URL generation examples can be found in [basic.js](./test/url-generation/basic.js) and [overlay.js](./test/url-generation/overlay.js) files.
- File upload examples can be found in [test/upload.js](./test/upload.js).

## Changelog

For a detailed history of changes, please refer to [CHANGELOG.md](CHANGELOG.md).