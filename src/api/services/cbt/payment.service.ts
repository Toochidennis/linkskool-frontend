import { apiRequest } from "#/api/client";
import { ActivationResponse, ActivationStatus } from "#/api/models";
import { PaymentStatus } from "#/api/models/payment-status.model";
import { Plan } from "#/api/models/plan.model";

export const paymentService = {
    async checkActivationStatus(userId: number, fingerprint: string) {
        const response = await apiRequest<ActivationStatus>(`/cbt/license/status/desktop?user_id=${userId}&fingerprint=${fingerprint}`, {
            method: 'GET'
        });

        return response.data;
    },
    async payWithVoucher(
        {
            userId,
            voucherCode,
            firstName,
            lastName,
            planId,
            platform = 'desktop',
            method = 'voucher',
        }: {
            userId: number,
            voucherCode: string,
            firstName: string,
            lastName: string,
            planId: number,
            platform?: 'desktop'
            method?: 'voucher',
        }
    ) {
        const response = await apiRequest<PaymentStatus>('/cbt/billing/verify', {
            method: 'POST',
            body: { userId, voucherCode, firstName, lastName, method, planId, platform }
        });
        return response.data;
    },
    async payOnline(
        {
            userId,
            firstName,
            lastName,
            planId,
            reference,
            platform = 'desktop',
            method = 'online',
        }: {
            userId: number;
            firstName: string;
            lastName: string;
            planId: number;
            reference: string;
            platform?: 'desktop';
            method?: 'online';
        }
    ) {
        const response = await apiRequest<PaymentStatus>('/cbt/billing/verify', {
            method: 'POST',
            body: { userId, firstName, lastName, method, planId, platform, reference }
        });
        return response.data;
    },
    async getAvailablePlans(): Promise<Plan[]> {
        const response = await apiRequest<Plan[]>('/cbt/license/plans/desktop', {
            method: 'GET'
        });
        return response.data;
    },
    async activateLicense(userId: number, fingerprint: string): Promise<ActivationResponse> {
        const response = await apiRequest<ActivationResponse>('/cbt/license/activate/desktop', {
            method: 'POST',
            body: { userId, fingerprint }
        });
        return response.data;
    },
    async startTrial(userId: number): Promise<ActivationResponse> {
        const response = await apiRequest<ActivationResponse>('/cbt/license/trial/start', {
            method: 'POST',
            body: { userId, platform: 'desktop' }
        });
        return response.data;
    }
};