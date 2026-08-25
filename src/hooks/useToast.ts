import { toast } from 'sonner';

type ToastTone = 'success' | 'error' | 'info';

/**
 * Thin wrapper around Sonner so call sites stay consistent.
 * @returns Object with `showToast`
 */
export function useToast() {
  function showToast(message: string, tone: ToastTone = 'success') {
    if (tone === 'error') {
      toast.error(message);
      return;
    }
    if (tone === 'info') {
      toast.message(message);
      return;
    }
    toast.success(message);
  }

  return { showToast };
}
