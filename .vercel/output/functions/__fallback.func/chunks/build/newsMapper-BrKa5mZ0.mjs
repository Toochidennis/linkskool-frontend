import { a as apiRequest } from './client-DcOxoYBd.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import { s as sanitizeHtml } from './sanitizeHtml-jsTyqf9a.mjs';

const newsService = {
  async getAllNews(options = {}) {
    const params = new URLSearchParams();
    if (options.page) {
      params.set("page", String(options.page));
    }
    if (options.limit) {
      params.set("limit", String(options.limit));
    }
    const query = params.toString();
    const response = await apiRequest(`news/list${query ? `?${query}` : ""}`, {
      method: "GET",
      signal: options.signal
    });
    return response.data;
  },
  async getNewsBySlug(slug, signal) {
    const response = await apiRequest(`news/slug/${slug}`, {
      method: "GET",
      signal
    });
    return response.data;
  }
};
const adsenseConfig = {
  clientId: "ca-pub-xxxxxxxxxxxxxxxx"?.trim() ?? "",
  slots: {
    newsTop: ""?.trim() ?? "",
    newsInline: ""?.trim() ?? "",
    newsBottom: ""?.trim() ?? "",
    newsDetailHero: ""?.trim() ?? "",
    newsDetailTop: ""?.trim() ?? "",
    newsDetail: ""?.trim() ?? "",
    newsDetailBottom: ""?.trim() ?? ""
  }
};
const isAdsenseConfigured = Boolean(adsenseConfig.clientId);
const useAdsense = () => {
  const requestAd = () => {
    {
      return;
    }
  };
  return {
    isAdsenseConfigured,
    requestAd
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AdSenseSlot",
  __ssrInlineRender: true,
  props: {
    slot: {},
    format: { default: "auto" },
    layout: {},
    fullWidthResponsive: { type: Boolean, default: true },
    label: { default: "Advertisement" }
  },
  setup(__props) {
    const props = __props;
    const { isAdsenseConfigured: isAdsenseConfigured2 } = useAdsense();
    const canRenderAd = computed(() => Boolean(isAdsenseConfigured2 && props.slot));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<aside${ssrRenderAttrs(mergeProps({ class: "ad-slot rounded-md border border-dashed border-gray-200 bg-white/80 p-3" }, _attrs))} data-v-5987bdee><p class="mb-2 text-center text-[10px] font-bold uppercase tracking-wide text-gray-400" data-v-5987bdee>${ssrInterpolate(__props.label)}</p>`);
      if (canRenderAd.value) {
        _push(`<ins class="adsbygoogle block min-h-24"${ssrRenderAttr("data-ad-client", unref(adsenseConfig).clientId)}${ssrRenderAttr("data-ad-slot", __props.slot)}${ssrRenderAttr("data-ad-format", __props.format)}${ssrRenderAttr("data-ad-layout", __props.layout)}${ssrRenderAttr("data-full-width-responsive", String(__props.fullWidthResponsive))} data-v-5987bdee></ins>`);
      } else {
        _push(`<div class="flex min-h-24 items-center justify-center rounded-md bg-gray-50 text-xs font-semibold text-gray-400" data-v-5987bdee> Ad space </div>`);
      }
      _push(`</aside>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdSenseSlot.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AdSenseSlot = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-5987bdee"]]), { __name: "AdSenseSlot" });
const defaultFallbackImage = "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80";
const fallbackImages = [
  defaultFallbackImage,
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80"
];
const accentByIndex = ["blue", "orange", "green", "violet", "rose"];
const decodeText = (value) => {
  {
    return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  }
};
const normalizeContent = (content) => decodeText(content).replace(/<[^>]*>/g, " ").replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim();
const buildBody = (content) => normalizeContent(content).split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
const buildSummary = (content) => {
  const body = buildBody(content);
  const firstParagraph = body[0] ?? "";
  if (firstParagraph.length <= 180) {
    return firstParagraph;
  }
  return `${firstParagraph.slice(0, 177).trimEnd()}...`;
};
const urlPattern = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;
const escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const splitTrailingPunctuation = (value) => {
  const match = value.match(/^(.+?)([.,;:!?)]*)$/);
  return {
    url: match?.[1] ?? value,
    trailing: match?.[2] ?? ""
  };
};
const linkifyPlainText = (value) => escapeHtml(value).replace(urlPattern, (match) => {
  const { url, trailing } = splitTrailingPunctuation(match);
  const href = url.startsWith("http") ? url : `https://${url}`;
  return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>${trailing}`;
});
const linkifyHtml = (html) => {
  {
    return html;
  }
};
const buildContentHtml = (content) => {
  const decodedContent = decodeText(content);
  const htmlContent = /<\/?[a-z][\s\S]*>/i.test(decodedContent) ? decodedContent : decodedContent.split(/\n{2,}/).map((paragraph) => `<p>${linkifyPlainText(paragraph.trim()).replace(/\n/g, "<br>")}</p>`).join("");
  const sanitizedHtml = sanitizeHtml(htmlContent, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel"]
  });
  return linkifyHtml(sanitizedHtml);
};
const resolveCategory = (item, category) => {
  if (category) {
    return category;
  }
  const title = `${item.title} ${item.content}`.toLowerCase();
  if (title.includes("scholarship") || title.includes("application") || title.includes("training")) {
    return "Opportunities";
  }
  if (title.includes("linkskool")) {
    return "Campus";
  }
  return "Top Stories";
};
const resolveSize = (index) => {
  const pattern = [
    "horizontal",
    "square",
    "square",
    "square",
    "square",
    "square",
    "square",
    "square",
    "square",
    "horizontal"
  ];
  return pattern[index % pattern.length] ?? "square";
};
const mapApiNewsToCard = (item, index, category) => {
  const images = item.images.map((image) => ({
    url: image.url,
    alt: decodeText(item.title)
  })).filter((image) => Boolean(image.url));
  const imageUrl = images[0]?.url || fallbackImages[index % fallbackImages.length] || defaultFallbackImage;
  return {
    id: item.id,
    slug: item.slug,
    title: decodeText(item.title),
    summary: buildSummary(item.content),
    body: buildBody(item.content),
    contentHtml: buildContentHtml(item.content),
    category: resolveCategory(item, category),
    source: item.authorName,
    publishedAt: item.datePosted,
    readTime: `${item.readTime} min read`,
    imageUrl,
    imageAlt: decodeText(item.title),
    images: images.length > 0 ? images : [{ url: imageUrl, alt: decodeText(item.title) }],
    size: resolveSize(index),
    accent: accentByIndex[index % accentByIndex.length] ?? "blue"
  };
};
const mapApiRelatedNewsToCard = (item, index) => {
  const imageUrl = item.images?.[0]?.url || fallbackImages[index % fallbackImages.length] || defaultFallbackImage;
  const title = decodeText(item.title);
  return {
    id: item.id,
    slug: item.slug,
    title,
    summary: "",
    body: [],
    contentHtml: "",
    category: "More",
    source: item.authorName,
    publishedAt: item.datePosted,
    readTime: "",
    imageUrl,
    imageAlt: title,
    images: item.images.map((image) => ({ url: image.url, alt: title })).filter((image) => Boolean(image.url)),
    size: resolveSize(index),
    accent: accentByIndex[index % accentByIndex.length] ?? "blue"
  };
};

export { AdSenseSlot as A, adsenseConfig as a, mapApiRelatedNewsToCard as b, mapApiNewsToCard as m, newsService as n };
//# sourceMappingURL=newsMapper-BrKa5mZ0.mjs.map
