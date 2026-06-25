import { defineComponent, computed, unref, mergeProps, withCtx, createVNode, openBlock, createBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { RouterLink } from 'vue-router';
import { r as resolveAssetUrl } from './assetUrl-BkGibEdX.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProgramCard",
  __ssrInlineRender: true,
  props: {
    program: {}
  },
  setup(__props) {
    const props = __props;
    const displayImageUrl = computed(() => resolveAssetUrl(props.program.imageUrl));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(RouterLink), mergeProps({
        to: `/programs/${__props.program.slug}`,
        class: "group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-50 to-orange-50"${_scopeId}>`);
            if (displayImageUrl.value) {
              _push2(`<img${ssrRenderAttr("src", displayImageUrl.value)}${ssrRenderAttr("alt", __props.program.name)} loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"${_scopeId}>`);
            } else {
              _push2(`<div class="w-full h-full flex items-center justify-center"${_scopeId}><i class="fa-solid fa-graduation-cap text-6xl text-blue-300"${_scopeId}></i></div>`);
            }
            _push2(`<div class="absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg"${_scopeId}><span class="text-sm font-semibold text-gray-700"${_scopeId}>${ssrInterpolate(__props.program.courseCount)} courses </span></div></div><div class="p-6"${_scopeId}><h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1"${_scopeId}>${ssrInterpolate(__props.program.name)}</h3><p class="text-gray-600 line-clamp-2 mb-4 leading-relaxed"${_scopeId}>${ssrInterpolate(__props.program.description)}</p><div class="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all"${_scopeId}><span${_scopeId}>Explore Program</span><i class="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"${_scopeId}></i></div></div>`);
          } else {
            return [
              createVNode("div", { class: "relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-50 to-orange-50" }, [
                displayImageUrl.value ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: displayImageUrl.value,
                  alt: __props.program.name,
                  loading: "lazy",
                  class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "w-full h-full flex items-center justify-center"
                }, [
                  createVNode("i", { class: "fa-solid fa-graduation-cap text-6xl text-blue-300" })
                ])),
                createVNode("div", { class: "absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg" }, [
                  createVNode("span", { class: "text-sm font-semibold text-gray-700" }, toDisplayString(__props.program.courseCount) + " courses ", 1)
                ])
              ]),
              createVNode("div", { class: "p-6" }, [
                createVNode("h3", { class: "text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1" }, toDisplayString(__props.program.name), 1),
                createVNode("p", { class: "text-gray-600 line-clamp-2 mb-4 leading-relaxed" }, toDisplayString(__props.program.description), 1),
                createVNode("div", { class: "flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all" }, [
                  createVNode("span", null, "Explore Program"),
                  createVNode("i", { class: "fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform" })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProgramCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProgramCard = Object.assign(_sfc_main, { __name: "ProgramCard" });

export { ProgramCard as P };
//# sourceMappingURL=ProgramCard-DL29YtGu.mjs.map
