
export interface PaymentPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  programId: number;
  callbackUrl: string;
  items: {
    courseId: number;
    cohortId: number;
  }[];
}
