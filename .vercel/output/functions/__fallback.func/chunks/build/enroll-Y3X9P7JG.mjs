import { defineComponent, ref, reactive, computed, resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderAttr } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { A as AppHeader, a as AppFooter } from './AppHeader-CiIf_B2g.mjs';
import { r as resolveAssetUrl } from './assetUrl-BkGibEdX.mjs';
import { u as usePageMeta } from './usePageMeta-oq6avMrt.mjs';
import { r as readPendingPayment } from './pendingPayment-AMK2PAsl.mjs';
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
  __name: "enroll",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const program = ref(null);
    const courses = ref([]);
    const isLoading = ref(false);
    const isSubmitting = ref(false);
    const isRedirectingToCheckout = ref(false);
    const showBillingModal = ref(false);
    const showReservationSuccessModal = ref(false);
    const enrollmentAction = ref("pay");
    const loadError = ref("");
    const submitError = ref("");
    const successMessage = ref("");
    const lastPaymentReference = ref("");
    const lastPaymentUrl = ref("");
    const pendingPayment = ref(readPendingPayment());
    const isCheckingPendingPayment = ref(false);
    const currentTime = ref(Date.now());
    const configuredPaymentCallbackUrl = "https://linkskool.com/payment/completion"?.trim() ?? "";
    configuredPaymentCallbackUrl || `${(void 0).location.origin}/payment/completion`;
    const selectedCourseIds = ref([]);
    const customerForm = reactive({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: ""
    });
    const formErrors = reactive({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: ""
    });
    const programRef = computed(() => {
      const value = route.params.s;
      if (Array.isArray(value)) {
        return value[0] ?? "";
      }
      return value ?? "";
    });
    usePageMeta(() => ({
      title: program.value ? `Enroll in ${program.value.name} | Linkskool` : "Program Enrollment | Linkskool",
      description: program.value ? `Enroll in ${program.value.name}. ${program.value.description}` : "Choose your courses and enroll in our professional learning program.",
      keywords: `${program.value?.name || "program"} enrollment, online course enrollment, skill development, professional training`,
      url: `https://linkskool.com/programs/${programRef.value}/enroll`,
      image: "https://linkskool.com/assets/og-image.png",
      type: "website"
    }));
    const normalizedCourses = computed(
      () => courses.value.map((course) => ({
        ...course,
        hasActiveCohort: Boolean(course.cohort?.cohortId),
        cohortId: course.cohort?.cohortId ?? null,
        isFree: course.cohort?.isFree ?? false,
        trialType: course.cohort?.trialType ?? null,
        trialValue: course.cohort?.trialValue ?? null,
        discount: course.cohort?.discount ?? null,
        cost: course.cohort?.cost ?? 0,
        learningType: course.cohort?.learningType ?? "instructor_led",
        enrollmentDeadline: course.cohort?.enrollmentDeadline ?? null
      }))
    );
    const selectedCourses = computed(
      () => normalizedCourses.value.filter((course) => selectedCourseIds.value.includes(course.courseId))
    );
    computed(
      () => selectedCourses.value.filter((course) => Boolean(course.cohortId)).map((course) => ({
        courseId: course.courseId,
        cohortId: course.cohortId
      }))
    );
    const resolveWhatsappGroupLink = (...candidates) => candidates.map((value) => value?.trim() ?? "").find(Boolean) ?? "";
    const selectedCourseWhatsappGroupLink = computed(
      () => selectedCourses.value.map((course) => course.cohort?.whatsappGroupLink).find((value) => Boolean(value?.trim()))?.trim() ?? ""
    );
    const effectiveWhatsappGroupLink = computed(
      () => resolveWhatsappGroupLink(
        program.value?.whatsappGroupLink,
        selectedCourseWhatsappGroupLink.value
      )
    );
    const hasWhatsappGroupUrl = computed(() => Boolean(effectiveWhatsappGroupLink.value));
    const whatsappJoinLink = computed(() => {
      return effectiveWhatsappGroupLink.value;
    });
    const subtotal = computed(
      () => selectedCourses.value.reduce((sum, course) => {
        if (course.isFree) {
          return sum;
        }
        return sum + course.cost;
      }, 0)
    );
    const discountAmount = computed(
      () => selectedCourses.value.reduce((sum, course) => {
        if (course.isFree || !course.discount || course.discount <= 0) {
          return sum;
        }
        return sum + course.cost * course.discount / 100;
      }, 0)
    );
    const total = computed(() => Math.max(0, subtotal.value - discountAmount.value));
    const selectedPaidCount = computed(
      () => selectedCourses.value.filter((course) => !course.isFree && course.cost > 0).length
    );
    const selectedFreeCount = computed(() => selectedCourses.value.length - selectedPaidCount.value);
    const hasPendingPayment = computed(() => Boolean(pendingPayment.value?.reference && pendingPayment.value?.paymentUrl));
    const nairaFormatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2
    });
    const formatPrice = (value) => nairaFormatter.format(value);
    const courseImage = (imageUrl) => resolveAssetUrl(imageUrl);
    const parseDate = (value) => {
      if (!value) return null;
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    };
    const formatLongDate = (value) => {
      if (!value) return "Not set";
      return value.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
    };
    const programStartDate = computed(() => parseDate(program.value?.startDate));
    const programCountdown = computed(() => {
      const startDate = programStartDate.value;
      if (!startDate) return null;
      const diff = startDate.getTime() - currentTime.value;
      if (diff <= 0) {
        return { isStarted: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      const totalSeconds = Math.floor(diff / 1e3);
      return {
        isStarted: false,
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor(totalSeconds % 86400 / 3600),
        minutes: Math.floor(totalSeconds % 3600 / 60),
        seconds: totalSeconds % 60
      };
    });
    const countdownSegments = computed(() => {
      const countdown = programCountdown.value;
      if (!countdown || countdown.isStarted) return [];
      return [
        { label: "Days", value: countdown.days },
        { label: "Hours", value: countdown.hours },
        { label: "Minutes", value: countdown.minutes },
        { label: "Seconds", value: countdown.seconds }
      ];
    });
    const courseFinalPrice = (course) => {
      if (course.isFree) {
        return 0;
      }
      if (!course.discount || course.discount <= 0) {
        return course.cost;
      }
      return Math.max(0, course.cost - course.cost * course.discount / 100);
    };
    const displayTrial = (course) => {
      if (!course.trialType || !course.trialValue) {
        return "";
      }
      if (course.trialType === "days") {
        return `${course.trialValue} days trial`;
      }
      return `${course.trialValue} views trial`;
    };
    const learningTypeLabel = (course) => course.learningType === "instructor_led" ? "Instructor-led" : "Self-paced";
    const parseEnrollmentDeadline = (course) => parseDate(course.enrollmentDeadline);
    const formatDeadlineDateTime = (course) => {
      const deadline = parseEnrollmentDeadline(course);
      if (!deadline) return "Not set";
      return deadline.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
    };
    const isEnrollmentExpired = (course) => {
      if (course.learningType !== "instructor_led") return false;
      const deadline = parseEnrollmentDeadline(course);
      if (!deadline) return false;
      return deadline.getTime() < Date.now();
    };
    const selectionBlockReason = (course) => {
      if (!course.cohortId) {
        return "No active enrollment available for this course.";
      }
      if (isEnrollmentExpired(course)) {
        return "Enrollment deadline has passed for this instructor-led course.";
      }
      return "";
    };
    const canSelectCourse = (course) => !selectionBlockReason(course);
    const isSelected = (courseId) => selectedCourseIds.value.includes(courseId);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}>`);
      _push(ssrRenderComponent(AppHeader, null, null, _parent));
      _push(`<section class="pt-24 pb-10 bg-gradient-to-br from-blue-600 via-blue-700 to-orange-600"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
      if (isLoading.value) {
        _push(`<div class="animate-pulse"><div class="h-11 bg-white/20 rounded-lg w-2/3 mb-4"></div><div class="h-5 bg-white/20 rounded-lg w-1/2"></div></div>`);
      } else if (program.value) {
        _push(`<div class="max-w-4xl"><nav class="flex items-center gap-2 text-blue-100 mb-5">`);
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
          to: `/programs/${program.value.slug}`,
          class: "hover:text-white transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(program.value.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(program.value.name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<i class="fa-solid fa-chevron-right text-xs"></i><span class="text-white">Enrollment</span></nav><h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Enroll In ${ssrInterpolate(program.value.name)}</h1><p class="text-blue-100 text-lg leading-relaxed max-w-3xl"> Select one or more courses from this program and complete a single checkout flow. </p>`);
        if (programStartDate.value) {
          _push(`<div class="mt-6 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"><div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p class="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100">Program starts</p><p class="mt-1 text-xl font-semibold text-white">${ssrInterpolate(formatLongDate(programStartDate.value))}</p><p class="mt-1 text-sm text-blue-100">${ssrInterpolate(programCountdown.value?.isStarted ? "This program has started." : "Countdown to your next cohort.")}</p></div>`);
          if (!programCountdown.value?.isStarted) {
            _push(`<div class="grid grid-cols-4 gap-2 sm:gap-3"><!--[-->`);
            ssrRenderList(countdownSegments.value, (segment) => {
              _push(`<div class="min-w-16 rounded-xl bg-white/12 px-3 py-2 text-center"><p class="text-2xl font-bold text-white">${ssrInterpolate(String(segment.value).padStart(2, "0"))}</p><p class="text-[11px] uppercase tracking-[0.18em] text-blue-100">${ssrInterpolate(segment.label)}</p></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div><h1 class="text-3xl font-bold text-white">Enrollment unavailable</h1><p class="text-blue-100 mt-2">${ssrInterpolate(loadError.value || "Please try again later.")}</p></div>`);
      }
      _push(`</div></section><section class="py-12"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">`);
      if (loadError.value && !isLoading.value) {
        _push(`<div class="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">${ssrInterpolate(loadError.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-8"><div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"><div><h2 class="text-2xl font-bold text-gray-900">Choose Courses</h2><p class="text-gray-600 mt-1">Select all courses you want to include in this purchase.</p></div><div class="flex items-center gap-3"><button type="button" class="px-4 py-2 rounded-lg border border-blue-200 text-blue-700 font-medium hover:bg-blue-50 transition-colors cursor-pointer"> Select all </button><button type="button" class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"> Clear </button></div></div>`);
      if (isLoading.value) {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(4, (index) => {
          _push(`<div class="h-28 rounded-xl bg-gray-100 animate-pulse"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(normalizedCourses.value, (course) => {
          _push(`<div class="${ssrRenderClass([isSelected(course.courseId) ? "border-blue-400 bg-blue-50/50 shadow-sm" : "border-gray-200 bg-white hover:border-blue-200", "rounded-xl border p-4 transition-all duration-200"])}"><label class="${ssrRenderClass([canSelectCourse(course) ? "cursor-pointer" : "cursor-not-allowed opacity-75", "flex items-start gap-4"])}"><input type="checkbox" class="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"${ssrIncludeBooleanAttr(isSelected(course.courseId)) ? " checked" : ""}${ssrIncludeBooleanAttr(!canSelectCourse(course)) ? " disabled" : ""}><div class="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">`);
          if (courseImage(course.imageUrl)) {
            _push(`<img${ssrRenderAttr("src", courseImage(course.imageUrl))} loading="lazy"${ssrRenderAttr("alt", course.courseName)} class="w-full h-full object-cover">`);
          } else {
            _push(`<div class="w-full h-full flex items-center justify-center text-blue-300"><i class="fa-solid fa-book"></i></div>`);
          }
          _push(`</div><div class="flex-1 min-w-0"><div class="flex flex-wrap items-start justify-between gap-3"><div><h3 class="text-lg font-semibold text-gray-900 leading-snug">${ssrInterpolate(course.courseName)}</h3><p class="text-sm text-gray-600 mt-1 line-clamp-2">${ssrInterpolate(course.description)}</p></div><div class="text-right">`);
          if (course.isFree) {
            _push(`<div class="text-lg font-bold text-green-600">Free</div>`);
          } else {
            _push(`<div class="space-y-0.5"><div class="text-lg font-bold text-gray-900">${ssrInterpolate(formatPrice(courseFinalPrice(course)))}</div>`);
            if (course.discount) {
              _push(`<div class="text-xs text-gray-400 line-through">${ssrInterpolate(formatPrice(course.cost))}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          }
          _push(`</div></div><div class="mt-3 flex flex-wrap gap-2"><span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">${ssrInterpolate(learningTypeLabel(course))}</span>`);
          if (course.discount) {
            _push(`<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">${ssrInterpolate(course.discount)}% OFF </span>`);
          } else {
            _push(`<!---->`);
          }
          if (displayTrial(course)) {
            _push(`<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">${ssrInterpolate(displayTrial(course))}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (!course.cohortId) {
            _push(`<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600"> No active cohort </span>`);
          } else {
            _push(`<!---->`);
          }
          if (course.enrollmentDeadline) {
            _push(`<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"> Deadline: ${ssrInterpolate(formatDeadlineDateTime(course))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (selectionBlockReason(course)) {
            _push(`<p class="mt-2 text-xs font-medium text-red-600">${ssrInterpolate(selectionBlockReason(course))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></label></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div><aside class="lg:col-span-1"><div class="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-lg p-6 space-y-5"><h2 class="text-2xl font-bold text-gray-900">Order Summary</h2><div class="space-y-3 max-h-56 overflow-auto pr-1"><!--[-->`);
      ssrRenderList(selectedCourses.value, (course) => {
        _push(`<div class="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 last:border-b-0"><div class="min-w-0"><p class="text-sm font-medium text-gray-900 truncate">${ssrInterpolate(course.courseName)}</p><p class="text-xs text-gray-500">${ssrInterpolate(course.isFree ? "Free" : "Paid course")}</p></div><p class="text-sm font-semibold text-gray-900">${ssrInterpolate(course.isFree ? "Free" : formatPrice(courseFinalPrice(course)))}</p></div>`);
      });
      _push(`<!--]--></div><div class="space-y-2 pt-1 text-sm">`);
      if (programStartDate.value) {
        _push(`<div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3"><div class="flex items-start gap-3"><div class="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white text-blue-600"><i class="fa-solid fa-calendar-day"></i></div><div class="min-w-0"><p class="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Program Start Date</p><p class="mt-1 text-sm font-semibold text-gray-900">${ssrInterpolate(formatLongDate(programStartDate.value))}</p><p class="mt-1 text-xs text-gray-600">${ssrInterpolate(programCountdown.value?.isStarted ? "Program is already in progress." : `${countdownSegments.value[0]?.value ?? 0}d ${String(countdownSegments.value[1]?.value ?? 0).padStart(
          2,
          "0"
        )}h ${String(countdownSegments.value[2]?.value ?? 0).padStart(2, "0")}m
                        ${String(countdownSegments.value[3]?.value ?? 0).padStart(2, "0")}s left`)}</p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center justify-between text-gray-600"><span>Selected Courses</span><span>${ssrInterpolate(selectedCourses.value.length)}</span></div><div class="flex items-center justify-between text-gray-600"><span>Paid Courses</span><span>${ssrInterpolate(selectedPaidCount.value)}</span></div><div class="flex items-center justify-between text-gray-600"><span>Free Courses</span><span>${ssrInterpolate(selectedFreeCount.value)}</span></div><div class="flex items-center justify-between text-gray-600"><span>Subtotal</span><span>${ssrInterpolate(formatPrice(subtotal.value))}</span></div><div class="flex items-center justify-between text-green-700"><span>Discounts</span><span>- ${ssrInterpolate(formatPrice(discountAmount.value))}</span></div><div class="pt-2 mt-2 border-t border-gray-200 flex items-center justify-between"><span class="text-base font-semibold text-gray-900">Total</span><span class="text-xl font-bold text-blue-700">${ssrInterpolate(formatPrice(total.value))}</span></div></div>`);
      if (submitError.value) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">${ssrInterpolate(submitError.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (successMessage.value) {
        _push(`<div class="rounded-xl border border-green-200 bg-green-50 text-green-700 px-3 py-2 text-sm">${ssrInterpolate(successMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (hasPendingPayment.value) {
        _push(`<div class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900"><p class="font-semibold">Checkout in progress</p><p class="mt-1 text-amber-800"> Finish the existing payment before starting another checkout for this enrollment. </p><div class="mt-3 flex flex-wrap items-center gap-3"><button type="button" class="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-500 cursor-pointer"><i class="fa-solid fa-arrow-up-right-from-square"></i><span>Resume Payment</span></button><button type="button" class="inline-flex items-center gap-2 rounded-lg border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100 cursor-pointer"><i class="fa-solid fa-rotate-left"></i><span>Start New Checkout</span></button>`);
        if (lastPaymentReference.value) {
          _push(`<span class="text-xs text-amber-800">Ref: ${ssrInterpolate(lastPaymentReference.value)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (lastPaymentUrl.value && !hasPendingPayment.value) {
        _push(`<div class="rounded-xl border border-blue-200 bg-blue-50 px-3 py-3 text-sm text-blue-800"><p class="font-semibold">Checkout link ready</p><p class="mt-1 text-blue-700">If you were interrupted, continue with the button below.</p><div class="mt-2 flex flex-wrap items-center gap-3"><button type="button" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500 cursor-pointer"><i class="fa-solid fa-up-right-from-square"></i><span>Resume Payment</span></button>`);
        if (lastPaymentReference.value) {
          _push(`<span class="text-xs text-blue-700">Ref: ${ssrInterpolate(lastPaymentReference.value)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="button" class="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"${ssrIncludeBooleanAttr(isSubmitting.value || isCheckingPendingPayment.value || hasPendingPayment.value) ? " disabled" : ""}>`);
      if (isSubmitting.value) {
        _push(`<i class="fa-solid fa-spinner fa-spin"></i>`);
      } else {
        _push(`<i class="fa-solid fa-lock"></i>`);
      }
      _push(`<span>${ssrInterpolate(isSubmitting.value && enrollmentAction.value === "pay" ? "Processing..." : "Pay Now")}</span></button><button type="button" class="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-semibold hover:border-orange-400 hover:text-orange-600 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"${ssrIncludeBooleanAttr(isSubmitting.value || isCheckingPendingPayment.value || hasPendingPayment.value) ? " disabled" : ""}>`);
      if (isSubmitting.value && enrollmentAction.value === "reserve") {
        _push(`<i class="fa-solid fa-spinner fa-spin"></i>`);
      } else {
        _push(`<i class="fa-solid fa-bookmark"></i>`);
      }
      _push(`<span>${ssrInterpolate(isSubmitting.value && enrollmentAction.value === "reserve" ? "Processing..." : "Reserve Seat")}</span></button><p class="text-xs text-gray-500 text-center"> Secure checkout for paid enrollment, or reserve your spot now and complete payment later. </p></div></aside></div></div></section>`);
      if (showBillingModal.value) {
        _push(`<div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4"><div class="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"><div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between"><div><h2 class="text-2xl font-bold text-gray-900">${ssrInterpolate(enrollmentAction.value === "reserve" ? "Reserve Your Seat" : "Billing Information")}</h2><p class="text-sm text-gray-600 mt-1">${ssrInterpolate(enrollmentAction.value === "reserve" ? "Enter your details to reserve the selected courses." : "Enter your details to continue payment for selected courses.")}</p></div><button type="button" class="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"><i class="fa-solid fa-xmark"></i></button></div><div class="p-6">`);
        if (submitError.value) {
          _push(`<div class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${ssrInterpolate(submitError.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid sm:grid-cols-2 gap-4"><div><label for="billingFirstName" class="block text-sm font-medium text-gray-700 mb-1.5">First Name</label><input id="billingFirstName"${ssrRenderAttr("value", customerForm.firstName)} type="text" placeholder="e.g. John" class="${ssrRenderClass([formErrors.firstName ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500", "w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 transition-colors"])}">`);
        if (formErrors.firstName) {
          _push(`<p class="text-xs text-red-600 mt-1">${ssrInterpolate(formErrors.firstName)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label for="billingLastName" class="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label><input id="billingLastName"${ssrRenderAttr("value", customerForm.lastName)} type="text" placeholder="e.g. Doe" class="${ssrRenderClass([formErrors.lastName ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500", "w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 transition-colors"])}">`);
        if (formErrors.lastName) {
          _push(`<p class="text-xs text-red-600 mt-1">${ssrInterpolate(formErrors.lastName)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label for="billingEmail" class="block text-sm font-medium text-gray-700 mb-1.5">Email</label><input id="billingEmail"${ssrRenderAttr("value", customerForm.email)} type="email" placeholder="you@example.com" class="${ssrRenderClass([formErrors.email ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500", "w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 transition-colors"])}">`);
        if (formErrors.email) {
          _push(`<p class="text-xs text-red-600 mt-1">${ssrInterpolate(formErrors.email)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label for="billingPhoneNumber" class="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label><input id="billingPhoneNumber"${ssrRenderAttr("value", customerForm.phoneNumber)} type="tel" placeholder="+234 801 234 5678" class="${ssrRenderClass([formErrors.phoneNumber ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500", "w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 transition-colors"])}">`);
        if (formErrors.phoneNumber) {
          _push(`<p class="text-xs text-red-600 mt-1">${ssrInterpolate(formErrors.phoneNumber)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between"><span class="text-sm text-gray-700">${ssrInterpolate(enrollmentAction.value === "reserve" ? "Selected course total" : "Total to pay")}</span><span class="text-xl font-bold text-blue-700">${ssrInterpolate(formatPrice(total.value))}</span></div><div class="mt-6 flex items-center justify-end gap-3"><button type="button" class="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors cursor-pointer"> Cancel </button><button type="button" class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""}>`);
        if (isSubmitting.value) {
          _push(`<i class="fa-solid fa-spinner fa-spin"></i>`);
        } else {
          _push(`<i class="fa-solid fa-lock"></i>`);
        }
        _push(`<span>${ssrInterpolate(isSubmitting.value ? enrollmentAction.value === "reserve" ? "Reserving..." : "Processing..." : enrollmentAction.value === "reserve" ? "Reserve Seat" : "Confirm & Pay")}</span></button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isRedirectingToCheckout.value) {
        _push(`<div class="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"><div class="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100 px-6 py-8 text-center"><div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600"><i class="fa-solid fa-spinner fa-spin text-2xl"></i></div><h3 class="text-xl font-bold text-gray-900">Preparing your checkout</h3><p class="mt-2 text-sm text-gray-600"> Please wait while we redirect you to secure payment. Do not close this tab. </p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showReservationSuccessModal.value) {
        _push(`<div class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4"><div class="max-w-xl mx-auto mt-12 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"><div class="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-orange-500 text-white"><div class="flex items-start justify-between gap-4"><div><p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Reservation Complete</p><h2 class="mt-2 text-2xl font-bold">Your seat has been reserved</h2><p class="mt-2 text-blue-100">Watch your inbox for next steps from the Linkskool team.</p></div><button type="button" class="w-10 h-10 rounded-full hover:bg-white/15 text-white cursor-pointer"><i class="fa-solid fa-xmark"></i></button></div></div><div class="p-6 space-y-4">`);
        if (hasWhatsappGroupUrl.value) {
          _push(`<div class="rounded-xl border border-blue-100 bg-blue-50 p-4"><p class="text-sm text-blue-900"> Stay updated in our learner community for onboarding updates, reminders, and live support. </p><a${ssrRenderAttr("href", whatsappJoinLink.value)} target="_blank" rel="noopener noreferrer" class="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400"><i class="fa-brands fa-whatsapp"></i><span>Join WhatsApp Group</span></a></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="rounded-xl border border-orange-100 bg-orange-50 p-4"><p class="text-sm text-orange-900">Need quick answers before your classes begin?</p>`);
        _push(ssrRenderComponent(_component_RouterLink, {
          to: "/faqs",
          class: "mt-3 inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-4 py-2.5 text-sm font-semibold text-orange-700 hover:bg-orange-100"
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
        _push(`</div><div class="flex flex-wrap items-center justify-end gap-3 pt-1">`);
        _push(ssrRenderComponent(_component_RouterLink, {
          to: "/#programs",
          class: "inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>Explore More Programs</span><i class="fa-solid fa-arrow-right"${_scopeId}></i>`);
            } else {
              return [
                createVNode("span", null, "Explore More Programs"),
                createVNode("i", { class: "fa-solid fa-arrow-right" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<button type="button" class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:shadow-lg"><span>Done</span></button></div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/programs/[s]/enroll.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=enroll-Y3X9P7JG.mjs.map
