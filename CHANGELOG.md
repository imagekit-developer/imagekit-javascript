# Changelog

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
