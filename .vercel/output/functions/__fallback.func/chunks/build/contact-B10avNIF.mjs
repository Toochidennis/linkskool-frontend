import { defineComponent, mergeProps, unref, reactive, ref, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { A as AppHeader, a as AppFooter } from './AppHeader-CiIf_B2g.mjs';
import { u as usePageMeta } from './usePageMeta-oq6avMrt.mjs';
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

const supportEmail = "support@linkskool.com";
const useContactForm = () => {
  const form = reactive({
    name: "",
    email: "",
    reason: "Enrollment",
    message: ""
  });
  const errors = reactive({});
  const hasSubmitted = ref(false);
  const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()));
  const validate = () => {
    errors.name = "";
    errors.email = "";
    errors.reason = "";
    errors.message = "";
    if (!form.name.trim()) {
      errors.name = "Enter your name";
    }
    if (!form.email.trim()) {
      errors.email = "Enter your email";
    } else if (!isEmailValid.value) {
      errors.email = "Enter a valid email";
    }
    if (!form.reason.trim()) {
      errors.reason = "Choose a reason";
    }
    if (form.message.trim().length < 10) {
      errors.message = "Tell us a little more";
    }
    return !errors.name && !errors.email && !errors.reason && !errors.message;
  };
  const submit = () => {
    hasSubmitted.value = true;
    if (!validate()) {
      return;
    }
    const subject = encodeURIComponent(`${form.reason} - ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name.trim()}
Email: ${form.email.trim()}
Reason: ${form.reason}

${form.message.trim()}`
    );
    (void 0).location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  };
  return {
    errors,
    form,
    hasSubmitted,
    submit
  };
};
const contactChannels = [
  {
    title: "Student support",
    description: "Enrollment, payment, cohort access, and course questions.",
    icon: "fa-solid fa-life-ring",
    href: "mailto:support@linkskool.com",
    action: "support@linkskool.com",
    accent: "text-blue-600 bg-blue-50"
  },
  {
    title: "Partnerships",
    description: "Workshops, institutional programs, media, and business collaborations.",
    icon: "fa-solid fa-handshake",
    href: "mailto:info@linkskool.com",
    action: "info@linkskool.com",
    accent: "text-orange-600 bg-orange-50"
  },
  {
    title: "Call us",
    description: "Speak with the team during working hours.",
    icon: "fa-solid fa-phone",
    href: "tel:+234907694303",
    action: "+234 907 694 303",
    accent: "text-emerald-600 bg-emerald-50"
  }
];
const contactReasons = [
  "Enrollment",
  "Payment support",
  "Programs",
  "Partnerships",
  "Technical issue",
  "Other"
];
const officeDetails = {
  location: "Enugu, Nigeria",
  email: "support@linkskool.com",
  responseTime: "Typical response: within 1 business day"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    usePageMeta({
      title: "Contact LinkSkool",
      description: "Contact LinkSkool for enrollment support, payment questions, partnerships, program enquiries, and technical help.",
      keywords: "contact LinkSkool, LinkSkool support, enrollment help, program support",
      url: "https://linkskool.com/contact",
      image: "https://linkskool.com/assets/og-image.png",
      type: "website"
    });
    const { errors, form } = useContactForm();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}>`);
      _push(ssrRenderComponent(AppHeader, null, null, _parent));
      _push(`<main class="pt-28"><section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"><div class="max-w-3xl"><p class="text-sm font-bold uppercase tracking-wide text-blue-700">Contact</p><h1 class="mt-3 text-4xl font-black leading-tight text-slate-950 sm:text-6xl"> Get the right help faster. </h1><p class="mt-5 text-lg leading-8 text-slate-600"> Choose a direct contact path or send a short message. We route support requests by topic so the right team can respond. </p></div><div class="mt-12 grid gap-4 md:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(contactChannels), (channel) => {
        _push(`<a${ssrRenderAttr("href", channel.href)} class="group rounded-md border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><span class="${ssrRenderClass([channel.accent, "flex h-11 w-11 items-center justify-center rounded-md"])}"><i class="${ssrRenderClass(channel.icon)}"></i></span><h2 class="mt-5 text-lg font-black text-slate-950">${ssrInterpolate(channel.title)}</h2><p class="mt-2 min-h-12 text-sm leading-6 text-slate-600">${ssrInterpolate(channel.description)}</p><p class="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700">${ssrInterpolate(channel.action)} <i class="fa-solid fa-arrow-right text-xs transition group-hover:translate-x-0.5"></i></p></a>`);
      });
      _push(`<!--]--></div><div class="mt-12 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start"><aside class="space-y-4"><div class="rounded-md border border-gray-200 bg-white p-6 shadow-sm"><h2 class="text-xl font-black text-slate-950">Office</h2><dl class="mt-5 space-y-4 text-sm"><div><dt class="font-bold text-slate-500">Location</dt><dd class="mt-1 text-slate-900">${ssrInterpolate(unref(officeDetails).location)}</dd></div><div><dt class="font-bold text-slate-500">Email</dt><dd class="mt-1"><a${ssrRenderAttr("href", `mailto:${unref(officeDetails).email}`)} class="font-semibold text-blue-700 hover:text-blue-900">${ssrInterpolate(unref(officeDetails).email)}</a></dd></div><div><dt class="font-bold text-slate-500">Response</dt><dd class="mt-1 text-slate-900">${ssrInterpolate(unref(officeDetails).responseTime)}</dd></div></dl></div><div class="rounded-md border border-blue-100 bg-blue-50 p-6"><h2 class="text-base font-black text-slate-950">Before you write</h2><p class="mt-2 text-sm leading-6 text-slate-600"> Include your program name, payment reference, or cohort details when relevant. </p></div></aside><form class="rounded-md border border-gray-200 bg-white p-5 shadow-sm sm:p-8"><div class="grid gap-5 sm:grid-cols-2"><div><label for="contact-name" class="text-sm font-bold text-slate-700">Name</label><input id="contact-name"${ssrRenderAttr("value", unref(form).name)} type="text" autocomplete="name" class="${ssrRenderClass([unref(errors).name ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100", "mt-2 w-full rounded-md border px-4 py-3 text-sm outline-none transition focus:ring-2"])}">`);
      if (unref(errors).name) {
        _push(`<p class="mt-1 text-xs font-semibold text-red-600">${ssrInterpolate(unref(errors).name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label for="contact-email" class="text-sm font-bold text-slate-700">Email</label><input id="contact-email"${ssrRenderAttr("value", unref(form).email)} type="email" autocomplete="email" class="${ssrRenderClass([unref(errors).email ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100", "mt-2 w-full rounded-md border px-4 py-3 text-sm outline-none transition focus:ring-2"])}">`);
      if (unref(errors).email) {
        _push(`<p class="mt-1 text-xs font-semibold text-red-600">${ssrInterpolate(unref(errors).email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="mt-5"><label for="contact-reason" class="text-sm font-bold text-slate-700">Reason</label><select id="contact-reason" class="mt-2 w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"><!--[-->`);
      ssrRenderList(unref(contactReasons), (reason) => {
        _push(`<option${ssrRenderAttr("value", reason)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).reason) ? ssrLooseContain(unref(form).reason, reason) : ssrLooseEqual(unref(form).reason, reason)) ? " selected" : ""}>${ssrInterpolate(reason)}</option>`);
      });
      _push(`<!--]--></select></div><div class="mt-5"><label for="contact-message" class="text-sm font-bold text-slate-700">Message</label><textarea id="contact-message" rows="7" class="${ssrRenderClass([unref(errors).message ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:border-blue-500 focus:ring-blue-100", "mt-2 w-full resize-y rounded-md border px-4 py-3 text-sm leading-6 outline-none transition focus:ring-2"])}">${ssrInterpolate(unref(form).message)}</textarea>`);
      if (unref(errors).message) {
        _push(`<p class="mt-1 text-xs font-semibold text-red-600">${ssrInterpolate(unref(errors).message)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p class="text-xs leading-5 text-slate-500"> This opens your email app with the message prepared. </p><button type="submit" class="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 cursor-pointer"> Send message <i class="fa-solid fa-paper-plane text-xs"></i></button></div></form></div></section></main>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=contact-B10avNIF.mjs.map
