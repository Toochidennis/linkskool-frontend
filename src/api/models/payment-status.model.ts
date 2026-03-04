export interface PaymentStatus {
    status: 'paid' | 'failed' 
    message: string;
    salt?:string;
}