export interface CourseEnrollmentRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  mode?: 'reserve' | 'pay';
}
