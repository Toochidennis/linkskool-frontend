import { createRouter, createWebHistory } from 'vue-router'

import CourseDetailPage from '@/views/CourseDetailPage.vue'
import FaqsPage from '@/views/FaqsPage.vue'
import ProgramEnrollmentPage from '@/views/ProgramEnrollmentPage.vue'
import ProgramPage from '@/views/ProgramPage.vue'
import LandingPage from '@/views/LandingPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'
import PaymentCompletionPage from '@/views/PaymentCompletionPage.vue'
import PrivacyPolicyPage from '@/views/PrivacyPolicyPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
    },
    {
      path: '/programs/:s',
      name: 'program',
      component: ProgramPage,
    },
    {
      path: '/programs/:s/enroll',
      name: 'program-enrollment',
      component: ProgramEnrollmentPage,
    },
    {
      path: '/courses/:courseId',
      name: 'course-details',
      component: CourseDetailPage,
      props: (route) => {
        const raw = route.params.courseId
        const paramValue = Array.isArray(raw) ? (raw[0] ?? '') : (raw ?? '')
        const courseId = Number.parseInt(paramValue, 10)
        return {
          courseId: Number.isFinite(courseId) ? courseId : 0,
        }
      },
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: PrivacyPolicyPage,
    },
    {
      path: '/faqs',
      name: 'faqs',
      component: FaqsPage,
    },
    {
      path: '/payment/completion',
      name: 'payment-completion',
      component: PaymentCompletionPage,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        top: 72,
        behavior: 'smooth',
      }
    }
    if (to.path !== from.path) {
      return {
        top: 0,
      }
    }
    return undefined
  },
})

export default router
