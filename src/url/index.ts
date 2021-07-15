/*
    URL builder
*/
import { ImageKitOptions, UrlOptions } from "../interfaces";
import { buildURL } from "./builder";

export const url = (urlOpts: UrlOptions, defaultOptions: ImageKitOptions) => {
  return buildURL({
    ...defaultOptions,
    ...urlOpts,
  });
};
