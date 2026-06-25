import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { A as AppHeader, a as AppFooter, l as logoSrc } from './AppHeader-CiIf_B2g.mjs';
import { _ as _export_sfc } from './server.mjs';
import { P as ProgramCard } from './ProgramCard-DL29YtGu.mjs';
import { u as usePageMeta } from './usePageMeta-oq6avMrt.mjs';
import 'vue-router';
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
import './assetUrl-BkGibEdX.mjs';
import './composables-CFZojNAo.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "HeroSection",
  __ssrInlineRender: true,
  setup(__props) {
    const androidAppUrl = "https://play.google.com/store/apps/details?id=com.linkskool.app";
    const desktopAppUrl = "https://app.linskkool.com";
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50" }, _attrs))} data-v-b108a0dd><div class="absolute inset-0 overflow-hidden pointer-events-none" data-v-b108a0dd><div class="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" data-v-b108a0dd></div><div class="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" data-v-b108a0dd></div><div class="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" data-v-b108a0dd></div></div><div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32" data-v-b108a0dd><div class="grid lg:grid-cols-2 gap-12 items-center" data-v-b108a0dd><div class="text-center lg:text-left space-y-8" data-v-b108a0dd><div class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-100 shadow-sm" data-v-b108a0dd><span class="w-2 h-2 bg-green-500 rounded-full animate-pulse" data-v-b108a0dd></span><span class="text-sm font-medium text-gray-700" data-v-b108a0dd>Transform Your Future with Learning</span></div><h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight" data-v-b108a0dd><span class="text-gray-900" data-v-b108a0dd>Unlock Your</span><br data-v-b108a0dd><span class="bg-gradient-to-r from-blue-600 via-blue-700 to-orange-500 bg-clip-text text-transparent" data-v-b108a0dd> Potential </span></h1><p class="text-xl text-gray-600 max-w-2xl leading-relaxed" data-v-b108a0dd> Learn from industry experts through carefully crafted programs. Build skills that matter, at your own pace, with hands-on projects and real-world applications. </p><div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start" data-v-b108a0dd><button class="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer" data-v-b108a0dd><span data-v-b108a0dd>Browse Programs</span><i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform" data-v-b108a0dd></i></button><button class="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer" data-v-b108a0dd> Watch Demo </button></div><div class="pt-2" data-v-b108a0dd><p class="text-sm font-semibold text-gray-700 mb-3" data-v-b108a0dd>Download the LinkSkool app</p><div class="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center lg:justify-start" data-v-b108a0dd><a${ssrRenderAttr("href", unref(androidAppUrl))} target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 hover:shadow-lg transition-all duration-200" data-v-b108a0dd><i class="fa-brands fa-google-play" data-v-b108a0dd></i><span data-v-b108a0dd>Android</span></a><a${ssrRenderAttr("href", unref(desktopAppUrl))} target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-800 font-semibold border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200" data-v-b108a0dd><img${ssrRenderAttr("src", unref(logoSrc))} alt="LinkSkool" class="w-5 h-5 object-contain" data-v-b108a0dd><span data-v-b108a0dd>Desktop App</span></a><button type="button" disabled class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-100 text-gray-500 font-semibold border border-gray-200 cursor-not-allowed" aria-disabled="true" title="iOS app coming soon" data-v-b108a0dd><i class="fa-brands fa-apple" data-v-b108a0dd></i><span data-v-b108a0dd>iOS (Coming soon)</span></button></div></div><div class="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200" data-v-b108a0dd><div class="text-center lg:text-left" data-v-b108a0dd><div class="text-3xl font-bold text-gray-900" data-v-b108a0dd>50K+</div><div class="text-sm text-gray-600 mt-1" data-v-b108a0dd>Students</div></div><div class="text-center lg:text-left" data-v-b108a0dd><div class="text-3xl font-bold text-gray-900" data-v-b108a0dd>200+</div><div class="text-sm text-gray-600 mt-1" data-v-b108a0dd>Courses</div></div><div class="text-center lg:text-left" data-v-b108a0dd><div class="text-3xl font-bold text-gray-900" data-v-b108a0dd>98%</div><div class="text-sm text-gray-600 mt-1" data-v-b108a0dd>Satisfaction</div></div></div></div><div class="relative hidden lg:block" data-v-b108a0dd><div class="relative z-10" data-v-b108a0dd><div class="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-500" data-v-b108a0dd><div class="aspect-square bg-gradient-to-br from-blue-100 via-blue-50 to-orange-50 rounded-xl flex items-center justify-center" data-v-b108a0dd><i class="fa-solid fa-graduation-cap text-9xl text-blue-600 opacity-80" data-v-b108a0dd></i></div></div><div class="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 animate-float" data-v-b108a0dd><div class="flex items-center gap-3" data-v-b108a0dd><div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center" data-v-b108a0dd><i class="fa-solid fa-check text-green-600 text-xl" data-v-b108a0dd></i></div><div data-v-b108a0dd><div class="text-sm font-semibold text-gray-900" data-v-b108a0dd>Course Complete</div><div class="text-xs text-gray-500" data-v-b108a0dd>+100 XP earned</div></div></div></div><div class="absolute -bottom-6 -left-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-xl p-4 text-white animate-float animation-delay-2000" data-v-b108a0dd><div class="flex items-center gap-3" data-v-b108a0dd><div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center" data-v-b108a0dd><i class="fa-solid fa-trophy text-xl" data-v-b108a0dd></i></div><div data-v-b108a0dd><div class="text-sm font-semibold" data-v-b108a0dd>Top Learner</div><div class="text-xs opacity-90" data-v-b108a0dd>This Week</div></div></div></div></div></div></div></div><div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce" data-v-b108a0dd><i class="fa-solid fa-chevron-down text-gray-400 text-2xl" data-v-b108a0dd></i></div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeroSection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const HeroSection = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-b108a0dd"]]), { __name: "HeroSection" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    usePageMeta({
      title: "Linkskool — Education Technology for Learning, Assessment & School Data",
      description: "One connected platform for learning, assessments, school management, and education data across Africa. Built for schools, institutions, and learners.",
      keywords: "education technology, learning management system, CBT, school management software, education data, Africa edtech, online courses",
      url: "https://linkskool.com",
      image: "https://linkskool.com/assets/og-image.png",
      type: "website"
    });
    const programs = ref([]);
    const isLoading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}>`);
      _push(ssrRenderComponent(AppHeader, null, null, _parent));
      _push(ssrRenderComponent(HeroSection, null, null, _parent));
      _push(`<section id="programs" class="py-20 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-16"><div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-6"><i class="fa-solid fa-graduation-cap text-blue-600"></i><span class="text-sm font-semibold text-blue-700">Learning Programs</span></div><h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4"> Explore Our Programs </h2><p class="text-xl text-gray-600 max-w-2xl mx-auto"> Choose from our carefully curated programs designed by industry experts </p></div>`);
      if (isLoading.value) {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
        ssrRenderList(6, (i) => {
          _push(`<div class="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
        ssrRenderList(programs.value, (program) => {
          _push(ssrRenderComponent(ProgramCard, {
            key: program.id,
            program
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></section><section class="py-20 bg-gradient-to-br from-gray-50 to-blue-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-16"><h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4"> Why Choose LinkSkool? </h2><p class="text-xl text-gray-600 max-w-2xl mx-auto"> Everything you need to succeed in your learning journey </p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"><div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300"><div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6"><i class="fa-solid fa-chalkboard-user text-blue-600 text-2xl"></i></div><h3 class="text-xl font-bold text-gray-900 mb-3">Expert Instructors</h3><p class="text-gray-600">Learn from industry professionals with years of real-world experience </p></div><div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300"><div class="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6"><i class="fa-solid fa-clock text-orange-600 text-2xl"></i></div><h3 class="text-xl font-bold text-gray-900 mb-3">Flexible Learning</h3><p class="text-gray-600">Study at your own pace with lifetime access to course materials</p></div><div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300"><div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6"><i class="fa-solid fa-certificate text-green-600 text-2xl"></i></div><h3 class="text-xl font-bold text-gray-900 mb-3">Certificates</h3><p class="text-gray-600">Earn recognized certificates to showcase your achievements</p></div><div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300"><div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6"><i class="fa-solid fa-users text-purple-600 text-2xl"></i></div><h3 class="text-xl font-bold text-gray-900 mb-3">Community</h3><p class="text-gray-600">Join a thriving community of learners and mentors worldwide</p></div></div></div></section><section class="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-orange-600"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><h2 class="text-4xl md:text-5xl font-bold text-white mb-6"> Ready to Start Learning? </h2><p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"> Join thousands of students already learning on LinkSkool. Start your journey today. </p><div class="flex flex-col sm:flex-row gap-4 justify-center"><button class="px-8 py-4 bg-white text-blue-700 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer"> Browse All Courses </button><button class="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-700 transition-all duration-200 cursor-pointer"> Contact Sales </button></div></div></section>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-wUykh8Ax.mjs.map
