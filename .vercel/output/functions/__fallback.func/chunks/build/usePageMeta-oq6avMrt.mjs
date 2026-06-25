import { u as useHead, a as useSeoMeta } from './composables-CFZojNAo.mjs';

function usePageMeta(options) {
  const get = () => typeof options === "function" ? options() : options;
  useHead({
    title: () => get().title,
    link: () => {
      const url = get().url;
      return url ? [{ rel: "canonical", href: url }] : [];
    }
  });
  useSeoMeta({
    title: () => get().title,
    description: () => get().description,
    keywords: () => get().keywords,
    ogTitle: () => get().title,
    ogDescription: () => get().description,
    ogUrl: () => get().url,
    ogImage: () => get().image,
    ogType: () => get().type || "website",
    twitterCard: "summary_large_image",
    twitterTitle: () => get().title,
    twitterDescription: () => get().description,
    twitterImage: () => get().image
  });
}

export { usePageMeta as u };
//# sourceMappingURL=usePageMeta-oq6avMrt.mjs.map
