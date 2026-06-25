import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, unref, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { useRoute, RouterLink } from 'vue-router';
import { A as AppHeader, a as AppFooter } from './AppHeader-CiIf_B2g.mjs';
import { r as resolveAssetUrl } from './assetUrl-BkGibEdX.mjs';
import { u as usePageMeta } from './usePageMeta-oq6avMrt.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CourseCard",
  __ssrInlineRender: true,
  props: {
    course: {}
  },
  setup(__props) {
    const props = __props;
    const displayImageUrl = computed(() => resolveAssetUrl(props.course.imageUrl));
    const nairaFormatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2
    });
    const cohort = computed(() => props.course.cohort);
    const isFreeCourse = computed(() => cohort.value?.isFree ?? false);
    const encodeRef = (value) => {
      try {
        return btoa(value);
      } catch {
        return value;
      }
    };
    const courseDetailsRoute = computed(() => ({
      path: `/courses/${props.course.courseId}`,
      query: cohort.value?.slug ? { ref: encodeRef(cohort.value.slug) } : void 0
    }));
    const displayPrice = computed(() => {
      if (isFreeCourse.value) return "Free";
      const price = cohort.value?.cost ?? 0;
      const discount = cohort.value?.discount ?? 0;
      if (discount > 0) {
        const discountedPrice = price - price * discount / 100;
        return {
          current: nairaFormatter.format(discountedPrice),
          original: nairaFormatter.format(price),
          discount: `${discount}% OFF`
        };
      }
      return nairaFormatter.format(price);
    });
    const trialBadge = computed(() => {
      const trialType = cohort.value?.trialType;
      const trialValue = cohort.value?.trialValue;
      if (!trialType || !trialValue) return null;
      if (trialType === "days") {
        return `${trialValue} days trial`;
      }
      if (trialType === "views") {
        return `${trialValue} views trial`;
      }
      return null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(RouterLink), mergeProps({
        to: courseDetailsRoute.value,
        class: "group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-50 to-orange-50"${_scopeId}>`);
            if (displayImageUrl.value) {
              _push2(`<img${ssrRenderAttr("src", displayImageUrl.value)}${ssrRenderAttr("alt", __props.course.courseName)} loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"${_scopeId}>`);
            } else {
              _push2(`<div class="w-full h-full flex items-center justify-center"${_scopeId}><i class="fa-solid fa-book text-5xl text-blue-300"${_scopeId}></i></div>`);
            }
            if (trialBadge.value) {
              _push2(`<div class="absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-lg"${_scopeId}>${ssrInterpolate(trialBadge.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (typeof displayPrice.value === "object" && displayPrice.value.discount) {
              _push2(`<div class="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg"${_scopeId}>${ssrInterpolate(displayPrice.value.discount)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="p-5"${_scopeId}><h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]"${_scopeId}>${ssrInterpolate(__props.course.courseName)}</h3><p class="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed"${_scopeId}>${ssrInterpolate(__props.course.description)}</p><div class="flex items-center justify-between pt-4 border-t border-gray-100"${_scopeId}>`);
            if (typeof displayPrice.value === "string") {
              _push2(`<div class="text-xl font-bold text-gray-900"${_scopeId}><span class="${ssrRenderClass(isFreeCourse.value ? "text-green-600" : "")}"${_scopeId}>${ssrInterpolate(displayPrice.value)}</span></div>`);
            } else {
              _push2(`<div class="flex flex-col"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><span class="text-xl font-bold text-gray-900"${_scopeId}>${ssrInterpolate(displayPrice.value.current)}</span><span class="text-sm text-gray-400 line-through"${_scopeId}>${ssrInterpolate(displayPrice.value.original)}</span></div></div>`);
            }
            _push2(`<div class="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-1 transition-all"${_scopeId}><span${_scopeId}>View</span><i class="fa-solid fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform text-xs"${_scopeId}></i></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "relative aspect-video overflow-hidden bg-gradient-to-br from-blue-50 to-orange-50" }, [
                displayImageUrl.value ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: displayImageUrl.value,
                  alt: __props.course.courseName,
                  loading: "lazy",
                  class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "w-full h-full flex items-center justify-center"
                }, [
                  createVNode("i", { class: "fa-solid fa-book text-5xl text-blue-300" })
                ])),
                trialBadge.value ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "absolute top-3 left-3 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-lg"
                }, toDisplayString(trialBadge.value), 1)) : createCommentVNode("", true),
                typeof displayPrice.value === "object" && displayPrice.value.discount ? (openBlock(), createBlock("div", {
                  key: 3,
                  class: "absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg"
                }, toDisplayString(displayPrice.value.discount), 1)) : createCommentVNode("", true)
              ]),
              createVNode("div", { class: "p-5" }, [
                createVNode("h3", { class: "text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]" }, toDisplayString(__props.course.courseName), 1),
                createVNode("p", { class: "text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed" }, toDisplayString(__props.course.description), 1),
                createVNode("div", { class: "flex items-center justify-between pt-4 border-t border-gray-100" }, [
                  typeof displayPrice.value === "string" ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-xl font-bold text-gray-900"
                  }, [
                    createVNode("span", {
                      class: isFreeCourse.value ? "text-green-600" : ""
                    }, toDisplayString(displayPrice.value), 3)
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "flex flex-col"
                  }, [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      createVNode("span", { class: "text-xl font-bold text-gray-900" }, toDisplayString(displayPrice.value.current), 1),
                      createVNode("span", { class: "text-sm text-gray-400 line-through" }, toDisplayString(displayPrice.value.original), 1)
                    ])
                  ])),
                  createVNode("div", { class: "flex items-center text-blue-600 font-semibold text-sm group-hover:gap-1 transition-all" }, [
                    createVNode("span", null, "View"),
                    createVNode("i", { class: "fa-solid fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform text-xs" })
                  ])
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CourseCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const CourseCard = Object.assign(_sfc_main$1, { __name: "CourseCard" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const program = ref(null);
    const courses = ref([]);
    const isLoading = ref(false);
    const loadError = ref("");
    const programRef = computed(() => {
      const value = route.params.s;
      if (Array.isArray(value)) {
        return value[0] ?? "";
      }
      return value ?? "";
    });
    const enrollProgramPath = computed(() => {
      if (!programRef.value || courses.value.length === 0) {
        return "";
      }
      return `/programs/${programRef.value}/enroll`;
    });
    usePageMeta(() => ({
      title: program.value ? `${program.value.name} | Learn with Linkskool` : "Program | Linkskool",
      description: program.value?.description || "Explore our comprehensive learning program with expert-curated courses.",
      keywords: `${program.value?.name || "program"}, online courses, skill development, professional training`,
      url: `https://linkskool.com/programs/${programRef.value}`,
      image: "https://linkskool.com/assets/og-image.png",
      type: "website"
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}>`);
      _push(ssrRenderComponent(AppHeader, null, null, _parent));
      _push(`<section class="pt-24 pb-12 bg-gradient-to-br from-blue-600 via-blue-700 to-orange-600"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
      if (isLoading.value) {
        _push(`<div class="animate-pulse"><div class="h-12 bg-white/20 rounded-lg w-2/3 mb-4"></div><div class="h-6 bg-white/20 rounded-lg w-1/2"></div></div>`);
      } else if (program.value) {
        _push(`<div class="max-w-4xl"><nav class="flex items-center gap-2 text-blue-100 mb-6">`);
        _push(ssrRenderComponent(_component_RouterLink, {
          to: "/",
          class: "hover:text-white transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Home`);
            } else {
              return [
                createTextVNode("Home")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<i class="fa-solid fa-chevron-right text-xs"></i>`);
        _push(ssrRenderComponent(_component_RouterLink, {
          to: "/#programs",
          class: "hover:text-white transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Programs`);
            } else {
              return [
                createTextVNode("Programs")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<i class="fa-solid fa-chevron-right text-xs"></i><span class="text-white">${ssrInterpolate(program.value.name)}</span></nav><h1 class="text-4xl md:text-5xl font-bold text-white mb-6">${ssrInterpolate(program.value.name)}</h1><p class="text-xl text-blue-100 mb-8 leading-relaxed">${ssrInterpolate(program.value.description)}</p><div class="flex flex-wrap gap-6 text-white"><div class="flex items-center gap-2"><i class="fa-solid fa-book"></i><span>${ssrInterpolate(courses.value.length)} Courses</span></div>`);
        if (enrollProgramPath.value) {
          _push(ssrRenderComponent(_component_RouterLink, {
            to: enrollProgramPath.value,
            class: "inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-700 font-bold text-lg shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-200"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span${_scopeId}>Enroll</span><i class="fa-solid fa-arrow-right"${_scopeId}></i>`);
              } else {
                return [
                  createVNode("span", null, "Enroll"),
                  createVNode("i", { class: "fa-solid fa-arrow-right" })
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<button type="button" disabled class="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/60 text-blue-300 font-bold text-lg cursor-not-allowed"><span>Enroll</span><i class="fa-solid fa-arrow-right"></i></button>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div class="max-w-4xl"><h1 class="text-3xl md:text-4xl font-bold text-white mb-4">Program not found</h1><p class="text-blue-100">${ssrInterpolate(loadError.value || "Please check the program link and try again.")}</p></div>`);
      }
      _push(`</div></section><section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="mb-12"><h2 class="text-3xl font-bold text-gray-900 mb-2"> Courses in this Program </h2><p class="text-gray-600"> Complete all courses to master this skill path </p></div>`);
      if (isLoading.value) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
        ssrRenderList(6, (i) => {
          _push(`<div class="bg-gray-200 rounded-xl h-80 animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (courses.value.length > 0) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
        ssrRenderList(courses.value, (course) => {
          _push(ssrRenderComponent(CourseCard, {
            key: course.courseId,
            course
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-16"><i class="fa-solid fa-book-open text-6xl text-gray-300 mb-4"></i><p class="text-xl text-gray-500">${ssrInterpolate(loadError.value || "No courses available yet")}</p></div>`);
      }
      _push(`</div></section><section class="py-16 bg-gray-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 class="text-3xl font-bold text-gray-900 mb-2"> You Might Also Like </h2><p class="text-gray-600"> Explore other programs to expand your skills </p></div><div class="flex justify-center">`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/#programs",
        class: "px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}>View All Programs</span><i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"${_scopeId}></i>`);
          } else {
            return [
              createVNode("span", null, "View All Programs"),
              createVNode("i", { class: "fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/programs/[s]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BbWhn3hY.mjs.map
