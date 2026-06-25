import { b as apiConfig } from './AppHeader-CiIf_B2g.mjs';

const stripLeadingSlashes = (value) => value.replace(/^\/+/, "");
const resolveAssetUrl = (imageUrl) => {
  const rawValue = imageUrl?.trim();
  if (!rawValue) {
    return null;
  }
  if (rawValue.startsWith("https://") || rawValue.startsWith("http://")) {
    return rawValue;
  }
  const baseUrl = apiConfig.imageBaseUrl?.trim();
  if (!baseUrl) {
    return rawValue;
  }
  return `${baseUrl}/${stripLeadingSlashes(rawValue)}`;
};

export { resolveAssetUrl as r };
//# sourceMappingURL=assetUrl-BkGibEdX.mjs.map
