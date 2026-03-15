export type TrialType = "views" | "days" | null;
export interface Cohort {
  cohortId: number;
  title: string;
  slug: string;
  discount: number | null;
  cost: number | null;
  isFree: boolean;
  trialType: TrialType;
  trialValue: number | null;
  enrollmentDeadline: string | null,
  learningType: 'instructor_led' | 'self_paced';
  whatsappGroupLink: string | null;
}
