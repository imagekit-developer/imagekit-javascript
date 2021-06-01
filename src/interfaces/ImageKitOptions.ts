import { TransformationPosition } from ".";

export interface ImageKitOptions {
  sdkVersion: string;
  publicKey: string;
  urlEndpoint: string;
  authenticationEndpoint?: string;
  transformationPosition: TransformationPosition;
}