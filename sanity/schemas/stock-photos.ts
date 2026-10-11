import { unsplashAssetSource } from "sanity-plugin-asset-source-unsplash";

/**
 * Field options that add Unsplash stock-photo search next to the normal
 * upload. Only for decorative photos (covers, heroes, social images), not for
 * the logo or photos of real people, which must be real.
 */
export const withStockPhotos = {
  hotspot: true,
  sources: [unsplashAssetSource],
};
