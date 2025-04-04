export default {
  MANDATORY_INITIALIZATION_MISSING: { message: "Missing urlEndpoint during SDK initialization" },
  INVALID_TRANSFORMATION_POSITION: { message: "Invalid transformationPosition parameter" },
  PRIVATE_KEY_CLIENT_SIDE: { message: "privateKey should not be passed on the client side" },
  MISSING_UPLOAD_DATA: { message: "Missing data for upload" },
  MISSING_UPLOAD_FILE_PARAMETER: { message: "Missing file parameter for upload" },
  MISSING_UPLOAD_FILENAME_PARAMETER: { message: "Missing fileName parameter for upload" },
  MISSING_AUTHENTICATION_ENDPOINT: { message: "Missing authentication endpoint for upload" },
  MISSING_PUBLIC_KEY: { message: "Missing public key for upload" },
  AUTH_ENDPOINT_TIMEOUT: { message: "The authenticationEndpoint you provided timed out in 60 seconds" },
  AUTH_ENDPOINT_NETWORK_ERROR: { message: "Request to authenticationEndpoint failed due to network error" },
  AUTH_INVALID_RESPONSE: { message: "Invalid response from authenticationEndpoint. The SDK expects a JSON response with three fields i.e. signature, token and expire." },
  UPLOAD_ENDPOINT_NETWORK_ERROR: {
    message: "Request to ImageKit upload endpoint failed due to network error"
  },
  INVALID_UPLOAD_OPTIONS: { message: "Invalid uploadOptions parameter" },
  MISSING_SIGNATURE: { message: "Missing signature for upload. The SDK expects token, signature and expire for authentication." },
  MISSING_TOKEN: { message: "Missing token for upload. The SDK expects token, signature and expire for authentication." },
  MISSING_EXPIRE: { message: "Missing expire for upload. The SDK expects token, signature and expire for authentication." },
  INVALID_TRANSFORMATION: { message: "Invalid transformation parameter. Please include at least pre, post, or both." },
  INVALID_PRE_TRANSFORMATION: { message: "Invalid pre transformation parameter." },
  INVALID_POST_TRANSFORMATION: { message: "Invalid post transformation parameter." },
  UPLOAD_ABORTED: { message: "Request aborted by the user" },
};
