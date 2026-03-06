import type { Cohort } from './cohort';

export interface Course {
  courseId: number;
  slug?: string | null;
  courseName: string;
  description: string;
  imageUrl: string | null;
  videoUrl?: string | null;
  cohort: Cohort | null;
}
