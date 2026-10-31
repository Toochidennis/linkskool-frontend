export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  programId: number
  courseId: number
  cohortId: number
}

/** unpaid: a seat is held until they pay. paid / free: the place is theirs. */
export type RegistrationStatus = 'unpaid' | 'paid' | 'free'

export interface RegisterResult {
  token: string
  status: RegistrationStatus
  created: boolean
}

export interface Registration {
  token: string
  status: RegistrationStatus
  invoice: {
    number: string
    amount: number
    currency: string
    issuedAt: string
    paidAt: string | null
    reference: string | null
  }
  learner: {
    profileId: number
    firstName: string
    lastName: string
    email: string | null
    phone: string | null
  }
  program: {
    id: number
    name: string | null
    slug: string | null
    videoUrl: string | null
    onboardingSteps: string[]
  }
  course: { id: number; name: string; imageUrl: string | null }
  cohort: {
    id: number
    slug: string
    title: string
    startDate: string | null
    endDate: string | null
    learningType: 'self_paced' | 'instructor_led' | null
    deliveryMode: string | null
    imageUrl: string | null
    benefits: string | null
  }
  links: {
    /** The learners' group once paid (when the cohort has one), else the public group. */
    whatsapp: string | null
    whatsappIsLearnersGroup: boolean
    curriculumUrl: string | null
  }
}

export interface RegistrationCheckout {
  /** paid: nothing to pay, it was settled already. */
  status: 'pending' | 'paid'
  paymentUrl?: string
  reference?: string
  message?: string
}
