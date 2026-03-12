export interface PaymentResponse {
  status: 'failed' | 'pending' | 'blocked';
  message: string;
  paymentUrl: string;
  reference: string;
}
