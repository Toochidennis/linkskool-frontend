import { defineComponent, ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { A as AppHeader, a as AppFooter } from './AppHeader-CiIf_B2g.mjs';
import { u as usePageMeta } from './usePageMeta-oq6avMrt.mjs';
import { s as sanitizeHtml } from './sanitizeHtml-jsTyqf9a.mjs';
import 'vue-router';
import './server.mjs';
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
import 'dompurify';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "faqs",
  __ssrInlineRender: true,
  setup(__props) {
    const faqs = ref([]);
    const isLoading = ref(false);
    const loadError = ref("");
    const expandedFaqIds = ref([]);
    const sanitizeAnswerHtml = (answer) => sanitizeHtml(answer, {
      USE_PROFILES: { html: true }
    });
    const displayedFaqs = computed(
      () => faqs.value.map((faq, index) => ({
        ...faq,
        order: index + 1,
        answerHtml: sanitizeAnswerHtml(faq.answer)
      }))
    );
    usePageMeta({
      title: "FAQs | Linkskool",
      description: "Find answers to common questions about Linkskool programs, enrollment, payments, and learning experience.",
      keywords: "linkskool faqs, enrollment questions, payment help, course support",
      url: "https://linkskool.com/faqs",
      image: "https://linkskool.com/assets/og-image.png",
      type: "website"
    });
    const isExpanded = (faqId) => expandedFaqIds.value.includes(faqId);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}>`);
      _push(ssrRenderComponent(AppHeader, null, null, _parent));
      _push(`<section class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-orange-600 pt-24 pb-14"><div class="pointer-events-none absolute -top-24 -left-12 h-72 w-72 rounded-full bg-blue-300/20 blur-2xl"></div><div class="pointer-events-none absolute -bottom-20 -right-8 h-72 w-72 rounded-full bg-orange-300/20 blur-2xl"></div><div class="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center"><div class="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white"><i class="fa-solid fa-circle-question"></i><span>Help Center</span></div><h1 class="mt-6 text-4xl font-black tracking-tight text-white md:text-5xl"> Frequently Asked Questions </h1><p class="mx-auto mt-4 max-w-3xl text-lg text-blue-100"> Quick answers to common questions about our programs, payments, and enrollment process. </p></div></section><section class="py-14"><div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"><div class="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">`);
      if (isLoading.value) {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(6, (i) => {
          _push(`<div class="rounded-2xl border border-gray-100 p-4"><div class="h-5 w-4/5 animate-pulse rounded bg-gray-200"></div><div class="mt-3 h-4 w-full animate-pulse rounded bg-gray-100"></div><div class="mt-2 h-4 w-5/6 animate-pulse rounded bg-gray-100"></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (loadError.value) {
        _push(`<div class="rounded-2xl border border-red-100 bg-red-50 px-5 py-6 text-center"><i class="fa-solid fa-circle-exclamation text-2xl text-red-500"></i><p class="mt-3 text-red-700">${ssrInterpolate(loadError.value)}</p><button type="button" class="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-500"><i class="fa-solid fa-rotate-right"></i><span>Try again</span></button></div>`);
      } else if (displayedFaqs.value.length > 0) {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(displayedFaqs.value, (faq) => {
          _push(`<article class="rounded-2xl border border-gray-100 bg-white transition-all duration-200 hover:border-blue-200"><button type="button" class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"${ssrRenderAttr("aria-expanded", isExpanded(faq.id))}><div class="flex items-start gap-3"><span class="mt-0.5 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-blue-50 px-2 text-xs font-bold text-blue-700">${ssrInterpolate(faq.order)}</span><h2 class="text-base font-semibold text-gray-900 sm:text-lg">${ssrInterpolate(faq.question)}</h2></div><i class="${ssrRenderClass([isExpanded(faq.id) ? "rotate-180 text-blue-600" : "", "fa-solid fa-chevron-down text-gray-400 transition-transform duration-200"])}"></i></button>`);
          if (isExpanded(faq.id)) {
            _push(`<div class="overflow-hidden px-5 pb-5"><div class="border-l-2 border-blue-100 pl-4 text-gray-600 leading-relaxed [&amp;_a]:font-semibold [&amp;_a]:text-blue-700 [&amp;_a:hover]:text-blue-600 [&amp;_li]:ml-5 [&amp;_li]:list-disc [&amp;_ol]:ml-5 [&amp;_ol]:list-decimal [&amp;_p]:mb-3 [&amp;_p:last-child]:mb-0 [&amp;_strong]:text-gray-900">${faq.answerHtml ?? ""}</div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-8 text-center"><i class="fa-solid fa-comments text-3xl text-gray-400"></i><p class="mt-3 text-gray-600">No FAQs are available yet. Please check back soon.</p></div>`);
      }
      _push(`</div></div></section>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/faqs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=faqs-rBvic8IQ.mjs.map
