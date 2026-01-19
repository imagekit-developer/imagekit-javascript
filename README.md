[<img width="250" alt="ImageKit.io" src="https://raw.githubusercontent.com/imagekit-developer/imagekit-javascript/master/assets/imagekit-light-logo.svg"/>](https://imagekit.io)

# ImageKit.io JavaScript SDK

![Node CI](https://github.com/imagekit-developer/imagekit-javascript/workflows/Node%20CI/badge.svg)
[![npm version](https://img.shields.io/npm/v/@imagekit/javascript)](https://www.npmjs.com/package/@imagekit/javascript) 
[![codecov](https://codecov.io/gh/imagekit-developer/imagekit-javascript/branch/master/graph/badge.svg)](https://codecov.io/gh/imagekit-developer/imagekit-javascript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Twitter Follow](https://img.shields.io/twitter/follow/imagekitio?label=Follow&style=social)](https://twitter.com/ImagekitIo)

This lightweight, dependency-free JavaScript SDK is designed specifically for browser use. It provides utility functions to generate image and video `src` URLs using [ImageKit transformations](https://imagekit.io/docs/transformations) and to upload files to the ImageKit media library.

For server-side applications with Node.js, please refer to our official [Node.js SDK](https://github.com/imagekit-developer/imagekit-nodejs).

## Installation

You can install the SDK in your project using npm or yarn.

```bash
npm install @imagekit/javascript
```

## Documentation

Refer to the ImageKit [official documentation](https://imagekit.io/docs/integration/javascript) for more details on how to use the SDK.

## TypeScript support

The SDK is written in TypeScript, offering first-class TypeScript support. Enjoy excellent type safety and IntelliSense in your IDE. You can use it in your TypeScript projects without any additional configuration.

To enable type checking in JavaScript projects, add `//@ts-check` at the top of your JavaScript files. This will activate type checking in your IDE.

### TypeScript and the SDK versioning policy

The TypeScript types in this SDK always reflect the latest shape of the ImageKit API. When we make improvements to the type definitions to better reflect the actual runtime behavior, we may release these changes in minor or patch versions. While these changes align types more closely with reality and are not breaking changes at runtime, they might cause new type errors when you upgrade.

We judge this approach to be better than the alternatives: outdated, inaccurate types, or vastly more frequent major releases that would distract from any truly breaking runtime changes. If you encounter type errors after upgrading, you can resolve them by:

- Adding appropriate type guards or assertions
- Updating your code to match the corrected types
- Using `// @ts-ignore` temporarily if you need more time to adjust

Please feel welcome to share your thoughts about the versioning policy in a GitHub issue.

## Changelog

For a detailed history of changes, refer to [CHANGELOG.md](CHANGELOG.md).
