import { defineComponent, resolveComponent, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { A as AppHeader, a as AppFooter } from './AppHeader-CiIf_B2g.mjs';
import { u as usePageMeta } from './usePageMeta-oq6avMrt.mjs';
import { _ as _export_sfc, f as useRequestEvent, s as setResponseStatus } from './server.mjs';
import './composables-CFZojNAo.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'pinia';
import '@vue/shared';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[...notfound]",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    {
      const event = useRequestEvent();
      if (event) {
        setResponseStatus(event, 404);
      }
    }
    usePageMeta({
      title: "404 - Page Not Found | Linkskool",
      description: "The page you are looking for could not be found. Return to our homepage to explore our learning programs.",
      keywords: "page not found, 404 error",
      url: "https://linkskool.com/404",
      image: "https://linkskool.com/assets/og-image.png",
      type: "website"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 flex flex-col" }, _attrs))} data-v-99c199c9>`);
      _push(ssrRenderComponent(AppHeader, null, null, _parent));
      _push(`<main class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16" data-v-99c199c9><div class="max-w-2xl w-full text-center" data-v-99c199c9><div class="mb-8" data-v-99c199c9><div class="inline-flex items-center justify-center" data-v-99c199c9><div class="relative" data-v-99c199c9><h1 class="text-[150px] sm:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-600 leading-none animate-pulse" data-v-99c199c9> 404 </h1><div class="absolute -top-8 -left-8 animate-float" data-v-99c199c9><div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center" data-v-99c199c9><i class="fa-solid fa-book-open text-2xl text-blue-600" data-v-99c199c9></i></div></div><div class="absolute -bottom-4 -right-8 animate-float" style="${ssrRenderStyle({ "animation-delay": "0.5s" })}" data-v-99c199c9><div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center" data-v-99c199c9><i class="fa-solid fa-graduation-cap text-xl text-orange-600" data-v-99c199c9></i></div></div></div></div></div><div class="mb-8" data-v-99c199c9><h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-v-99c199c9> Oops! Page Not Found </h2><p class="text-lg text-gray-600 mb-2" data-v-99c199c9> The page you&#39;re looking for doesn&#39;t exist or has been moved. </p><p class="text-gray-500" data-v-99c199c9> Don&#39;t worry, even the best explorers get lost sometimes! </p></div><div class="flex flex-col sm:flex-row gap-4 justify-center items-center" data-v-99c199c9><button class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer" data-v-99c199c9><i class="fa-solid fa-home" data-v-99c199c9></i><span data-v-99c199c9>Back to Home</span></button><button class="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer" data-v-99c199c9><i class="fa-solid fa-arrow-left" data-v-99c199c9></i><span data-v-99c199c9>Go Back</span></button></div><div class="mt-16 pt-8 border-t border-gray-200" data-v-99c199c9><p class="text-sm text-gray-600 mb-4" data-v-99c199c9>Or explore these popular sections:</p><div class="flex flex-wrap gap-3 justify-center" data-v-99c199c9>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/#programs",
        class: "px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fa-solid fa-graduation-cap mr-2" data-v-99c199c9${_scopeId}></i> View Programs `);
          } else {
            return [
              createVNode("i", { class: "fa-solid fa-graduation-cap mr-2" }),
              createTextVNode(" View Programs ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/",
        class: "px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fa-solid fa-book mr-2" data-v-99c199c9${_scopeId}></i> Browse Courses `);
          } else {
            return [
              createVNode("i", { class: "fa-solid fa-book mr-2" }),
              createTextVNode(" Browse Courses ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a href="mailto:info@linkskool.com" class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-all" data-v-99c199c9><i class="fa-solid fa-envelope mr-2" data-v-99c199c9></i> Contact Support </a></div></div></div></main>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[...notfound].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ____notfound_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-99c199c9"]]);

export { ____notfound_ as default };
//# sourceMappingURL=_...notfound_-HlhELcn0.mjs.map
