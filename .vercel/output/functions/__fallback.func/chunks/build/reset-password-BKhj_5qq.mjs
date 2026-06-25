import { defineComponent, computed, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderDynamicModel, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { A as AppHeader, a as AppFooter } from './AppHeader-CiIf_B2g.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "reset-password",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    computed(() => {
      const raw = route.query.token;
      return Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";
    });
    const newPassword = ref("");
    const confirmPassword = ref("");
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);
    const loading = ref(false);
    const error = ref("");
    const success = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}>`);
      _push(ssrRenderComponent(AppHeader, null, null, _parent));
      _push(`<section class="pt-24 pb-12 bg-gradient-to-br from-blue-600 via-blue-700 to-orange-600"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><h1 class="text-4xl md:text-5xl font-bold text-white mb-3">Reset Your Password</h1><p class="text-lg text-blue-100 max-w-xl mx-auto"> Choose a strong new password to secure your account. </p></div></section><section class="py-16 px-4"><div class="max-w-md mx-auto">`);
      if (success.value) {
        _push(`<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center"><div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"><i class="fa-solid fa-shield-halved text-green-600 text-2xl"></i></div><h2 class="text-xl font-bold text-gray-900 mb-2">Password updated!</h2><p class="text-gray-600 mb-8"> Your password has been reset successfully. You can now log in with your new password. </p><button class="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"> Open App to Login </button></div>`);
      } else {
        _push(`<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"><div class="text-center mb-8"><div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"><i class="fa-solid fa-lock-open text-blue-600 text-xl"></i></div><h2 class="text-2xl font-bold text-gray-900">Set a new password</h2><p class="text-gray-500 mt-1 text-sm">Enter and confirm your new password below.</p></div><form novalidate><div class="mb-5"><label class="block text-sm font-medium text-gray-700 mb-1.5" for="new-password"> New password </label><div class="relative"><span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400"><i class="fa-solid fa-lock text-sm"></i></span><input id="new-password"${ssrRenderDynamicModel(showNewPassword.value ? "text" : "password", newPassword.value, null)}${ssrRenderAttr("type", showNewPassword.value ? "text" : "password")} autocomplete="new-password" placeholder="Min. 8 characters" class="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition"><button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"><i class="${ssrRenderClass([showNewPassword.value ? "fa-solid fa-eye-slash" : "fa-solid fa-eye", "text-sm"])}"></i></button></div></div><div class="mb-6"><label class="block text-sm font-medium text-gray-700 mb-1.5" for="confirm-password"> Confirm password </label><div class="relative"><span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400"><i class="fa-solid fa-lock text-sm"></i></span><input id="confirm-password"${ssrRenderDynamicModel(showConfirmPassword.value ? "text" : "password", confirmPassword.value, null)}${ssrRenderAttr("type", showConfirmPassword.value ? "text" : "password")} autocomplete="new-password" placeholder="Repeat your password" class="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition"><button type="button" class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"><i class="${ssrRenderClass([showConfirmPassword.value ? "fa-solid fa-eye-slash" : "fa-solid fa-eye", "text-sm"])}"></i></button></div></div>`);
        if (error.value) {
          _push(`<p class="text-sm text-red-600 mb-4 flex items-center gap-1.5"><i class="fa-solid fa-circle-exclamation"></i> ${ssrInterpolate(error.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100">`);
        if (loading.value) {
          _push(`<span class="flex items-center justify-center gap-2"><i class="fa-solid fa-circle-notch animate-spin"></i> Resetting… </span>`);
        } else {
          _push(`<span>Reset Password</span>`);
        }
        _push(`</button></form></div>`);
      }
      _push(`</div></section>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reset-password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=reset-password-BKhj_5qq.mjs.map
