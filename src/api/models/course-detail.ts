import type { TrialType } from "./cohort";
import type { Program } from "./program";

export interface CourseCohortDetail {
  cohortId?: number;
  courseId: number;
  slug: string;
  title: string;
  description: string;
  benefits: string | null;
  startDate: string;
  endDate: string;
  imageUrl: string | null;
  videoUrl: string | null;
  isFree: number | boolean;
  trialType: TrialType;
  trialValue: number | null;
  cost: number | null;
  discount: number | null;
  instructorName: string | null;
  deliveryMode: string | null;
  enrollmentDeadline: string | null;
  learningType: 'instructor_led' | 'self_paced';
}

export interface CourseDetail {
  program: Program;
  course: {
    courseId: number;
    slug: string | null;
    courseName: string;
    description: string;
    imageUrl: string | null;
  };
  cohort: CourseCohortDetail;
}
