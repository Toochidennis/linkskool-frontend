export interface ReservePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  programId: number;
  items: {
    courseId: number;
    cohortId: number;
  }[];
}
