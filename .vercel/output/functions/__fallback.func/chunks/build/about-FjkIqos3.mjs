import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
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

const aboutStats = [
  { value: "1", label: "Unified education ecosystem" },
  { value: "7+", label: "Core platform capabilities" },
  { value: "Africa", label: "Long-term infrastructure focus" }
];
const aboutCapabilities = [
  {
    title: "Learning management",
    description: "Create, manage, and deliver digital learning content across programs and institutions.",
    icon: "fa-solid fa-graduation-cap"
  },
  {
    title: "Assessments and CBT",
    description: "Run secure tests, practice exams, certifications, and performance analysis.",
    icon: "fa-solid fa-file-lines"
  },
  {
    title: "School operations",
    description: "Manage records, attendance, results, academic activities, and administrative workflows.",
    icon: "fa-solid fa-school"
  },
  {
    title: "Education data layer",
    description: "Standardize data for learner tracking, institutional reporting, analytics, and integrations.",
    icon: "fa-solid fa-database"
  }
];
const aboutStakeholders = [
  "Primary and secondary schools",
  "Tertiary institutions",
  "Training and vocational centers",
  "Government education agencies",
  "Teachers and administrators",
  "Students and learners",
  "Educational content providers",
  "Professional training organizations"
];
const aboutFutureFocus = [
  "Large-scale government partnerships",
  "AI-powered educational analytics",
  "Learner identity and academic tracking",
  "Third-party education platform integrations",
  "Regional expansion across African markets"
];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "about",
  __ssrInlineRender: true,
  setup(__props) {
    usePageMeta({
      title: "About LinkSkool",
      description: "LinkSkool Online Ventures Limited builds education technology infrastructure for learning, assessment, school management, analytics, and education data across Africa.",
      keywords: "about LinkSkool, education technology, education data infrastructure, LMS, CBT, school management",
      url: "https://linkskool.com/about",
      image: "https://linkskool.com/assets/og-image.png",
      type: "website"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white" }, _attrs))}>`);
      _push(ssrRenderComponent(AppHeader, null, null, _parent));
      _push(`<main class="pt-28"><section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"><div class="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"><div><p class="text-sm font-bold uppercase tracking-wide text-blue-700">About LinkSkool</p><h1 class="mt-4 text-4xl font-black leading-tight text-slate-950 sm:text-6xl"> Building the data layer for modern education. </h1><p class="mt-6 text-lg leading-8 text-slate-600"> LinkSkool Online Ventures Limited is an education technology company building the digital infrastructure required to modernize learning, assessment, and education data management across Africa. </p></div><div class="rounded-md border border-gray-200 bg-gray-50 p-6 sm:p-8"><p class="text-sm font-bold uppercase tracking-wide text-slate-500">What we do</p><p class="mt-4 text-2xl font-black leading-snug text-slate-950"> We connect learning, assessments, records, operations, analytics, and data services inside one education ecosystem. </p><div class="mt-8 grid gap-3 sm:grid-cols-3"><!--[-->`);
      ssrRenderList(unref(aboutStats), (stat) => {
        _push(`<div class="rounded-md bg-white p-4"><p class="text-2xl font-black text-blue-700">${ssrInterpolate(stat.value)}</p><p class="mt-1 text-xs font-semibold leading-5 text-slate-500">${ssrInterpolate(stat.label)}</p></div>`);
      });
      _push(`<!--]--></div></div></div></section><section class="py-20"><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="max-w-3xl"><p class="text-sm font-bold uppercase tracking-wide text-blue-700">Platform</p><h2 class="mt-3 text-3xl font-black text-slate-950">One ecosystem. Many education workflows.</h2></div><div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4"><!--[-->`);
      ssrRenderList(unref(aboutCapabilities), (capability) => {
        _push(`<div class="rounded-md border border-gray-200 bg-white p-5 shadow-sm"><span class="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-blue-700"><i class="${ssrRenderClass(capability.icon)}"></i></span><h3 class="mt-5 text-lg font-black text-slate-950">${ssrInterpolate(capability.title)}</h3><p class="mt-2 text-sm leading-6 text-slate-600">${ssrInterpolate(capability.description)}</p></div>`);
      });
      _push(`<!--]--></div></div></section><section class="bg-slate-950 py-20 text-white"><div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="grid gap-10 lg:grid-cols-2"><div><p class="text-sm font-bold uppercase tracking-wide text-blue-300">Mission</p><h2 class="mt-3 text-3xl font-black">Simplify and unify education data.</h2><p class="mt-4 leading-8 text-slate-300"> Our mission is to provide a platform that improves learning, enhances teaching, and enables data-driven decision-making for institutions, learners, and governments. </p></div><div><p class="text-sm font-bold uppercase tracking-wide text-orange-300">Vision</p><h2 class="mt-3 text-3xl font-black">Become the primary digital infrastructure for education.</h2><p class="mt-4 leading-8 text-slate-300"> We are building toward a connected education ecosystem where learning, assessment, and academic data can move across institutions securely and intelligently. </p></div></div></div></section><section class="py-20"><div class="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8"><div><h2 class="text-3xl font-black text-slate-950">Who we serve</h2><div class="mt-6 flex flex-wrap gap-3"><!--[-->`);
      ssrRenderList(unref(aboutStakeholders), (stakeholder) => {
        _push(`<span class="rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-bold text-slate-700">${ssrInterpolate(stakeholder)}</span>`);
      });
      _push(`<!--]--></div></div><div><h2 class="text-3xl font-black text-slate-950">Where we are going</h2><ul class="mt-6 space-y-3"><!--[-->`);
      ssrRenderList(unref(aboutFutureFocus), (focus) => {
        _push(`<li class="flex gap-3 text-sm font-semibold text-slate-700"><i class="fa-solid fa-arrow-trend-up mt-1 text-blue-600"></i><span>${ssrInterpolate(focus)}</span></li>`);
      });
      _push(`<!--]--></ul></div></div></section></main>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=about-FjkIqos3.mjs.map
