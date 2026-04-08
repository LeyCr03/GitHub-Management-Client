/**
 * Utilidades para mostrar notificaciones toast
 * Issue 10 - Integración Final y Polish
 *
 * Proporciona funciones simples para mostrar toasts:
 * - showSuccess: notificación de éxito
 * - showError: notificación de error
 * - showLoading: notificación de carga
 * - updateToast: actualizar un toast existente
 */

import { toast } from 'sonner'

export const showSuccess = (message: string) => {
  toast.success(message)
}

export const showError = (message: string) => {
  toast.error(message)
}

export const showLoading = (message: string): string | number => {
  return toast.loading(message)
}

export const updateToast = (toastId: string | number, message: string, type: 'success' | 'error') => {
  toast.dismiss(toastId)
  if (type === 'success') {
    toast.success(message)
  } else {
    toast.error(message)
  }
}
