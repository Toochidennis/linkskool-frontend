import { defineComponent, ref, computed, watch, mergeProps, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { A as AppHeader, a as AppFooter } from './AppHeader-CiIf_B2g.mjs';
import { _ as _export_sfc } from './server.mjs';
import { a as apiRequest } from './client-DcOxoYBd.mjs';
import { e as enrollmentService } from './enrollmentService-ZuKei9hJ.mjs';
import { r as resolveAssetUrl } from './assetUrl-BkGibEdX.mjs';
import { u as usePageMeta } from './usePageMeta-oq6avMrt.mjs';
import { r as readPendingPayment } from './pendingPayment-AMK2PAsl.mjs';
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

const programService = {
  async getAllPrograms(signal) {
    const response = await apiRequest("programs", {
      method: "GET",
      signal
    });
    return response.data;
  },
  async getProgramCourses(programSlug, signal) {
    const response = await apiRequest(`programs/${programSlug}/courses`, {
      method: "GET",
      signal
    });
    return response.data;
  },
  async getProgramCourseCohortDetails(cohortSlug, signal) {
    const response = await apiRequest(`programs/cohorts/${cohortSlug}`, {
      method: "GET",
      signal
    });
    return response.data;
  },
  async enrollInCourse(cohortId, payload, signal) {
    const response = await apiRequest(`learning/cohorts/${cohortId}/enrollments`, {
      method: "POST",
      signal,
      body: payload
    });
    return response.data;
  }
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "EnrollmentCard",
  __ssrInlineRender: true,
  props: {
    courseDetail: {}
  },
  emits: ["enroll", "reserve"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const nairaFormatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2
    });
    const displayPrice = computed(() => {
      if (props.courseDetail.cohort.isFree) {
        return "Free";
      }
      const price = props.courseDetail.cohort.cost || 0;
      const discount = props.courseDetail.cohort.discount || 0;
      if (discount > 0) {
        const discountedPrice = price - price * discount / 100;
        return {
          current: nairaFormatter.format(discountedPrice),
          original: nairaFormatter.format(price),
          discount
        };
      }
      return nairaFormatter.format(price);
    });
    const learningTypeLabel = computed(
      () => props.courseDetail.cohort.learningType === "instructor_led" ? "Instructor-led" : "Self-paced"
    );
    const isFreeCourse = computed(() => Boolean(props.courseDetail.cohort.isFree));
    const enrollmentDeadlineDate = computed(() => {
      const rawValue = props.courseDetail.cohort.enrollmentDeadline;
      if (!rawValue) return null;
      const parsed = new Date(rawValue);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    });
    const isEnrollmentClosed = computed(
      () => props.courseDetail.cohort.learningType === "instructor_led" && enrollmentDeadlineDate.value !== null && enrollmentDeadlineDate.value.getTime() < Date.now()
    );
    const formatDate = (dateString) => {
      if (!dateString) return "Not set";
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return "Not set";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    };
    const formatDateTime = (value) => {
      if (!value) return "Not set";
      return value.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="sticky top-24 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden" data-v-7fa17ec0><div class="p-6 bg-gradient-to-br from-blue-50 to-orange-50 border-b border-gray-200" data-v-7fa17ec0>`);
      if (typeof displayPrice.value === "string") {
        _push(`<div class="text-center" data-v-7fa17ec0><div class="${ssrRenderClass([displayPrice.value === "Free" ? "text-green-600" : "text-gray-900", "text-4xl font-bold"])}" data-v-7fa17ec0>${ssrInterpolate(displayPrice.value)}</div></div>`);
      } else {
        _push(`<div class="text-center space-y-2" data-v-7fa17ec0><div class="flex items-center justify-center gap-3" data-v-7fa17ec0><span class="text-4xl font-bold text-gray-900" data-v-7fa17ec0>${ssrInterpolate(displayPrice.value.current)}</span><span class="text-xl text-gray-400 line-through" data-v-7fa17ec0>${ssrInterpolate(displayPrice.value.original)}</span></div><div class="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold" data-v-7fa17ec0> Save ${ssrInterpolate(displayPrice.value.discount)}% </div></div>`);
      }
      _push(`</div><div class="p-6 space-y-6" data-v-7fa17ec0><div class="space-y-3" data-v-7fa17ec0><button${ssrIncludeBooleanAttr(isEnrollmentClosed.value) ? " disabled" : ""} class="${ssrRenderClass([
        "w-full px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 group",
        isEnrollmentClosed.value ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-xl hover:scale-105 cursor-pointer"
      ])}" data-v-7fa17ec0><i class="fa-solid fa-graduation-cap" data-v-7fa17ec0></i><span data-v-7fa17ec0>Enroll Now</span><i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform text-sm" data-v-7fa17ec0></i></button>`);
      if (!isFreeCourse.value) {
        _push(`<button${ssrIncludeBooleanAttr(isEnrollmentClosed.value) ? " disabled" : ""} class="${ssrRenderClass([
          "w-full px-6 py-4 rounded-xl font-semibold border-2 transition-all duration-200 flex items-center justify-center gap-2",
          isEnrollmentClosed.value ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed" : "bg-white text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-600 hover:shadow-lg cursor-pointer"
        ])}" data-v-7fa17ec0><i class="fa-solid fa-bookmark" data-v-7fa17ec0></i><span data-v-7fa17ec0>Reserve Seat</span></button>`);
      } else {
        _push(`<!---->`);
      }
      if (isEnrollmentClosed.value) {
        _push(`<p class="text-sm text-red-600 font-medium" data-v-7fa17ec0> Enrollment is closed for this instructor-led cohort. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="pt-6 border-t border-gray-200 space-y-4" data-v-7fa17ec0><h3 class="font-semibold text-gray-900 text-lg" data-v-7fa17ec0>Course Information</h3><div class="flex items-start gap-3" data-v-7fa17ec0><div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0" data-v-7fa17ec0><i class="fa-solid fa-calendar-day text-blue-600" data-v-7fa17ec0></i></div><div class="flex-1" data-v-7fa17ec0><div class="text-sm text-gray-500" data-v-7fa17ec0>Start Date</div><div class="font-semibold text-gray-900" data-v-7fa17ec0>${ssrInterpolate(formatDate(__props.courseDetail.cohort.startDate))}</div></div></div><div class="flex items-start gap-3" data-v-7fa17ec0><div class="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0" data-v-7fa17ec0><i class="fa-solid fa-calendar-check text-orange-600" data-v-7fa17ec0></i></div><div class="flex-1" data-v-7fa17ec0><div class="text-sm text-gray-500" data-v-7fa17ec0>End Date</div><div class="font-semibold text-gray-900" data-v-7fa17ec0>${ssrInterpolate(formatDate(__props.courseDetail.cohort.endDate))}</div></div></div><div class="flex items-start gap-3" data-v-7fa17ec0><div class="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0" data-v-7fa17ec0><i class="fa-solid fa-signal text-indigo-600" data-v-7fa17ec0></i></div><div class="flex-1" data-v-7fa17ec0><div class="text-sm text-gray-500" data-v-7fa17ec0>Learning Type</div><div class="font-semibold text-gray-900" data-v-7fa17ec0>${ssrInterpolate(learningTypeLabel.value)}</div></div></div><div class="flex items-start gap-3" data-v-7fa17ec0><div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0" data-v-7fa17ec0><i class="fa-solid fa-hourglass-end text-red-600" data-v-7fa17ec0></i></div><div class="flex-1" data-v-7fa17ec0><div class="text-sm text-gray-500" data-v-7fa17ec0>Enrollment Deadline</div><div class="font-semibold text-gray-900" data-v-7fa17ec0>${ssrInterpolate(formatDateTime(enrollmentDeadlineDate.value))}</div></div></div>`);
      if (__props.courseDetail.cohort.instructorName) {
        _push(`<div class="flex items-start gap-3" data-v-7fa17ec0><div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0" data-v-7fa17ec0><i class="fa-solid fa-user-tie text-green-600" data-v-7fa17ec0></i></div><div class="flex-1" data-v-7fa17ec0><div class="text-sm text-gray-500" data-v-7fa17ec0>Instructor</div><div class="font-semibold text-gray-900" data-v-7fa17ec0>${ssrInterpolate(__props.courseDetail.cohort.instructorName)}</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="pt-6 border-t border-gray-200 space-y-3" data-v-7fa17ec0><div class="flex items-center gap-2 text-sm text-gray-600" data-v-7fa17ec0><i class="fa-solid fa-check-circle text-green-500" data-v-7fa17ec0></i><span data-v-7fa17ec0>Lifetime access</span></div><div class="flex items-center gap-2 text-sm text-gray-600" data-v-7fa17ec0><i class="fa-solid fa-certificate text-blue-500" data-v-7fa17ec0></i><span data-v-7fa17ec0>Certificate of completion</span></div><div class="flex items-center gap-2 text-sm text-gray-600" data-v-7fa17ec0><i class="fa-solid fa-mobile-screen text-orange-500" data-v-7fa17ec0></i><span data-v-7fa17ec0>Access on mobile and desktop</span></div></div></div></div>`);
      if (!isEnrollmentClosed.value) {
        _push(`<button class="hidden lg:flex fixed bottom-8 right-8 px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-[0_20px_60px_rgba(59,130,246,0.5)] hover:scale-110 transition-all duration-300 items-center gap-3 group z-50 cursor-pointer animate-bounce-slow" data-v-7fa17ec0><i class="fa-solid fa-graduation-cap text-xl" data-v-7fa17ec0></i><span data-v-7fa17ec0>Enroll Now</span><i class="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform" data-v-7fa17ec0></i></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EnrollmentCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const EnrollmentCard = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-7fa17ec0"]]), { __name: "EnrollmentCard" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "EnrollmentForm",
  __ssrInlineRender: true,
  props: {
    courseDetail: {},
    mode: {},
    submitError: {},
    isSubmitting: { type: Boolean }
  },
  emits: ["close", "submit"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const formData = reactive({
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    });
    const errors = reactive({
      firstName: "",
      lastName: "",
      email: "",
      phone: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" }, _attrs))} data-v-8a5c2aff><div class="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto animate-scale-in" data-v-8a5c2aff><div class="relative bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white" data-v-8a5c2aff><button class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer" aria-label="Close" data-v-8a5c2aff><i class="fa-solid fa-xmark text-xl" data-v-8a5c2aff></i></button><h2 class="text-2xl font-bold mb-2" data-v-8a5c2aff>Enroll in Course</h2><p class="text-blue-100" data-v-8a5c2aff>${ssrInterpolate(__props.courseDetail.course.courseName)}</p></div><form class="p-8 pb-12" data-v-8a5c2aff><div class="space-y-6" data-v-8a5c2aff>`);
      if (props.submitError) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" data-v-8a5c2aff>${ssrInterpolate(props.submitError)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-8a5c2aff><div data-v-8a5c2aff><label for="firstName" class="block text-sm font-semibold text-gray-700 mb-2" data-v-8a5c2aff> First Name <span class="text-red-500" data-v-8a5c2aff>*</span></label><input id="firstName"${ssrRenderAttr("value", formData.firstName)} type="text" class="${ssrRenderClass([
        "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all",
        errors.firstName ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      ])}" placeholder="John" data-v-8a5c2aff>`);
      if (errors.firstName) {
        _push(`<p class="mt-1.5 text-sm text-red-600" data-v-8a5c2aff>${ssrInterpolate(errors.firstName)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-8a5c2aff><label for="lastName" class="block text-sm font-semibold text-gray-700 mb-2" data-v-8a5c2aff> Last Name <span class="text-red-500" data-v-8a5c2aff>*</span></label><input id="lastName"${ssrRenderAttr("value", formData.lastName)} type="text" class="${ssrRenderClass([
        "w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all",
        errors.lastName ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      ])}" placeholder="Doe" data-v-8a5c2aff>`);
      if (errors.lastName) {
        _push(`<p class="mt-1.5 text-sm text-red-600" data-v-8a5c2aff>${ssrInterpolate(errors.lastName)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div data-v-8a5c2aff><label for="email" class="block text-sm font-semibold text-gray-700 mb-2" data-v-8a5c2aff> Email Address <span class="text-red-500" data-v-8a5c2aff>*</span></label><div class="relative" data-v-8a5c2aff><div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" data-v-8a5c2aff><i class="fa-solid fa-envelope text-gray-400" data-v-8a5c2aff></i></div><input id="email"${ssrRenderAttr("value", formData.email)} type="email" class="${ssrRenderClass([
        "w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all",
        errors.email ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      ])}" placeholder="john.doe@example.com" data-v-8a5c2aff></div>`);
      if (errors.email) {
        _push(`<p class="mt-1.5 text-sm text-red-600" data-v-8a5c2aff>${ssrInterpolate(errors.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div data-v-8a5c2aff><label for="phone" class="block text-sm font-semibold text-gray-700 mb-2" data-v-8a5c2aff> Phone Number <span class="text-red-500" data-v-8a5c2aff>*</span></label><div class="relative" data-v-8a5c2aff><div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" data-v-8a5c2aff><i class="fa-solid fa-phone text-gray-400" data-v-8a5c2aff></i></div><input id="phone"${ssrRenderAttr("value", formData.phone)} type="tel" class="${ssrRenderClass([
        "w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all",
        errors.phone ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      ])}" placeholder="+234 801 234 5678" data-v-8a5c2aff></div>`);
      if (errors.phone) {
        _push(`<p class="mt-1.5 text-sm text-red-600" data-v-8a5c2aff>${ssrInterpolate(errors.phone)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-start gap-3 p-4 bg-blue-50 rounded-xl" data-v-8a5c2aff><i class="fa-solid fa-info-circle text-blue-600 mt-0.5" data-v-8a5c2aff></i><p class="text-sm text-gray-700" data-v-8a5c2aff> By enrolling, you agree to our Terms of Service and Privacy Policy. You will receive course updates and important notifications via email. </p></div></div><div class="flex gap-4 mt-8" data-v-8a5c2aff><button type="button" class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors cursor-pointer" data-v-8a5c2aff> Cancel </button><button type="submit"${ssrIncludeBooleanAttr(props.isSubmitting) ? " disabled" : ""} class="${ssrRenderClass([
        "flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer",
        props.isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl hover:scale-105"
      ])}" data-v-8a5c2aff>`);
      if (props.isSubmitting) {
        _push(`<i class="fa-solid fa-spinner fa-spin" data-v-8a5c2aff></i>`);
      } else {
        _push(`<span data-v-8a5c2aff>${ssrInterpolate(__props.mode === "reserve" ? "Reserve Seat" : __props.mode === "free" ? "Confirm Enrollment" : "Proceed to Payment")}</span>`);
      }
      _push(`</button></div></form></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EnrollmentForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const EnrollmentForm = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-8a5c2aff"]]), { __name: "EnrollmentForm" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[courseId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const courseDetail = ref(null);
    const isLoading = ref(false);
    const loadError = ref("");
    const showEnrollmentForm = ref(false);
    const enrollmentAction = ref("pay");
    const submitError = ref("");
    const successMessage = ref("");
    const isSubmitting = ref(false);
    const lastPaymentUrl = ref("");
    const lastPaymentReference = ref("");
    const pendingPayment = ref(readPendingPayment());
    ref(false);
    const configuredPaymentCallbackUrl = "https://linkskool.com/payment/completion"?.trim() ?? "";
    const PAYMENT_CALLBACK_URL = configuredPaymentCallbackUrl || `${(void 0).location.origin}/payment/completion`;
    const buildPaymentCallbackUrl = (programSlug, whatsappGroupLink) => {
      const raw = PAYMENT_CALLBACK_URL.trim();
      if (!raw) return `${(void 0).location.origin}/payment/completion`;
      const whatsapp = whatsappGroupLink?.trim() ?? "";
      try {
        const callbackUrl = new URL(raw);
        if (programSlug) {
          callbackUrl.searchParams.set("program", programSlug);
        }
        if (whatsapp) {
          callbackUrl.searchParams.set("whatsapp", whatsapp);
        }
        return callbackUrl.toString();
      } catch {
        const queryParts = [];
        if (programSlug) {
          queryParts.push(`program=${encodeURIComponent(programSlug)}`);
        }
        if (whatsapp) {
          queryParts.push(`whatsapp=${encodeURIComponent(whatsapp)}`);
        }
        if (queryParts.length === 0) {
          return raw;
        }
        const separator = raw.includes("?") ? "&" : "?";
        return `${raw}${separator}${queryParts.join("&")}`;
      }
    };
    const hasPendingPayment = computed(() => Boolean(pendingPayment.value?.reference && pendingPayment.value?.paymentUrl));
    const syncPendingPaymentState = (value) => {
      pendingPayment.value = value;
      lastPaymentReference.value = value?.reference ?? "";
      lastPaymentUrl.value = value?.paymentUrl ?? "";
    };
    const setPendingPaymentState = (value) => {
      syncPendingPaymentState(value);
    };
    const clearPendingPaymentState = () => {
      syncPendingPaymentState(null);
    };
    usePageMeta(() => ({
      title: courseDetail.value ? `${courseDetail.value.course.courseName} - Professional Course | Linkskool` : "Course Details | Linkskool",
      description: courseDetail.value?.course.description || courseDetail.value?.cohort.description || "Learn from industry experts with our comprehensive course curriculum.",
      keywords: `${courseDetail.value?.course.courseName || "course"}, online learning, professional development, skill training`,
      url: `https://linkskool.com/courses/${route.params.courseId}`,
      image: courseDetail.value?.course.imageUrl ? resolveAssetUrl(courseDetail.value.course.imageUrl) || "https://linkskool.com/assets/og-image.png" : "https://linkskool.com/assets/og-image.png",
      type: "article"
    }));
    const decodeRef = (value) => {
      try {
        return atob(value);
      } catch {
        return value;
      }
    };
    const detailRef = computed(() => {
      const queryValue = route.query.ref;
      if (Array.isArray(queryValue)) {
        return queryValue[0] ? decodeRef(queryValue[0]) : "";
      }
      return queryValue ? decodeRef(queryValue) : "";
    });
    const splitPlainBenefits = (value) => value.replace(/\r/g, "\n").split(/\n+|•|;/).map((item) => item.trim()).filter(Boolean);
    const parseBenefits = (benefits) => {
      if (!benefits) return [];
      const raw = benefits.trim();
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
        if (typeof parsed === "string") {
          return parseBenefits(parsed);
        }
      } catch {
      }
      const containsHtml = /<[^>]+>/.test(raw);
      if (containsHtml) {
        const document2 = new DOMParser().parseFromString(raw, "text/html");
        const listItems = Array.from(document2.querySelectorAll("li")).map((item) => item.textContent?.trim() ?? "").filter(Boolean);
        if (listItems.length > 0) {
          return listItems;
        }
        return splitPlainBenefits(document2.body.textContent ?? "");
      }
      return splitPlainBenefits(raw);
    };
    const parsedBenefits = computed(() => parseBenefits(courseDetail.value?.cohort.benefits ?? null));
    const toEmbeddableVideoUrl = (rawUrl) => {
      const value = rawUrl?.trim();
      if (!value) return null;
      try {
        const parsed = new URL(value);
        const host = parsed.hostname.replace(/^www\./, "");
        if (host === "youtube.com" || host === "m.youtube.com") {
          if (parsed.pathname === "/watch") {
            const videoId = parsed.searchParams.get("v");
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
          }
          if (parsed.pathname.startsWith("/shorts/")) {
            const videoId = parsed.pathname.split("/")[2];
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
          }
          if (parsed.pathname.startsWith("/embed/")) {
            return value;
          }
        }
        if (host === "youtu.be") {
          const videoId = parsed.pathname.replace("/", "");
          return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }
        return value;
      } catch {
        return value;
      }
    };
    const displayVideoUrl = computed(() => toEmbeddableVideoUrl(courseDetail.value?.cohort.videoUrl));
    const displayImageUrl = computed(() => resolveAssetUrl(courseDetail.value?.cohort.imageUrl));
    const learningTypeLabel = computed(
      () => courseDetail.value?.cohort.learningType === "instructor_led" ? "Instructor-led" : "Self-paced"
    );
    const isFreeCourse = computed(() => Boolean(courseDetail.value?.cohort.isFree));
    const isEnrollmentClosed = computed(() => {
      const detail = courseDetail.value;
      if (!detail) return false;
      if (detail.cohort.learningType !== "instructor_led" || !detail.cohort.enrollmentDeadline) return false;
      const deadline = new Date(detail.cohort.enrollmentDeadline);
      if (Number.isNaN(deadline.getTime())) return false;
      return deadline.getTime() < Date.now();
    });
    const handleEnroll = () => {
      if (isEnrollmentClosed.value) return;
      if (!isFreeCourse.value && hasPendingPayment.value) {
        submitError.value = "You already have a checkout in progress. Resume or clear it before starting another one.";
        return;
      }
      submitError.value = "";
      successMessage.value = "";
      if (!hasPendingPayment.value) {
        lastPaymentUrl.value = "";
        lastPaymentReference.value = "";
      }
      enrollmentAction.value = isFreeCourse.value ? "free" : "pay";
      showEnrollmentForm.value = true;
    };
    const handleReserve = () => {
      if (isEnrollmentClosed.value) return;
      submitError.value = "";
      successMessage.value = "";
      enrollmentAction.value = "reserve";
      showEnrollmentForm.value = true;
    };
    const closeEnrollmentForm = () => {
      showEnrollmentForm.value = false;
      submitError.value = "";
    };
    const handleFormSubmit = async (formData) => {
      if (isSubmitting.value) return;
      submitError.value = "";
      successMessage.value = "";
      if (!hasPendingPayment.value) {
        lastPaymentUrl.value = "";
        lastPaymentReference.value = "";
      }
      if (!courseDetail.value) {
        submitError.value = "Course details are unavailable right now.";
        return;
      }
      const cohortId = courseDetail.value.cohort.cohortId;
      if (!cohortId) {
        submitError.value = "This cohort is unavailable for enrollment right now.";
        return;
      }
      const basePayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        programId: courseDetail.value.program.id,
        items: [
          {
            courseId: courseDetail.value.course.courseId,
            cohortId
          }
        ]
      };
      isSubmitting.value = true;
      try {
        if (enrollmentAction.value === "pay") {
          const payload2 = {
            ...basePayload,
            callbackUrl: buildPaymentCallbackUrl(courseDetail.value.program.slug, courseDetail.value.cohort.whatsappGroupLink)
          };
          const paymentResponse = await enrollmentService.makePayment(payload2);
          const paymentStatus = paymentResponse.status;
          const paymentMessage = typeof paymentResponse.message === "string" ? paymentResponse.message.trim() : "";
          if (paymentStatus === "blocked") {
            clearPendingPaymentState();
            submitError.value = paymentMessage || "Payment is currently blocked. Please contact support.";
            return;
          }
          const paymentUrl = typeof paymentResponse.paymentUrl === "string" ? paymentResponse.paymentUrl.trim() : "";
          if (!paymentUrl) {
            submitError.value = paymentMessage || "Payment link was not returned. Please try again.";
            return;
          }
          const pendingCheckout = {
            reference: paymentResponse.reference || "",
            paymentUrl,
            createdAt: Date.now()
          };
          setPendingPaymentState(pendingCheckout);
          showEnrollmentForm.value = false;
          successMessage.value = "Payment initialized. Opening secure checkout...";
          (void 0).setTimeout(() => {
            (void 0).location.assign(paymentUrl);
          }, 150);
          return;
        }
        if (enrollmentAction.value === "free") {
          const payload2 = basePayload;
          const isEnrolled = await enrollmentService.freeEnrollment(payload2);
          if (!isEnrolled) {
            submitError.value = "Enrollment could not be completed right now. Please try again.";
            return;
          }
          showEnrollmentForm.value = false;
          successMessage.value = "Your enrollment is complete.";
          await router.push({
            name: "reservation-completion",
            query: {
              program: courseDetail.value.program.slug,
              completion: "enrollment",
              whatsapp: courseDetail.value.cohort.whatsappGroupLink ?? ""
            }
          });
          return;
        }
        const payload = basePayload;
        const isReserved = await enrollmentService.reserve(payload);
        if (!isReserved) {
          submitError.value = "Reservation was not completed. Please try again.";
          return;
        }
        showEnrollmentForm.value = false;
        successMessage.value = "Your seat reservation is complete.";
        await router.push({
          name: "reservation-completion",
          query: {
            program: courseDetail.value.program.slug,
            completion: "reservation",
            whatsapp: courseDetail.value.cohort.whatsappGroupLink ?? ""
          }
        });
      } catch (error) {
        console.error("Failed to submit enrollment request:", error);
        submitError.value = enrollmentAction.value === "pay" ? "Payment could not be completed right now. Please try again." : enrollmentAction.value === "reserve" ? "Reservation could not be completed right now. Please try again." : "Enrollment could not be completed right now. Please try again.";
      } finally {
        isSubmitting.value = false;
      }
    };
    const fetchCourseDetail = async () => {
      isLoading.value = true;
      loadError.value = "";
      courseDetail.value = null;
      if (!detailRef.value) {
        loadError.value = "Course details are unavailable.";
        isLoading.value = false;
        return;
      }
      try {
        const response = await programService.getProgramCourseCohortDetails(detailRef.value);
        courseDetail.value = response;
      } catch (error) {
        console.error("Failed to fetch course details:", error);
        loadError.value = "Unable to load course details right now.";
      } finally {
        isLoading.value = false;
      }
    };
    watch(detailRef, () => {
      fetchCourseDetail();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))} data-v-8c263865>`);
      _push(ssrRenderComponent(AppHeader, null, null, _parent));
      if (isLoading.value) {
        _push(`<div class="pt-24 pb-16" data-v-8c263865><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-8c263865><div class="animate-pulse" data-v-8c263865><div class="h-96 bg-gray-200 rounded-2xl mb-8" data-v-8c263865></div><div class="grid lg:grid-cols-3 gap-8" data-v-8c263865><div class="lg:col-span-2 space-y-4" data-v-8c263865><div class="h-8 bg-gray-200 rounded w-3/4" data-v-8c263865></div><div class="h-4 bg-gray-200 rounded w-full" data-v-8c263865></div><div class="h-4 bg-gray-200 rounded w-5/6" data-v-8c263865></div></div><div class="h-96 bg-gray-200 rounded-2xl" data-v-8c263865></div></div></div></div></div>`);
      } else if (courseDetail.value) {
        _push(`<div class="pt-24 pb-16" data-v-8c263865><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-8c263865><div class="mb-12" data-v-8c263865>`);
        if (displayVideoUrl.value) {
          _push(`<div class="relative aspect-video rounded-2xl overflow-hidden shadow-2xl" data-v-8c263865><iframe${ssrRenderAttr("src", displayVideoUrl.value)} class="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen data-v-8c263865></iframe></div>`);
        } else if (displayImageUrl.value) {
          _push(`<div class="relative aspect-video rounded-2xl overflow-hidden shadow-2xl" data-v-8c263865><img${ssrRenderAttr("src", displayImageUrl.value)}${ssrRenderAttr("alt", courseDetail.value.course.courseName)} loading="lazy" class="w-full h-full object-cover" data-v-8c263865></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="grid lg:grid-cols-3 gap-12" data-v-8c263865><div class="lg:col-span-2 space-y-8" data-v-8c263865>`);
        if (submitError.value) {
          _push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" data-v-8c263865>${ssrInterpolate(submitError.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (successMessage.value) {
          _push(`<div class="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700" data-v-8c263865>${ssrInterpolate(successMessage.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (lastPaymentUrl.value) {
          _push(`<div class="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800" data-v-8c263865><p class="font-semibold" data-v-8c263865>Checkout link ready</p><p class="mt-1 text-blue-700" data-v-8c263865>If payment did not open automatically, continue with the button below.</p><div class="mt-2 flex flex-wrap items-center gap-3" data-v-8c263865><button type="button" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500" data-v-8c263865><i class="fa-solid fa-up-right-from-square" data-v-8c263865></i><span data-v-8c263865>Resume Payment</span></button>`);
          if (lastPaymentReference.value) {
            _push(`<span class="text-xs text-blue-700" data-v-8c263865>Ref: ${ssrInterpolate(lastPaymentReference.value)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (hasPendingPayment.value) {
          _push(`<div class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" data-v-8c263865><p class="font-semibold" data-v-8c263865>Checkout in progress</p><p class="mt-1 text-amber-800" data-v-8c263865>Finish the existing payment before starting another checkout.</p><div class="mt-2 flex flex-wrap items-center gap-3" data-v-8c263865><button type="button" class="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-500" data-v-8c263865><i class="fa-solid fa-arrow-up-right-from-square" data-v-8c263865></i><span data-v-8c263865>Resume Payment</span></button><button type="button" class="inline-flex items-center gap-2 rounded-lg border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100" data-v-8c263865><i class="fa-solid fa-rotate-left" data-v-8c263865></i><span data-v-8c263865>Start New Checkout</span></button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div data-v-8c263865><h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4" data-v-8c263865>${ssrInterpolate(courseDetail.value.course.courseName)}</h1><p class="text-2xl text-gray-700 font-medium mb-6" data-v-8c263865>${ssrInterpolate(courseDetail.value.cohort.title)}</p><div class="flex flex-wrap gap-6 text-gray-600" data-v-8c263865><div class="flex items-center gap-2" data-v-8c263865><i class="fa-solid fa-chalkboard-user text-blue-600" data-v-8c263865></i><span data-v-8c263865>${ssrInterpolate(courseDetail.value.program.name)}</span></div>`);
        if (courseDetail.value.cohort.deliveryMode) {
          _push(`<div class="flex items-center gap-2" data-v-8c263865><i class="fa-solid fa-video text-orange-600" data-v-8c263865></i><span data-v-8c263865>${ssrInterpolate(courseDetail.value.cohort.deliveryMode)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-center gap-2" data-v-8c263865><i class="fa-solid fa-signal text-indigo-600" data-v-8c263865></i><span data-v-8c263865>${ssrInterpolate(learningTypeLabel.value)}</span></div></div></div><div class="prose max-w-none" data-v-8c263865><h2 class="text-2xl font-bold text-gray-900 mb-4" data-v-8c263865>About This Course</h2><div class="text-gray-700 leading-relaxed whitespace-pre-line" data-v-8c263865>${ssrInterpolate(courseDetail.value.cohort.description || courseDetail.value.course.description)}</div></div>`);
        if (parsedBenefits.value.length > 0) {
          _push(`<div data-v-8c263865><h2 class="text-2xl font-bold text-gray-900 mb-6" data-v-8c263865>What You&#39;ll Learn</h2><div class="grid md:grid-cols-2 gap-4" data-v-8c263865><!--[-->`);
          ssrRenderList(parsedBenefits.value, (benefit, index) => {
            _push(`<div class="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all" data-v-8c263865><div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5" data-v-8c263865><i class="fa-solid fa-check text-green-600 text-xs" data-v-8c263865></i></div><p class="text-gray-700" data-v-8c263865>${ssrInterpolate(benefit)}</p></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (courseDetail.value.cohort.instructorName) {
          _push(`<div class="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-8" data-v-8c263865><h2 class="text-2xl font-bold text-gray-900 mb-6" data-v-8c263865>Your Instructor</h2><div class="flex items-start gap-6" data-v-8c263865><div class="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold" data-v-8c263865>${ssrInterpolate(courseDetail.value.cohort.instructorName.charAt(0))}</div><div data-v-8c263865><h3 class="text-xl font-bold text-gray-900 mb-2" data-v-8c263865>${ssrInterpolate(courseDetail.value.cohort.instructorName)}</h3><p class="text-gray-600" data-v-8c263865>Course instructor</p></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="lg:col-span-1" data-v-8c263865>`);
        _push(ssrRenderComponent(EnrollmentCard, {
          "course-detail": courseDetail.value,
          onEnroll: handleEnroll,
          onReserve: handleReserve
        }, null, _parent));
        _push(`</div></div></div></div>`);
      } else {
        _push(`<div class="pt-24 pb-16" data-v-8c263865><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-v-8c263865><div class="text-center py-16" data-v-8c263865><i class="fa-solid fa-circle-exclamation text-6xl text-gray-300 mb-4" data-v-8c263865></i><p class="text-xl text-gray-600" data-v-8c263865>${ssrInterpolate(loadError.value || "Course details unavailable.")}</p></div></div></div>`);
      }
      if (showEnrollmentForm.value && courseDetail.value) {
        _push(ssrRenderComponent(EnrollmentForm, {
          "course-detail": courseDetail.value,
          mode: enrollmentAction.value,
          "submit-error": submitError.value,
          "is-submitting": isSubmitting.value,
          onClose: closeEnrollmentForm,
          onSubmit: handleFormSubmit
        }, null, _parent));
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/courses/[courseId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _courseId_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8c263865"]]);

export { _courseId_ as default };
//# sourceMappingURL=_courseId_-DLawBA4g.mjs.map
