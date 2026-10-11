import { imageWithAlt } from "./image-with-alt";
import { page } from "./page";
import { siteSettings } from "./site-settings";

export const schemaTypes = [imageWithAlt, siteSettings, page];

/** Document types that exist once, at a fixed _id equal to the type name. */
export const singletonTypes = new Set(["siteSettings"]);
