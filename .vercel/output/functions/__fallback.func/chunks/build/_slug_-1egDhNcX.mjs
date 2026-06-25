import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, ref, watch, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { useRoute, RouterLink } from 'vue-router';
import { A as AdSenseSlot, a as adsenseConfig, n as newsService, m as mapApiNewsToCard, b as mapApiRelatedNewsToCard } from './newsMapper-BrKa5mZ0.mjs';
import { A as AppHeader, a as AppFooter } from './AppHeader-CiIf_B2g.mjs';
import { _ as _export_sfc, d as useAsyncData } from './server.mjs';
import { u as usePageMeta } from './usePageMeta-oq6avMrt.mjs';
import { u as useHead } from './composables-CFZojNAo.mjs';
import './client-DcOxoYBd.mjs';
import './sanitizeHtml-jsTyqf9a.mjs';
import 'dompurify';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import '@vue/shared';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "NewsImageCarousel",
  __ssrInlineRender: true,
  props: {
    images: {}
  },
  setup(__props) {
    const props = __props;
    const activeIndex = ref(0);
    const activeImage = computed(() => props.images[activeIndex.value] ?? props.images[0]);
    const hasMultipleImages = computed(() => props.images.length > 1);
    watch(
      () => props.images,
      () => {
        activeIndex.value = 0;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      if (activeImage.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-8" }, _attrs))}><div class="relative h-[22rem] overflow-hidden rounded-md bg-gray-100 md:h-[30rem]"><img${ssrRenderAttr("src", activeImage.value.url)}${ssrRenderAttr("alt", activeImage.value.alt)} class="h-full w-full object-cover">`);
        if (hasMultipleImages.value) {
          _push(`<!--[--><button type="button" class="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-white/90 text-slate-900 shadow-sm transition hover:bg-white cursor-pointer" aria-label="Previous image"><i class="fa-solid fa-chevron-left text-sm"></i></button><button type="button" class="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md bg-white/90 text-slate-900 shadow-sm transition hover:bg-white cursor-pointer" aria-label="Next image"><i class="fa-solid fa-chevron-right text-sm"></i></button><div class="absolute bottom-4 right-4 rounded-md bg-slate-950/80 px-3 py-1 text-xs font-bold text-white">${ssrInterpolate(activeIndex.value + 1)} / ${ssrInterpolate(__props.images.length)}</div><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NewsImageCarousel.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const NewsImageCarousel = Object.assign(_sfc_main$2, { __name: "NewsImageCarousel" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "NewsList",
  __ssrInlineRender: true,
  props: {
    newsItems: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.newsItems, (item) => {
        _push(ssrRenderComponent(unref(RouterLink), {
          key: item.id,
          to: `/news/${item.slug}`,
          class: "group grid grid-cols-[7rem_minmax(0,1fr)] overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", item.imageUrl)}${ssrRenderAttr("alt", item.imageAlt)} class="h-full min-h-32 w-full object-cover" loading="lazy"${_scopeId}><div class="flex min-w-0 flex-col justify-between p-4"${_scopeId}><div class="space-y-2"${_scopeId}><span class="text-[11px] font-bold uppercase tracking-wide text-blue-700"${_scopeId}>${ssrInterpolate(item.category)}</span><h3 class="line-clamp-2 text-sm font-black leading-snug text-slate-950 group-hover:text-blue-700"${_scopeId}>${ssrInterpolate(item.title)}</h3><p class="line-clamp-2 text-xs leading-5 text-slate-600"${_scopeId}>${ssrInterpolate(item.summary)}</p></div></div>`);
            } else {
              return [
                createVNode("img", {
                  src: item.imageUrl,
                  alt: item.imageAlt,
                  class: "h-full min-h-32 w-full object-cover",
                  loading: "lazy"
                }, null, 8, ["src", "alt"]),
                createVNode("div", { class: "flex min-w-0 flex-col justify-between p-4" }, [
                  createVNode("div", { class: "space-y-2" }, [
                    createVNode("span", { class: "text-[11px] font-bold uppercase tracking-wide text-blue-700" }, toDisplayString(item.category), 1),
                    createVNode("h3", { class: "line-clamp-2 text-sm font-black leading-snug text-slate-950 group-hover:text-blue-700" }, toDisplayString(item.title), 1),
                    createVNode("p", { class: "line-clamp-2 text-xs leading-5 text-slate-600" }, toDisplayString(item.summary), 1)
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NewsList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const NewsList = Object.assign(_sfc_main$1, { __name: "NewsList" });
const useNewsDetail = (slug) => {
  const { data, pending, error } = useAsyncData(
    () => `news-detail-${slug.value}`,
    () => newsService.getNewsBySlug(slug.value),
    { watch: [slug] }
  );
  const article = computed(() => {
    if (!data.value) {
      return null;
    }
    const category = data.value.news.categories?.[0]?.name;
    return mapApiNewsToCard(data.value.news, 0, category);
  });
  const relatedNews = computed(
    () => data.value?.more.map((item, index) => mapApiRelatedNewsToCard(item, index)) ?? []
  );
  const articleImages = computed(() => article.value?.images ?? []);
  const articleError = computed(() => error.value ? "Unable to load this story right now." : "");
  return {
    article,
    articleError,
    articleImages,
    isLoadingArticle: pending,
    relatedNews
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slug = computed(() => {
      const rawSlug = route.params.slug;
      return Array.isArray(rawSlug) ? rawSlug[0] ?? "" : rawSlug ?? "";
    });
    const { article, articleError, articleImages, isLoadingArticle, relatedNews } = useNewsDetail(slug);
    usePageMeta(() => ({
      title: article.value ? `${article.value.title} - LinkSkool News` : "News story - LinkSkool",
      description: article.value?.summary ?? "Read LinkSkool news, opportunities, and stories.",
      keywords: "LinkSkool news, education news, opportunities, career insights, learning community",
      url: article.value ? `https://linkskool.com/news/${article.value.slug}` : "https://linkskool.com/news",
      image: article.value?.imageUrl ?? "https://linkskool.com/assets/og-image.png",
      type: "article"
    }));
    useHead(() => ({
      script: article.value ? [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: article.value.title,
            description: article.value.summary,
            image: article.value.imageUrl ? [article.value.imageUrl] : void 0,
            articleSection: article.value.category,
            author: { "@type": "Organization", name: article.value.source || "Linkskool" },
            publisher: {
              "@type": "Organization",
              name: "Linkskool",
              logo: { "@type": "ImageObject", url: "https://linkskool.com/assets/og-image.png" }
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://linkskool.com/news/${article.value.slug}`
            }
          })
        }
      ] : []
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-3a0e1df1>`);
      _push(ssrRenderComponent(AppHeader, null, null, _parent));
      _push(`<main class="pt-24" data-v-3a0e1df1>`);
      if (unref(isLoadingArticle)) {
        _push(`<section class="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8" data-v-3a0e1df1><div class="mb-8 h-5 w-32 animate-pulse rounded bg-gray-200" data-v-3a0e1df1></div><div class="space-y-5" data-v-3a0e1df1><div class="h-6 w-24 animate-pulse rounded-md bg-gray-200" data-v-3a0e1df1></div><div class="h-12 w-full animate-pulse rounded bg-gray-200" data-v-3a0e1df1></div><div class="h-12 w-4/5 animate-pulse rounded bg-gray-200" data-v-3a0e1df1></div><div class="h-6 w-2/3 animate-pulse rounded bg-gray-100" data-v-3a0e1df1></div><div class="h-[24rem] animate-pulse rounded-md bg-gray-200" data-v-3a0e1df1></div></div></section>`);
      } else if (unref(article)) {
        _push(`<section class="pb-16" data-v-3a0e1df1><div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8" data-v-3a0e1df1>`);
        _push(ssrRenderComponent(unref(RouterLink), {
          to: "/news",
          class: "mb-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="fa-solid fa-arrow-left text-xs" data-v-3a0e1df1${_scopeId}></i> Back to News `);
            } else {
              return [
                createVNode("i", { class: "fa-solid fa-arrow-left text-xs" }),
                createTextVNode(" Back to News ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<article data-v-3a0e1df1><div class="space-y-5" data-v-3a0e1df1><div class="inline-flex rounded-md bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white" data-v-3a0e1df1>${ssrInterpolate(unref(article).category)}</div><h1 class="text-3xl font-black leading-tight text-slate-950 sm:text-5xl" data-v-3a0e1df1>${ssrInterpolate(unref(article).title)}</h1><p class="text-lg leading-8 text-slate-600" data-v-3a0e1df1>${ssrInterpolate(unref(article).summary)}</p><div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-slate-500" data-v-3a0e1df1><span data-v-3a0e1df1>${ssrInterpolate(unref(article).source)}</span><span class="h-1 w-1 rounded-full bg-slate-300" data-v-3a0e1df1></span><span data-v-3a0e1df1>${ssrInterpolate(unref(article).publishedAt)}</span><span class="h-1 w-1 rounded-full bg-slate-300" data-v-3a0e1df1></span><span data-v-3a0e1df1>${ssrInterpolate(unref(article).readTime)}</span></div></div>`);
        _push(ssrRenderComponent(AdSenseSlot, {
          class: "mt-8",
          slot: unref(adsenseConfig).slots.newsDetailHero
        }, null, _parent));
        _push(ssrRenderComponent(NewsImageCarousel, { images: unref(articleImages) }, null, _parent));
        _push(ssrRenderComponent(AdSenseSlot, {
          class: "mt-8",
          slot: unref(adsenseConfig).slots.newsDetailTop
        }, null, _parent));
        if (unref(article).contentHtml) {
          _push(`<div class="news-content mt-8 border-t border-gray-200 pt-8 text-base leading-8 text-slate-700" data-v-3a0e1df1>${unref(article).contentHtml ?? ""}</div>`);
        } else {
          _push(`<div class="mt-8 space-y-5 border-t border-gray-200 pt-8" data-v-3a0e1df1><!--[-->`);
          ssrRenderList(unref(article).body, (paragraph) => {
            _push(`<p class="text-base leading-8 text-slate-700" data-v-3a0e1df1>${ssrInterpolate(paragraph)}</p>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(ssrRenderComponent(AdSenseSlot, {
          class: "mt-10",
          slot: unref(adsenseConfig).slots.newsDetail
        }, null, _parent));
        _push(`</article></div></section>`);
      } else {
        _push(`<section class="mx-auto max-w-3xl px-4 pb-16 pt-10 text-center sm:px-6 lg:px-8" data-v-3a0e1df1><h1 class="text-3xl font-black text-slate-950" data-v-3a0e1df1>News story not found</h1><p class="mt-3 text-slate-600" data-v-3a0e1df1>${ssrInterpolate(unref(articleError) || "The story may have moved or no longer exists.")}</p>`);
        _push(ssrRenderComponent(unref(RouterLink), {
          to: "/news",
          class: "mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` View all news `);
            } else {
              return [
                createTextVNode(" View all news ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</section>`);
      }
      if (unref(relatedNews).length > 0) {
        _push(`<section class="bg-gray-50 pb-20" data-v-3a0e1df1><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-v-3a0e1df1><h2 class="mb-6 text-2xl font-black text-slate-950" data-v-3a0e1df1>More for you</h2>`);
        _push(ssrRenderComponent(NewsList, { "news-items": unref(relatedNews) }, null, _parent));
        _push(ssrRenderComponent(AdSenseSlot, {
          class: "mt-10",
          slot: unref(adsenseConfig).slots.newsDetailBottom
        }, null, _parent));
        _push(`</div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3a0e1df1"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-1egDhNcX.mjs.map
