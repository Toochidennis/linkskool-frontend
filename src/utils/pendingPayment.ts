export interface PendingPayment {
  reference: string;
  paymentUrl: string;
  createdAt: number;
}

const STORAGE_KEY = 'linkskool.pending-payment'

export const readPendingPayment = (): PendingPayment | null => {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<PendingPayment>
    if (typeof parsed.reference !== 'string' || typeof parsed.paymentUrl !== 'string') {
      return null
    }

    return {
      reference: parsed.reference,
      paymentUrl: parsed.paymentUrl,
      createdAt: typeof parsed.createdAt === 'number' ? parsed.createdAt : Date.now(),
    }
  } catch {
    return null
  }
}

export const savePendingPayment = (payment: PendingPayment) => {
  if (typeof window === 'undefined') return

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payment))
}

export const clearPendingPayment = () => {
  if (typeof window === 'undefined') return

  window.sessionStorage.removeItem(STORAGE_KEY)
}
