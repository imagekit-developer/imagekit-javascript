import { TransformationPosition } from ".";

export interface ImageKitOptions {
  urlEndpoint: string;
  sdkVersion?: string;
  publicKey?: string;
  authenticationEndpoint?: string;
  transformationPosition?: TransformationPosition;
  apiVersion?: "v2" | "v1";
}