/**
 * Configuración de SWR
 * Issue 03 - Cliente API
 *
 * SWR: Stale-While-Revalidate
 * Librería para data fetching con caching inteligente
 */

import { SWRConfiguration } from 'swr'

/**
 * Configuración global de SWR
 * - No revalidar en focus (evita requests innecesarios)
 * - Cache de 1 minuto
 * - Reintentos en caso de error
 */
export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  dedupingInterval: 60000, // 1 minuto - no hacer requests duplicados en este tiempo
  focusThrottleInterval: 300000, // 5 minutos - throttle de focus
  errorRetryCount: 3, // Reintentar 3 veces en error
  errorRetryInterval: 5000, // Esperar 5 segundos entre reintentos
}

/**
 * Fetcher personalizado para SWR
 * Usa fetch API en lugar de axios para mayor control
 * Incluye token de autenticación si existe
 *
 * @example
 * const { data } = useSWR('/api/projects', fetcher)
 */
export const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
      'Content-Type': 'application/json',
    },
  }).then((r) => {
    if (!r.ok) {
      throw new Error(`API Error: ${r.status} ${r.statusText}`)
    }
    return r.json()
  })
