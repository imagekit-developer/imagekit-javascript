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
Or for the latest version, remove the version number:
```
https://unpkg.com/imagekit-javascript/dist/imagekit.min.js
```
And include it in your HTML:
```html
<script type="text/javascript" src="https://unpkg.com/imagekit-javascript/dist/imagekit.min.js"></script>
```

## Initialization

Initialize the SDK by specifying your URL endpoint. You can obtain your URL endpoint from [https://imagekit.io/dashboard/url-endpoints](https://imagekit.io/dashboard/url-endpoints) and your public API key from [https://imagekit.io/dashboard/developer/api-keys](https://imagekit.io/dashboard/developer/api-keys). For URL generation:
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
            height: 300,
            width: 400
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
            height: 300,
            width: 400
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
        height: 300,
        width: 400
    }, {
        rotation: 90
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

The table below outlines the available overlay configuration options:

| Option         | Description                                                                                                                                                                                                                                                                                                                                                                                                      | Example                                                         |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| type           | Specifies the type of overlay. Supported values: `text`, `image`, `video`, `subtitle`, `solidColor`.                                                                                                                                                                                                                                                                                                             | `type: "text"`                                                  |
| text           | (For text overlays) The text content to display.                                                                                                                                                                                                                                                                                                                                                                 | `text: "ImageKit"`                                              |
| input          | (For image, video, or subtitle overlays) Relative path to the overlay asset.                                                                                                                                                                                                                                                                                                                                     | `input: "logo.png"` or `input: "overlay-video.mp4"`             |
| color          | (For solidColor overlays) RGB/RGBA hex code or color name for the overlay color.                                                                                                                                                                                                                                                                                                                                 | `color: "FF0000"`                                               |
| encoding       | Defines how the overlay input is encoded. Accepted values: `auto`, `plain`, `base64`.                                                                                                                                                                                                                                                                                                                            | `encoding: "auto"`                                              |
| transformation | An array of transformation objects to style the overlay. <br> - [Text Overlay Transformations](#text-overlay-transformations) <br> - [Subtitle Overlay Transformations](#subtitle-overlay-transformations) <br> - Image and video overlays support most [transformations](#supported-transformations). <br> See [ImageKit docs](https://imagekit.io/docs/transformations#overlay-using-layers) for more details. | `transformation: [{ fontSize: 50 }]`                            |
| position       | Sets the overlay’s position relative to the base asset. Accepts an object with `x`, `y`, or `focus` (e.g., `center`).                                                                                                                                                                                                                                                                                            | `position: { x: 10, y: 20 }` or `position: { focus: "center" }` |
| timing         | (When base is a video) Defines when the overlay appears. Accepts an object with `start`, `duration`, and `end` properties (in seconds).                                                                                                                                                                                                                                                                          | `timing: { start: 5, duration: 10 }`                            |


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

Below is a table describing these options:

| Option   | Description                                                                                  | Use Case                                                      |
| -------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `auto`   | SDK automatically selects between plain and base64 encoding based on the input.              | Best for most cases when unsure or input is simple.           |
| `plain`  | SDK treats the input as plain text.                                                          | Use for inputs that are already URL-safe.                     |
| `base64` | SDK encodes the input using Base64 to ensure URL safety when special characters are present. | Use for complex inputs with characters that require encoding. |

##### Solid Color Overlay Transformations

| Option | Description                                                                                                                        | Example         |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| width  | Specifies the width of the solid color overlay block (in pixels or as an arithmetic expression).                                   | `width: 100`    |
| height | Specifies the height of the solid color overlay block (in pixels or as an arithmetic expression).                                  | `height: 50`    |
| radius | Specifies the corner radius of the solid color overlay block or shape. Can be a number or `"max"` for circular/oval shapes.        | `radius: "max"` |
| alpha  | Specifies the transparency level of the solid color overlay. Supports integers from 1 (most transparent) to 9 (least transparent). | `alpha: 5`      |

##### Text Overlay Transformations

| Option           | Description                                                                                                                                                                                                                                                                      | Example                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `width`          | Specifies the maximum width (in pixels) of the overlaid text. The text wraps automatically, and arithmetic expressions (e.g., `bw_mul_0.2` or `bh_div_2`) are supported.                                                                                                         | `width: 400`               |
| `fontSize`       | Specifies the font size of the overlaid text. Accepts a numeric value or an arithmetic expression.                                                                                                                                                                               | `fontSize: 50`             |
| `fontFamily`     | Specifies the font family of the overlaid text. Choose from the [supported fonts list](https://imagekit.io/docs/add-overlays-on-images#supported-text-font-list) or provide a [custom font](https://imagekit.io/docs/add-overlays-on-images#change-font-family-in-text-overlay). | `fontFamily: "Arial"`      |
| `fontColor`      | Specifies the font color of the overlaid text. Accepts an RGB hex code (e.g., `FF0000`), an RGBA code (e.g., `FFAABB50`), or a standard color name.                                                                                                                              | `fontColor: "FF0000"`      |
| `innerAlignment` | Specifies the inner alignment of the text when the content does not occupy the full width. Supported values: `left`, `right`, `center`.                                                                                                                                          | `innerAlignment: "center"` |
| `padding`        | Specifies the padding around the text overlay. Can be a single integer or multiple values separated by underscores; arithmetic expressions are accepted.                                                                                                                         | `padding: 10`              |
| `alpha`          | Specifies the transparency level of the text overlay. Accepts an integer between `1` and `9`.                                                                                                                                                                                    | `alpha: 5`                 |
| `typography`     | Specifies the typography style of the text. Supported values: `b` for bold, `i` for italics, `b_i` for both bold and italics.                                                                                                                                                    | `typography: "b"`          |
| `background`     | Specifies the background color of the text overlay. Accepts an RGB hex code (e.g., `FF0000`), an RGBA code (e.g., `FFAABB50`), or a color name.                                                                                                                                  | `background: "red"`        |
| `radius`         | Specifies the corner radius of the text overlay. Accepts a numeric value or `max` to achieve a circular/oval shape.                                                                                                                                                              | `radius: "max"`            |
| `rotation`       | Specifies the rotation angle of the text overlay. Accepts a numeric value for clockwise rotation or a string prefixed with `N` for counterclockwise rotation.                                                                                                                    | `rotation: 90`             |
| `flip`           | Specifies the flip or mirror option for the text overlay. Supported values: `h` (horizontal), `v` (vertical), `h_v` (both horizontal and vertical), `v_h` (alternative order).                                                                                                   | `flip: "h"`                |
| `lineHeight`     | Specifies the line height for multi-line text. Accepts a numeric value or an arithmetic expression.                                                                                                                                                                              | `lineHeight: 1.5`          |

##### Subtitle Overlay Transformations

| Option        | Description                                                                                                                                                                                                                          | Example                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| `background`  | Specifies the subtitle background color using a standard color name, an RGB color code (e.g., `FF0000`), or an RGBA color code (e.g., `FFAABB50`).                                                                                   | `background: "blue"`    |
| `fontSize`    | Sets the font size of subtitle text. Can be specified as a number.                                                                                                                                                                   | `fontSize: 16`          |
| `fontFamily`  | Sets the font family of subtitle text. Refer to the [supported fonts list](https://imagekit.io/docs/add-overlays-on-images#supported-text-font-list) for available options.                                                          | `fontFamily: "Arial"`   |
| `color`       | Specifies the font color of the subtitle text using a standard color name, an RGB color code (e.g., `FF0000`), or an RGBA color code (e.g., `FFAABB50`).                                                                             | `color: "FF0000"`       |
| `typography`  | Sets the typography style of the subtitle text. Supported values: `b` for bold, `i` for italics, and `b_i` for bold with italics.                                                                                                    | `typography: "b"`       |
| `fontOutline` | Specifies the font outline for subtitles. Requires the outline width (an integer) and the outline color (as a standard color name, RGB, or RGBA) separated by an underscore. Examples include `2_blue`, `2_A1CCDD`, or `2_A1CCDD50`. | `fontOutline: "2_blue"` |
| `fontShadow`  | Specifies the font shadow for subtitles. Requires the shadow color (as a standard color name, RGB, or RGBA) and a shadow indent (an integer) separated by an underscore. Examples: `blue_2`, `A1CCDD_3`, or `A1CCDD50_3`.            | `fontShadow: "blue_2"`  |

For image and video overlay transformation options, refer to the [ImageKit Transformations Documentation](https://imagekit.io/docs/transformations).

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

The SDK gives a name to each transformation parameter e.g. height for h and width for w parameter. It makes your code more readable. If the property does not match any of the following supported options, it is added as it is.

If you want to generate transformations in your application and add them to the URL as it is, use the raw parameter.

Check ImageKit [transformation documentation](https://imagekit.io/docs/transformations) for more details.

| Transformation Name        | URL Parameter                                                 |
| -------------------------- | ------------------------------------------------------------- |
| width                      | w                                                             |
| height                     | h                                                             |
| aspectRatio                | ar                                                            |
| quality                    | q                                                             |
| aiRemoveBackground         | e-bgremove (ImageKit powered)                                 |
| aiRemoveBackgroundExternal | e-removedotbg (Using third party)                             |
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
| flip                       | fl                                                            |
| opacity                    | o                                                             |
| zoom                       | z                                                             |
| page                       | pg                                                            |
| startOffset                | so                                                            |
| endOffset                  | eo                                                            |
| duration                   | du                                                            |
| streamingResolutions       | sr                                                            |
| raw                        | The string provided in raw will be added in the URL as it is. |

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
// Generated URL: https://ik.imagekit.io/test_url_endpoint/tr:newparam-cool/test_path.jpg
```

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

## Test Examples

For a quick demonstration of the SDK features, refer to our test examples:
- URL Generation examples can be found in [test/url-generation.js](./test/url-generation.js)
- File Upload examples can be found in [test/upload.js](./test/upload.js)

## Changelog

For a detailed history of changes, please refer to [CHANGELOG.md](CHANGELOG.md).
