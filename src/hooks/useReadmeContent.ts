/**
 * Hook para obtener contenido del README
 * Issue 04 - Hooks Personalizados
 *
 * Obtiene el markdown del README del proyecto
 * Con cache largo para evitar requests frecuentes
 */

import useSWR from 'swr'
import { api } from '@/lib/api'

interface UseReadmeContentReturn {
  content: string | undefined
  isLoading: boolean
  isError: boolean
}

/**
 * Hook para obtener contenido markdown del README
 * Solo hace fetch si ownerRepo es válido (formato owner/repo)
 * Cache de 5 minutos (no se revalida frecuentemente)
 *
 * @param ownerRepo - Proyecto en formato owner/repo (ej: "anthropics/claude-code")
 * @returns Objeto con contenido, loading e isError
 *
 * @example
 * const { content, isLoading } = useReadmeContent('anthropics/claude-code')
 */
export const useReadmeContent = (ownerRepo?: string): UseReadmeContentReturn => {
  const { data, error, isLoading } = useSWR(
    ownerRepo && ownerRepo.includes('/') ? ['readme', ownerRepo] : null,
    async () => {
      if (!ownerRepo || !ownerRepo.includes('/')) return undefined
      return await api.getReadmeContent(ownerRepo)
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutos - README rara vez cambia
    }
  )

  return {
    content: data,
    isLoading,
    isError: !!error,
  }
}
