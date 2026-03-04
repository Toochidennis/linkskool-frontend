export type TrialType = "views" | "days" | null;

export interface Cohort {
  id: number;
  programId: number;
  courseId: number;
  slug: string;
  courseName: string;
  title: string;
  description: string;
  benefits: string | null;
  code: string | null;
  startDate: string;
  endDate: string;
  status: string;
  imageUrl: string | null;
  capacity: number | null;
  deliveryMode: string | null;
  zoomLink: string | null;
  isFree: number | boolean;
  trialType: TrialType;
  trialValue: number;
  cost: string;
  instructorName: string | null;
  createdAt: string;
  updatedAt: string;
}
