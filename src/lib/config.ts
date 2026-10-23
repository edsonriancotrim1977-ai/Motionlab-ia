export const KIWIFY_CHECKOUT_URL = import.meta.env.VITE_KIWIFY_CHECKOUT_URL || '';

export function getCheckoutUrl(): string {
  if (!KIWIFY_CHECKOUT_URL) {
    console.warn('[MotionLab] KIWIFY_CHECKOUT_URL not configured. Set VITE_KIWIFY_CHECKOUT_URL in .env');
  }
  return KIWIFY_CHECKOUT_URL;
}
