export default {
  MISSING_UPLOAD_FILE_PARAMETER: { message: "Missing file parameter for upload" },
  MISSING_UPLOAD_FILENAME_PARAMETER: { message: "Missing fileName parameter for upload" },
  MISSING_PUBLIC_KEY: { message: "Missing public key for upload" },
  UPLOAD_ENDPOINT_NETWORK_ERROR: {
    message: "Request to ImageKit upload endpoint failed due to network error"
  },
  MISSING_SIGNATURE: { message: "Missing signature for upload. The SDK expects token, signature and expire for authentication." },
  MISSING_TOKEN: { message: "Missing token for upload. The SDK expects token, signature and expire for authentication." },
  MISSING_EXPIRE: { message: "Missing expire for upload. The SDK expects token, signature and expire for authentication." },
  INVALID_TRANSFORMATION: { message: "Invalid transformation parameter. Please include at least pre, post, or both." },
  INVALID_PRE_TRANSFORMATION: { message: "Invalid pre transformation parameter." },
  INVALID_POST_TRANSFORMATION: { message: "Invalid post transformation parameter." }
};
