import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { useRoute, RouterLink } from 'vue-router';
import { A as AppHeader, l as logoSrc, a as AppFooter } from './AppHeader-CiIf_B2g.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "completion",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const normalizeQueryKey = (key) => key.trim().replace(/^amp;/i, "").toLowerCase();
    const getQueryParam = (...keys) => {
      const normalizedKeys = new Set(keys.map((key) => key.toLowerCase()));
      for (const key of keys) {
        const raw = route.query[key];
        if (Array.isArray(raw)) {
          return raw[0] ?? "";
        }
        if (typeof raw === "string") {
          return raw;
        }
      }
      for (const [queryKey, rawValue] of Object.entries(route.query)) {
        if (!normalizedKeys.has(normalizeQueryKey(queryKey))) continue;
        if (Array.isArray(rawValue)) {
          return rawValue[0] ?? "";
        }
        if (typeof rawValue === "string") {
          return rawValue;
        }
      }
      return "";
    };
    const programs = ref([]);
    ref(false);
    const androidAppUrl = "https://play.google.com/store/apps/details?id=com.linkskool.app"?.trim() ?? "";
    const iosAppUrl = "https://apps.apple.com/app/linkskool/id1234567890"?.trim() ?? "";
    const desktopAppUrl = "https://app.linskkool.com"?.trim() ?? "";
    const showVideoModal = ref(false);
    const callbackProgramSlug = computed(() => {
      return getQueryParam("program").trim();
    });
    const callbackWhatsappGroupLink = computed(() => {
      return getQueryParam("whatsapp").trim();
    });
    const completionType = computed(() => {
      const value = getQueryParam("completion");
      return value.toLowerCase() === "enrollment" ? "enrollment" : "reservation";
    });
    const isEnrollmentCompletion = computed(() => completionType.value === "enrollment");
    const selectedProgram = computed(() => {
      const slug = callbackProgramSlug.value.toLowerCase();
      if (!slug) return null;
      return programs.value.find((program) => program.slug.toLowerCase() === slug) ?? null;
    });
    const hasAndroidAppUrl = computed(() => Boolean(androidAppUrl));
    const hasDesktopAppUrl = computed(() => Boolean(desktopAppUrl));
    const whatsappJoinLink = computed(() => callbackWhatsappGroupLink.value);
    const hasWhatsappStep = computed(() => Boolean(whatsappJoinLink.value));
    const normalizeUrl = (rawUrl) => {
      const cleaned = rawUrl.trim();
      if (!cleaned) return "";
      if (/^https?:\/\//i.test(cleaned)) return cleaned;
      return `https://${cleaned}`;
    };
    const parseStepSegments = (value) => {
      const text = value.trim();
      if (!text) return [];
      const linkRegex = /(https?:\/\/[^\s<>")]+|www\.[^\s<>")]+)/gi;
      const segments = [];
      let lastIndex = 0;
      let match;
      while ((match = linkRegex.exec(text)) !== null) {
        const [url] = match;
        const start = match.index;
        if (start > lastIndex) {
          segments.push({
            kind: "text",
            content: text.slice(lastIndex, start)
          });
        }
        segments.push({
          kind: "link",
          content: url,
          href: normalizeUrl(url)
        });
        lastIndex = start + url.length;
      }
      if (lastIndex < text.length) {
        segments.push({
          kind: "text",
          content: text.slice(lastIndex)
        });
      }
      return segments.length > 0 ? segments : [{ kind: "text", content: text }];
    };
    const toEmbeddableVideoUrl = (rawUrl) => {
      const value = rawUrl?.trim();
      if (!value) return null;
      try {
        const parsed = new URL(value);
        const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
        if (host === "youtu.be") {
          const id = parsed.pathname.replace(/^\//, "");
          return id ? `https://www.youtube.com/embed/${id}` : null;
        }
        if (host.includes("youtube.com")) {
          if (parsed.pathname.startsWith("/embed/")) {
            return parsed.toString();
          }
          const id = parsed.searchParams.get("v");
          return id ? `https://www.youtube.com/embed/${id}` : null;
        }
        return value;
      } catch {
        return null;
      }
    };
    const additionalOnboardingSteps = computed(() => {
      const onboardingSteps = selectedProgram.value?.onboardingSteps;
      if (!onboardingSteps) return [];
      return onboardingSteps.map((step) => step.trim()).filter(Boolean);
    });
    const parsedAdditionalOnboardingSteps = computed(
      () => additionalOnboardingSteps.value.map((step) => ({
        text: step,
        segments: parseStepSegments(step)
      }))
    );
    const programVideoEmbedUrl = computed(() => toEmbeddableVideoUrl(selectedProgram.value?.videoUrl ?? null));
    const hasVideoStep = computed(() => Boolean(selectedProgram.value?.videoUrl && programVideoEmbedUrl.value));
    const videoStepNumber = computed(() => hasWhatsappStep.value ? 3 : 2);
    const remainingStepsStartNumber = computed(() => videoStepNumber.value + (hasVideoStep.value ? 1 : 0));
    const programVideoPreviewUrl = computed(() => {
      const embed = programVideoEmbedUrl.value;
      if (!embed) return null;
      const match = embed.match(/\/embed\/([^/?]+)/);
      return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
    });
    const faqStepNumber = computed(() => remainingStepsStartNumber.value + parsedAdditionalOnboardingSteps.value.length);
    usePageMeta(() => ({
      title: isEnrollmentCompletion.value ? "Enrollment Complete | Linkskool" : "Reservation Complete | Linkskool",
      description: isEnrollmentCompletion.value ? "Your Linkskool enrollment is complete. Follow onboarding steps to get started." : "Your Linkskool reservation is complete. Follow onboarding steps to get started.",
      keywords: "reservation completion, onboarding steps, linkskool",
      url: "https://linkskool.com/reservation/completion",
      image: "https://linkskool.com/assets/og-image.png",
      type: "website"
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}>`);
      _push(ssrRenderComponent(AppHeader, null, null, _parent));
      _push(`<section class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-orange-600 pt-24 pb-16"><div class="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-300/20 blur-2xl"></div><div class="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-orange-300/20 blur-2xl"></div><div class="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"><div class="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm"><i class="${ssrRenderClass(isEnrollmentCompletion.value ? "fa-solid fa-circle-check" : "fa-solid fa-bookmark")}"></i><span>${ssrInterpolate(isEnrollmentCompletion.value ? "Enrollment Complete" : "Reservation Complete")}</span></div><h1 class="mt-6 max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl">${ssrInterpolate(isEnrollmentCompletion.value ? "Thank you for your enrollment" : "Your seat has been reserved")}</h1><p class="mt-5 max-w-3xl text-lg leading-relaxed text-blue-100">${ssrInterpolate(isEnrollmentCompletion.value ? selectedProgram.value?.name ? `Your enrollment for ${selectedProgram.value.name} is confirmed. Follow these onboarding steps to get started.` : "Your enrollment is confirmed. Follow these onboarding steps to get started." : selectedProgram.value?.name ? `Your reservation for ${selectedProgram.value.name} is confirmed. Follow these onboarding steps to get started.` : "Your reservation is confirmed. Follow these onboarding steps to get started.")}</p><div class="mt-8 flex flex-wrap items-center gap-4"><a href="#next-steps" class="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-xl"><span>Start onboarding steps</span><i class="fa-solid fa-arrow-down"></i></a>`);
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/#programs",
        class: "inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-white/20"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${_scopeId}>Explore programs later</span>`);
          } else {
            return [
              createVNode("span", null, "Explore programs later")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section><section id="next-steps" class="py-16 bg-white"><div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"><div class="mb-10"><h2 class="text-3xl font-black text-gray-900 md:text-4xl">What to do next</h2><p class="mt-2 text-gray-600">Complete these onboarding steps to begin learning smoothly.</p></div><div class="space-y-5"><article class="rounded-2xl border border-blue-100 bg-blue-50/60 p-5 md:p-6"><div class="flex items-start gap-4"><div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white"> 1 </div><div class="flex-1"><h3 class="text-xl font-bold text-gray-900">Download the LinkSkool app</h3><p class="mt-1 text-gray-600">Install on Android or Desktop. iOS will be available soon.</p><div class="mt-4 flex flex-wrap gap-3">`);
      if (hasAndroidAppUrl.value) {
        _push(`<a${ssrRenderAttr("href", unref(androidAppUrl))} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-green-700"><i class="fa-brands fa-google-play"></i><span>Android (Play Store)</span></a>`);
      } else {
        _push(`<button type="button" disabled class="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-5 py-3 font-semibold text-gray-500" aria-disabled="true"><i class="fa-brands fa-google-play"></i><span>Android (Unavailable)</span></button>`);
      }
      if (hasDesktopAppUrl.value) {
        _push(`<a${ssrRenderAttr("href", unref(desktopAppUrl))} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-800 transition-colors hover:border-blue-300 hover:text-blue-700"><img${ssrRenderAttr("src", unref(logoSrc))} alt="LinkSkool" class="h-5 w-5 object-contain"><span>Desktop App</span></a>`);
      } else {
        _push(`<button type="button" disabled class="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-5 py-3 font-semibold text-gray-500" aria-disabled="true"><img${ssrRenderAttr("src", unref(logoSrc))} alt="LinkSkool" class="h-5 w-5 object-contain opacity-50"><span>Desktop (Unavailable)</span></button>`);
      }
      _push(`<button type="button" disabled class="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-5 py-3 font-semibold text-gray-500"${ssrRenderAttr("title", unref(iosAppUrl) ? "iOS app coming soon" : "iOS app not available yet")} aria-disabled="true"><i class="fa-brands fa-apple"></i><span>iOS (Coming soon)</span></button></div></div></div></article>`);
      if (hasWhatsappStep.value) {
        _push(`<article class="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 md:p-6"><div class="flex items-start gap-4"><div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white"> 2 </div><div class="flex-1"><h3 class="text-xl font-bold text-gray-900">Join the WhatsApp group</h3><p class="mt-1 text-gray-600">Receive onboarding updates, class reminders, and direct support.</p><a${ssrRenderAttr("href", whatsappJoinLink.value)} target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-green-600"><i class="fa-brands fa-whatsapp"></i><span>Join WhatsApp Group</span></a></div></div></article>`);
      } else {
        _push(`<!---->`);
      }
      if (hasVideoStep.value) {
        _push(`<article class="overflow-hidden rounded-2xl border border-orange-100 bg-orange-50/60"><div class="flex min-h-[200px] flex-col md:flex-row"><div class="flex flex-1 flex-col justify-between gap-4 p-5 md:p-6"><div class="flex items-start gap-4"><div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">${ssrInterpolate(videoStepNumber.value)}</div><div><h3 class="text-xl font-bold text-gray-900">Watch onboarding video</h3><p class="mt-1 text-gray-600">Get a quick walkthrough before your first class.</p></div></div><button type="button" class="inline-flex w-fit items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-orange-700"><i class="fa-solid fa-circle-play"></i><span>Watch onboarding video</span></button></div><button type="button" class="group relative shrink-0 md:w-80">`);
        if (programVideoPreviewUrl.value) {
          _push(`<img${ssrRenderAttr("src", programVideoPreviewUrl.value)} alt="Video preview" class="h-full w-full object-cover">`);
        } else {
          _push(`<div class="flex h-full min-h-[160px] w-full items-center justify-center bg-orange-100 text-orange-300"><i class="fa-solid fa-circle-play text-5xl"></i></div>`);
        }
        _push(`<div class="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40"><i class="fa-solid fa-circle-play text-5xl text-white drop-shadow"></i></div></button></div></article>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(parsedAdditionalOnboardingSteps.value, (step, index) => {
        _push(`<article class="rounded-2xl border border-gray-200 bg-white p-5 md:p-6"><div class="flex items-start gap-4"><div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">${ssrInterpolate(remainingStepsStartNumber.value + index)}</div><div class="flex-1 pt-1 text-gray-700 leading-relaxed"><!--[-->`);
        ssrRenderList(step.segments, (segment, segmentIndex) => {
          _push(`<!--[-->`);
          if (segment.kind === "link" && segment.href) {
            _push(`<a${ssrRenderAttr("href", segment.href)} target="_blank" rel="noopener noreferrer" class="font-semibold text-blue-700 underline decoration-blue-300">${ssrInterpolate(segment.content)}</a>`);
          } else {
            _push(`<span>${ssrInterpolate(segment.content)}</span>`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></div></div></article>`);
      });
      _push(`<!--]--><article class="rounded-2xl border border-violet-100 bg-violet-50/60 p-5 md:p-6"><div class="flex items-start gap-4"><div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">${ssrInterpolate(faqStepNumber.value)}</div><div class="flex-1"><h3 class="text-xl font-bold text-gray-900">Need more guidance?</h3><p class="mt-1 text-gray-600">Check the FAQs for additional help and common answers.</p>`);
      _push(ssrRenderComponent(unref(RouterLink), {
        to: "/faqs",
        class: "mt-4 inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-5 py-3 font-semibold text-violet-700 transition-colors hover:bg-violet-100"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fa-solid fa-circle-question"${_scopeId}></i><span${_scopeId}>Check FAQs</span>`);
          } else {
            return [
              createVNode("i", { class: "fa-solid fa-circle-question" }),
              createVNode("span", null, "Check FAQs")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></article></div></div></section>`);
      if (showVideoModal.value && programVideoEmbedUrl.value) {
        _push(`<div class="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/80 p-4"><div class="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"><button type="button" class="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-900 transition-colors hover:bg-white" aria-label="Close video modal"><i class="fa-solid fa-xmark"></i></button><div class="aspect-video w-full"><iframe${ssrRenderAttr("src", programVideoEmbedUrl.value)} class="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reservation/completion.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=completion-BSUP3iX3.mjs.map
