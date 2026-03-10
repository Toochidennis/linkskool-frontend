export interface PaymentResponse {
  status: 'failed' | 'pending';
  message: string;
  paymentUrl: string;
  reference: string;
}
