import { defineComponent, mergeProps, unref, ref, computed, withCtx, openBlock, createBlock, Fragment, createVNode, toDisplayString, createCommentVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { A as AppHeader, a as AppFooter } from './AppHeader-CiIf_B2g.mjs';
import { RouterLink } from 'vue-router';
import { n as newsService, m as mapApiNewsToCard, A as AdSenseSlot, a as adsenseConfig } from './newsMapper-BrKa5mZ0.mjs';
import { d as useAsyncData, _ as _export_sfc } from './server.mjs';
import { u as usePageMeta } from './usePageMeta-oq6avMrt.mjs';
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
import './composables-CFZojNAo.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "NewsSection",
  __ssrInlineRender: true,
  props: {
    newsItems: {},
    categories: {},
    activeCategory: {},
    isLoading: { type: Boolean },
    isLoadingMore: { type: Boolean }
  },
  emits: ["categoryChange"],
  setup(__props, { emit: __emit }) {
    const cardClassBySize = {
      feature: "news-card-feature",
      horizontal: "news-card-horizontal",
      square: "news-card-square"
    };
    const accentClassByColor = {
      blue: "from-blue-600 to-cyan-500",
      orange: "from-orange-500 to-amber-400",
      green: "from-emerald-500 to-teal-400",
      violet: "from-violet-600 to-fuchsia-500",
      rose: "from-rose-500 to-orange-400"
    };
    const shouldShowInlineAd = (index) => (index + 1) % 10 === 0;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "relative overflow-hidden bg-gray-50 pt-28 pb-20 text-slate-950" }, _attrs))} data-v-debc1bee><div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-v-debc1bee><header class="mb-8 max-w-3xl" data-v-debc1bee><h1 class="text-3xl font-black leading-tight text-slate-950 sm:text-4xl" data-v-debc1bee> News, opportunities, and stories from LinkSkool </h1><p class="mt-3 text-base leading-7 text-slate-600" data-v-debc1bee> Announcements, career insights, technology notes, and community updates from across the LinkSkool network. </p></header>`);
      _push(ssrRenderComponent(AdSenseSlot, {
        slot: unref(adsenseConfig).slots.newsTop
      }, null, _parent));
      _push(`<div class="mt-8 flex flex-wrap justify-center gap-3 border-t border-gray-200 pt-6" data-v-debc1bee><button type="button" class="${ssrRenderClass([
        __props.activeCategory === "All" ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
        "rounded-md border px-4 py-2 text-sm font-semibold transition cursor-pointer"
      ])}" data-v-debc1bee> All </button><!--[-->`);
      ssrRenderList(__props.categories, (category) => {
        _push(`<button type="button" class="${ssrRenderClass([
          __props.activeCategory === category ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
          "rounded-md border px-4 py-2 text-sm font-semibold transition cursor-pointer"
        ])}" data-v-debc1bee>${ssrInterpolate(category)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (__props.isLoading) {
        _push(`<div class="news-grid mt-14" data-v-debc1bee><!--[-->`);
        ssrRenderList(10, (item) => {
          _push(`<div class="${ssrRenderClass([item === 1 || item === 10 ? "news-card-horizontal" : "news-card-square", "news-card overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm"])}" data-v-debc1bee><div class="h-[52%] animate-pulse bg-gray-200" data-v-debc1bee></div><div class="space-y-3 p-4" data-v-debc1bee><div class="h-4 w-4/5 animate-pulse rounded bg-gray-200" data-v-debc1bee></div><div class="h-4 w-3/5 animate-pulse rounded bg-gray-200" data-v-debc1bee></div><div class="h-3 w-full animate-pulse rounded bg-gray-100" data-v-debc1bee></div><div class="h-3 w-2/3 animate-pulse rounded bg-gray-100" data-v-debc1bee></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="news-grid mt-14" data-v-debc1bee><!--[-->`);
        ssrRenderList(__props.newsItems, (item, index) => {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(unref(RouterLink), {
            to: `/news/${item.slug}`,
            class: ["news-card group relative overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm", cardClassBySize[item.size]]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (item.size === "square") {
                  _push2(`<!--[--><div class="relative h-[52%] overflow-hidden" data-v-debc1bee${_scopeId}><img${ssrRenderAttr("src", item.imageUrl)}${ssrRenderAttr("alt", item.imageAlt)} class="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" data-v-debc1bee${_scopeId}><div class="${ssrRenderClass([accentClassByColor[item.accent], "absolute left-3 top-3 rounded-md bg-gradient-to-r px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"])}" data-v-debc1bee${_scopeId}>${ssrInterpolate(item.category)}</div>`);
                  if ((item.images?.length ?? 0) > 1) {
                    _push2(`<div class="absolute right-3 top-3 rounded-md bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-white" data-v-debc1bee${_scopeId}> +${ssrInterpolate((item.images?.length ?? 1) - 1)}</div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div><div class="flex h-[48%] flex-col justify-between bg-white p-4" data-v-debc1bee${_scopeId}><div class="space-y-2" data-v-debc1bee${_scopeId}><h2 class="line-clamp-2 text-base font-black leading-tight text-slate-950" data-v-debc1bee${_scopeId}>${ssrInterpolate(item.title)}</h2><p class="line-clamp-2 text-xs leading-5 text-slate-600" data-v-debc1bee${_scopeId}>${ssrInterpolate(item.summary)}</p></div><span class="mt-2 inline-flex items-center gap-2 self-start text-xs font-bold text-blue-700 transition hover:text-blue-900 cursor-pointer" data-v-debc1bee${_scopeId}> Read story <i class="fa-solid fa-arrow-right text-[10px]" data-v-debc1bee${_scopeId}></i></span></div><!--]-->`);
                } else {
                  _push2(`<!--[--><img${ssrRenderAttr("src", item.imageUrl)}${ssrRenderAttr("alt", item.imageAlt)} class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" data-v-debc1bee${_scopeId}><div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/90 via-slate-950/55 to-transparent" data-v-debc1bee${_scopeId}></div><div class="${ssrRenderClass([accentClassByColor[item.accent], "absolute left-4 top-4 rounded-md bg-gradient-to-r px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"])}" data-v-debc1bee${_scopeId}>${ssrInterpolate(item.category)}</div>`);
                  if ((item.images?.length ?? 0) > 1) {
                    _push2(`<div class="absolute right-4 top-4 rounded-md bg-slate-950/80 px-3 py-1 text-xs font-bold text-white" data-v-debc1bee${_scopeId}> +${ssrInterpolate((item.images?.length ?? 1) - 1)}</div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<div class="absolute inset-x-0 bottom-0 space-y-3 p-4 sm:p-5" data-v-debc1bee${_scopeId}><h2 class="${ssrRenderClass([{ "sm:text-4xl": item.size === "feature", "sm:text-2xl": item.size === "horizontal" }, "line-clamp-3 text-xl font-black leading-tight text-white"])}" data-v-debc1bee${_scopeId}>${ssrInterpolate(item.title)}</h2><span class="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-blue-100 cursor-pointer" data-v-debc1bee${_scopeId}> Read story <i class="fa-solid fa-arrow-right text-xs" data-v-debc1bee${_scopeId}></i></span></div><!--]-->`);
                }
              } else {
                return [
                  item.size === "square" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    createVNode("div", { class: "relative h-[52%] overflow-hidden" }, [
                      createVNode("img", {
                        src: item.imageUrl,
                        alt: item.imageAlt,
                        class: "h-full w-full object-cover transition duration-500 group-hover:scale-105",
                        loading: "lazy"
                      }, null, 8, ["src", "alt"]),
                      createVNode("div", {
                        class: ["absolute left-3 top-3 rounded-md bg-gradient-to-r px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white", accentClassByColor[item.accent]]
                      }, toDisplayString(item.category), 3),
                      (item.images?.length ?? 0) > 1 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "absolute right-3 top-3 rounded-md bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-white"
                      }, " +" + toDisplayString((item.images?.length ?? 1) - 1), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex h-[48%] flex-col justify-between bg-white p-4" }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("h2", { class: "line-clamp-2 text-base font-black leading-tight text-slate-950" }, toDisplayString(item.title), 1),
                        createVNode("p", { class: "line-clamp-2 text-xs leading-5 text-slate-600" }, toDisplayString(item.summary), 1)
                      ]),
                      createVNode("span", { class: "mt-2 inline-flex items-center gap-2 self-start text-xs font-bold text-blue-700 transition hover:text-blue-900 cursor-pointer" }, [
                        createTextVNode(" Read story "),
                        createVNode("i", { class: "fa-solid fa-arrow-right text-[10px]" })
                      ])
                    ])
                  ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                    createVNode("img", {
                      src: item.imageUrl,
                      alt: item.imageAlt,
                      class: "absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105",
                      loading: "lazy"
                    }, null, 8, ["src", "alt"]),
                    createVNode("div", { class: "absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/90 via-slate-950/55 to-transparent" }),
                    createVNode("div", {
                      class: ["absolute left-4 top-4 rounded-md bg-gradient-to-r px-3 py-1 text-xs font-bold uppercase tracking-wide text-white", accentClassByColor[item.accent]]
                    }, toDisplayString(item.category), 3),
                    (item.images?.length ?? 0) > 1 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "absolute right-4 top-4 rounded-md bg-slate-950/80 px-3 py-1 text-xs font-bold text-white"
                    }, " +" + toDisplayString((item.images?.length ?? 1) - 1), 1)) : createCommentVNode("", true),
                    createVNode("div", { class: "absolute inset-x-0 bottom-0 space-y-3 p-4 sm:p-5" }, [
                      createVNode("h2", {
                        class: ["line-clamp-3 text-xl font-black leading-tight text-white", { "sm:text-4xl": item.size === "feature", "sm:text-2xl": item.size === "horizontal" }]
                      }, toDisplayString(item.title), 3),
                      createVNode("span", { class: "inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-blue-100 cursor-pointer" }, [
                        createTextVNode(" Read story "),
                        createVNode("i", { class: "fa-solid fa-arrow-right text-xs" })
                      ])
                    ])
                  ], 64))
                ];
              }
            }),
            _: 2
          }, _parent));
          if (shouldShowInlineAd(index)) {
            _push(ssrRenderComponent(AdSenseSlot, {
              slot: unref(adsenseConfig).slots.newsInline,
              class: "news-ad-card"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]-->`);
        if (__props.newsItems.length > 0) {
          _push(ssrRenderComponent(AdSenseSlot, {
            slot: unref(adsenseConfig).slots.newsBottom,
            class: "news-ad-card"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      if (__props.isLoadingMore) {
        _push(`<div class="news-grid mt-4" data-v-debc1bee><!--[-->`);
        ssrRenderList(4, (item) => {
          _push(`<div class="news-card news-card-square overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm" data-v-debc1bee><div class="h-[52%] animate-pulse bg-gray-200" data-v-debc1bee></div><div class="space-y-3 p-4" data-v-debc1bee><div class="h-4 w-4/5 animate-pulse rounded bg-gray-200" data-v-debc1bee></div><div class="h-3 w-full animate-pulse rounded bg-gray-100" data-v-debc1bee></div><div class="h-3 w-2/3 animate-pulse rounded bg-gray-100" data-v-debc1bee></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NewsSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const NewsSection = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-debc1bee"]]), { __name: "NewsSection" });
const newsLimit = 25;
const useNewsList = () => {
  const activeCategory = ref("All");
  const extraPages = ref([]);
  const loadError = ref("");
  const isLoadingMore = ref(false);
  const loadMoreTarget = ref(null);
  const {
    data: initialData,
    pending: isInitialLoading,
    error: initialError
  } = useAsyncData("news-list-page-1", () => newsService.getAllNews({ page: 1, limit: newsLimit }));
  const categoryIds = computed(() => initialData.value?.data.categories ?? {});
  const categories = computed(
    () => Object.keys(categoryIds.value).filter((category) => category.toLowerCase() !== "all")
  );
  const findCategoryForNews = (item) => Object.entries(categoryIds.value).find(
    ([category, ids]) => category.toLowerCase() !== "all" && ids.includes(item.id)
  )?.[0];
  const apiItems = computed(
    () => [initialData.value, ...extraPages.value].filter((page) => Boolean(page)).flatMap((page) => page.data.news)
  );
  const newsItems = computed(
    () => apiItems.value.map((item, index) => mapApiNewsToCard(item, index, findCategoryForNews(item)))
  );
  const filteredNewsItems = computed(() => {
    if (activeCategory.value === "All") {
      return newsItems.value;
    }
    const allowedIds = new Set(categoryIds.value[activeCategory.value] ?? []);
    return newsItems.value.filter((item) => allowedIds.has(item.id));
  });
  computed(
    () => extraPages.value.at(-1)?.meta ?? initialData.value?.meta ?? null
  );
  const displayError = computed(
    () => initialError.value ? "Unable to load news right now." : loadError.value
  );
  return {
    activeCategory,
    categories,
    filteredNewsItems,
    isInitialLoading,
    isLoadingMore,
    loadError: displayError,
    loadMoreTarget
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    usePageMeta({
      title: "News - LinkSkool Opportunities and Stories",
      description: "Read LinkSkool news, program announcements, opportunities, career insights, technology notes, and community stories in a masonry-style feed.",
      keywords: "LinkSkool news, education news, opportunities, career insights, learning community",
      url: "https://linkskool.com/news",
      image: "https://linkskool.com/assets/og-image.png",
      type: "website"
    });
    const {
      activeCategory,
      categories,
      filteredNewsItems,
      isInitialLoading,
      isLoadingMore,
      loadError
    } = useNewsList();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-950" }, _attrs))}>`);
      _push(ssrRenderComponent(AppHeader, null, null, _parent));
      _push(ssrRenderComponent(NewsSection, {
        "news-items": unref(filteredNewsItems),
        categories: unref(categories),
        "active-category": unref(activeCategory),
        "is-loading": unref(isInitialLoading),
        "is-loading-more": unref(isLoadingMore),
        onCategoryChange: ($event) => activeCategory.value = $event
      }, null, _parent));
      _push(`<div class="h-1"></div>`);
      if (unref(loadError)) {
        _push(`<p class="px-4 pb-10 text-center text-sm font-semibold text-red-600">${ssrInterpolate(unref(loadError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/news/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-x7y8B27M.mjs.map
