import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, computed, resolveComponent, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { RouterLink } from 'vue-router';
import { _ as _export_sfc } from './server.mjs';

const logoSrc = "" + __buildAssetsURL("logo.XOV5kOlO.png");
const cleanUrl = (value) => value.replace(/\/+$/, "");
const apiConfig = {
  baseUrl: cleanUrl("https://linkskool.com/api/v4/public/"),
  apiKey: "JMNNKyryPpQsy+bmuELQ3DWngnxFlOobbcgG4nebj0sLjVvxKSAMw/fWTDOsEVkm0ooKYua9VSjudC1L5hG0zg==",
  imageBaseUrl: cleanUrl("https://linkskool.com")
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AppFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const email = ref("");
    const programs = ref([]);
    const isLoadingPrograms = ref(false);
    const abbreviateProgramName = (name, maxLength = 24) => {
      if (name.length <= maxLength) {
        return name;
      }
      return `${name.slice(0, maxLength - 1).trimEnd()}…`;
    };
    const footerPrograms = computed(
      () => programs.value.slice(0, 4).map((program) => ({
        ...program,
        displayName: abbreviateProgramName(program.name)
      }))
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-300" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12"><div class="lg:col-span-2"><div class="flex items-center gap-2 mb-4"><img${ssrRenderAttr("src", logoSrc)} alt="LinkSkool" class="h-8 w-auto"><span class="text-xl font-bold text-white">LinkSkool</span></div><p class="text-gray-400 mb-6 max-w-sm"> Empowering learners worldwide with quality education and innovative learning experiences. </p><div class="space-y-3"><h4 class="text-white font-semibold">Subscribe to our newsletter</h4><form class="flex gap-2"><input${ssrRenderAttr("value", email.value)} type="email" placeholder="Enter your email" required class="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"><button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium whitespace-nowrap cursor-pointer"> Subscribe </button></form></div></div><div><h3 class="text-white font-semibold mb-4">Programs</h3><ul class="space-y-3">`);
      if (isLoadingPrograms.value) {
        _push(`<!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<li class="h-5 w-32 rounded bg-gray-800/80 animate-pulse"></li>`);
        });
        _push(`<!--]-->`);
      } else if (footerPrograms.value.length > 0) {
        _push(`<!--[--><!--[-->`);
        ssrRenderList(footerPrograms.value, (program) => {
          _push(`<li>`);
          _push(ssrRenderComponent(_component_RouterLink, {
            to: `/programs/${program.slug}`,
            title: program.name,
            class: "hover:text-white transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(program.displayName)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(program.displayName), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--><li>`);
        _push(ssrRenderComponent(_component_RouterLink, {
          to: "/#programs",
          class: "text-blue-300 hover:text-blue-200 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` View all programs `);
            } else {
              return [
                createTextVNode(" View all programs ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><!--]-->`);
      } else {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_RouterLink, {
          to: "/#programs",
          class: "hover:text-white transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Explore Programs `);
            } else {
              return [
                createTextVNode(" Explore Programs ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      }
      _push(`</ul></div><div><h3 class="text-white font-semibold mb-4">Resources</h3><ul class="space-y-3"><li><a href="#" class="hover:text-white transition-colors">Help Center</a></li><li><a href="#" class="hover:text-white transition-colors">Blog</a></li><li><a href="#" class="hover:text-white transition-colors">Documentation</a></li><li>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/faqs",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`FAQs`);
          } else {
            return [
              createTextVNode("FAQs")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div><h3 class="text-white font-semibold mb-4">Company</h3><ul class="space-y-3"><li>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/about",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`About Us`);
          } else {
            return [
              createTextVNode("About Us")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li><a href="#" class="hover:text-white transition-colors">Careers</a></li><li>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/contact",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Contact`);
          } else {
            return [
              createTextVNode("Contact")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/privacy-policy",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Privacy Policy `);
          } else {
            return [
              createTextVNode("Privacy Policy ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: "/terms-of-use",
        class: "hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Terms of Use`);
          } else {
            return [
              createTextVNode("Terms of Use")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div></div><div class="pt-8 border-t border-gray-800"><div class="flex flex-col md:flex-row justify-between items-center gap-4"><p class="text-gray-400 text-sm"> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} LinkSkool. All rights reserved. </p><div class="flex items-center gap-4"><a href="https://www.facebook.com/share/1Dwd5kQsgM/" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition-colors" aria-label="Facebook"><i class="fa-brands fa-facebook-f text-sm"></i></a><a href="https://x.com/DigitalDreamsNG" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-400 transition-colors" aria-label="X (formerly Twitter)"><i class="fa-brands fa-x text-sm"></i></a><a href="https://www.instagram.com/digitaldreamslimited/?hl=en" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-pink-600 transition-colors" aria-label="Instagram"><i class="fa-brands fa-instagram text-sm"></i></a><a href="https://www.linkedin.com/company/digital-dreams-limited/posts/?feedView=all" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-700 transition-colors" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in text-sm"></i></a><a href="https://www.youtube.com/@digitaldreamslimited" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-red-600 transition-colors" aria-label="YouTube"><i class="fa-brands fa-youtube text-sm"></i></a></div><a href="mailto:hello@linkskool.com" class="text-gray-400 hover:text-white transition-colors text-sm"> hello@linkskool.com </a></div></div></div></footer>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AppFooter = Object.assign(_sfc_main$1, { __name: "AppFooter" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const mobileMenuOpen = ref(false);
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100" }, _attrs))} data-v-367e370a><nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-367e370a><div class="flex justify-between items-center h-16" data-v-367e370a>`);
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/",
        class: "flex items-center gap-2 group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", logoSrc)} alt="LinkSkool" class="h-8 w-auto transition-transform group-hover:scale-105" data-v-367e370a${_scopeId}><span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent" data-v-367e370a${_scopeId}>LinkSkool</span>`);
          } else {
            return [
              createVNode("img", {
                src: logoSrc,
                alt: "LinkSkool",
                class: "h-8 w-auto transition-transform group-hover:scale-105"
              }),
              createVNode("span", { class: "text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent" }, "LinkSkool")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="hidden md:flex items-center gap-8" data-v-367e370a>`);
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/",
        class: "text-gray-600 hover:text-blue-600 transition-colors font-medium"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Home `);
          } else {
            return [
              createTextVNode(" Home ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/#programs",
        class: "text-gray-600 hover:text-blue-600 transition-colors font-medium"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Programs `);
          } else {
            return [
              createTextVNode(" Programs ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/news",
        class: "text-gray-600 hover:text-blue-600 transition-colors font-medium"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` News `);
          } else {
            return [
              createTextVNode(" News ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/about",
        class: "text-gray-600 hover:text-blue-600 transition-colors font-medium"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` About `);
          } else {
            return [
              createTextVNode(" About ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/contact",
        class: "text-gray-600 hover:text-blue-600 transition-colors font-medium"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Contact `);
          } else {
            return [
              createTextVNode(" Contact ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium cursor-pointer" data-v-367e370a> Get Started </button></div><button class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" aria-label="Toggle menu" data-v-367e370a><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-367e370a>`);
      if (!mobileMenuOpen.value) {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" data-v-367e370a></path>`);
      } else {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-367e370a></path>`);
      }
      _push(`</svg></button></div>`);
      if (mobileMenuOpen.value) {
        _push(`<div class="md:hidden py-4 border-t border-gray-100 animate-fade-in" data-v-367e370a><div class="flex flex-col gap-4" data-v-367e370a>`);
        _push(ssrRenderComponent(unref(RouterLink), {
          to: "/",
          onClick: toggleMobileMenu,
          class: "text-gray-600 hover:text-blue-600 transition-colors font-medium py-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Home `);
            } else {
              return [
                createTextVNode(" Home ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(RouterLink), {
          to: "/#programs",
          onClick: toggleMobileMenu,
          class: "text-gray-600 hover:text-blue-600 transition-colors font-medium py-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Programs `);
            } else {
              return [
                createTextVNode(" Programs ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(RouterLink), {
          to: "/news",
          onClick: toggleMobileMenu,
          class: "text-gray-600 hover:text-blue-600 transition-colors font-medium py-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` News `);
            } else {
              return [
                createTextVNode(" News ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(RouterLink), {
          to: "/about",
          onClick: toggleMobileMenu,
          class: "text-gray-600 hover:text-blue-600 transition-colors font-medium py-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` About `);
            } else {
              return [
                createTextVNode(" About ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(RouterLink), {
          to: "/contact",
          onClick: toggleMobileMenu,
          class: "text-gray-600 hover:text-blue-600 transition-colors font-medium py-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Contact `);
            } else {
              return [
                createTextVNode(" Contact ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<button class="mt-2 w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium cursor-pointer" data-v-367e370a> Get Started </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav></header>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AppHeader = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main, [["__scopeId", "data-v-367e370a"]]), { __name: "AppHeader" });

export { AppHeader as A, AppFooter as a, apiConfig as b, logoSrc as l };
//# sourceMappingURL=AppHeader-CiIf_B2g.mjs.map
