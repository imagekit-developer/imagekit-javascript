# Changelog

## [5.4.1](https://github.com/imagekit-developer/imagekit-javascript/compare/5.4.0...v5.4.1) (2026-06-01)


### Bug Fixes

* **ci:** use fine-grained PAT for creating PR ([d32b6ed](https://github.com/imagekit-developer/imagekit-javascript/commit/d32b6ed379b561636f612e6fe7db051460c99ea4))
* make safeBtoa browser-safe with UTF-8 handling ([cca89cf](https://github.com/imagekit-developer/imagekit-javascript/commit/cca89cfe9961606f871f1de23091f2e2a56c8370))
* **transformation:** improve safeBtoa for UTF-8 handling and add tests for Hindi characters ([1343333](https://github.com/imagekit-developer/imagekit-javascript/commit/134333325952329925a7711031ea9d9aa8f5ac4d))


### Chores

* add release automation workflows and configuration files ([efabbab](https://github.com/imagekit-developer/imagekit-javascript/commit/efabbab2b2e0d3852ee42f9431c7abdbfe913785))
* **deps:** remove unused babel and rollup plugins from devDependencies ([774bedf](https://github.com/imagekit-developer/imagekit-javascript/commit/774bedf3ad2569301994eb87a40d226720b47f5a))
* remove unused code blocks from the repository ([82a556b](https://github.com/imagekit-developer/imagekit-javascript/commit/82a556beabfb002701cc2b6a79f7fa7a03fb121c))

## Changelog

## Version 5.4.0 

1. **Enhancement:**
   - Added support for new crop modes: `maintain_ratio_no_enlarge`, `pad_resize_no_enlarge` and `pad_extract_no_shrink`
   - Added support for `colorize` transformation

## Version 5.3.0

1. **Enhancement:**
   - Added support for new overlay position parameters: `xCenter` (`lxc`), `yCenter` (`lyc`), and `anchorPoint` (`lap`) in overlay transformations

## Version 5.2.2

1. Updated TypeScript types to allow string values for the `dpr` parameter in transformations, enabling support for arithmetic expressions and dynamic DPR values.

## Version 5.2.1

1. **Bug fix:**
   - Updated subtitle overlay transformation parameter from `l-subtitle` to `l-subtitles` to align with API specification

## Version 5.2.0

1. **New transformation parameters added:**
   - `layerMode` (`lm`): Control layer blending modes in overlay transformations
   - `aiEdit` (`e-edit`): AI-powered image editing transformation
   - `colorReplace` (`cr`): Replace specific colors in images
   - `distort` (`e-distort`): Apply distortion effects to images

2. **Type definitions updated:**
   - Improved TypeScript types by synchronizing with the official Node.js SDK
   - Enhanced type safety for transformation options, upload options, and responses

3. **Documentation improvements:**
   - Added TypeScript versioning policy section to README
   - Clarified how type definition improvements may be released in minor/patch versions

_No runtime breaking changes from 5.1.x._

## Version 5.1.0

1. **New helper** `getResponsiveImageAttributes()`  
  Generates ready‑to‑use `src`, `srcSet`, and `sizes` for responsive `<img>` tags (breakpoint pruning, DPR 1×/2×, custom breakpoints, no up‑scaling).
2. Added exports:  
  `getResponsiveImageAttributes`, `GetImageAttributesOptions`, `ResponsiveImageAttributes`.

_No breaking changes from 5.0.x._

## Version 5.0.0

This version introduces major breaking changes, for usage examples, refer to the [official documentation](https://imagekit.io/docs/integration/javascript).

1. The package has been renamed from `imagekit-javascript` to `@imagekit/javascript`.  
   Please update your dependency references and import statements accordingly.

2. The default-exported `ImageKit` class has been removed and replaced with named exports:  
   - `buildSrc`  
   - `buildTransformationString`  
   - `upload`  
   - Error classes: `ImageKitInvalidRequestError`, `ImageKitAbortError`, `ImageKitUploadNetworkError`, `ImageKitServerError`  
   
   Update your imports to use these named exports.

3. The `upload` method supports `AbortSignal` for canceling uploads.  
   Upload error handling has been revamped, and `onProgress` callbacks are now supported.  
   Only the Promise-based syntax is supported. Callback style usage has been removed.

4. Several internal interfaces (e.g., `ImageKitOptions`, `IKResponse`) have been updated or removed.  
   The upload options now require a `publicKey`, and a new `SrcOptions` interface has been introduced.

---

## Version 4.0.1

### Bug Fixes

1. Fixed overlay position x,y issue.

---

## Version 4.0.0

### Breaking Changes

1. The default value for `transformationPosition` is now `query` instead of `path`. This change enables wildcard cache purging to remove CDN cache for all generated transformations.

   **Action Required:**  
   If you're using the `transformationPosition` parameter in the `url` method and want to apply transformations in the path, you must now explicitly set the value to `path`. The default is `query`.

2. Removed the following deprecated parameters:  
   `effectSharpen`, `effectUSM`, `effectContrast`, `effectGray`, `effectShadow`, `effectGradient`, and `rotate`.

### Other Changes

1. Native support for overlays has been added. See the README for usage examples.
2. New AI-powered transformations are now supported:  
   `aiRemoveBackground`, `aiUpscale`, `aiVariation`, `aiDropShadow`, `aiChangeBackground`, and more.  
   *(Introduced in version 3.1.0)*

---

## SDK Version 3.0.0

### Breaking Changes

- **Overlay Syntax Update**  
  In version 3.0.0, the old overlay syntax parameters for transformations (e.g., `oi`, `ot`, `obg`, and others as detailed [here](https://imagekit.io/docs/add-overlays-on-images)) have been removed. These parameters are deprecated and will now return errors when used in URLs.

  **Action Required:**  
  Migrate to the new layers syntax which supports overlay nesting, offers improved positional control, and allows more transformations at the layer level. For a quick start, refer to the [examples](https://imagekit.io/docs/add-overlays-on-images). Use the `raw` transformation parameter to implement this migration.

---

## SDK Version 2.0.0

### Breaking Changes

- **Authentication Process Update**  
  Previously, client-side file uploads required the SDK to be initialized with both the `publicKey` and `authenticationEndpoint` to fetch security parameters (`signature`, `token`, and `expire`).

  **Action Required:**  
  With version 2.0.0, you must now generate the security parameters (`signature`, `token`, and `expire`) yourself, eliminating the need for the `authenticationEndpoint`. When invoking the SDK's upload method, be sure to include these parameters along with other [upload options](https://imagekit.io/docs/api-reference/upload-file/upload-file#Request). For further details, consult the documentation [here](https://imagekit.io/docs/api-reference/upload-file/upload-file#how-to-implement-client-side-file-upload).
