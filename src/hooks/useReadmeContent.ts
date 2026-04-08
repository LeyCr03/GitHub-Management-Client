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
 * Solo hace fetch si projectId es válido
 * Cache de 5 minutos (no se revalida frecuentemente)
 *
 * @param projectId - ID del proyecto (opcional)
 * @returns Objeto con contenido, loading e isError
 *
 * @example
 * const { content, isLoading } = useReadmeContent('project-id')
 */
export const useReadmeContent = (projectId?: string): UseReadmeContentReturn => {
  const { data, error, isLoading } = useSWR(
    projectId ? ['readme', projectId] : null,
    async () => {
      if (!projectId) return undefined
      return await api.getReadmeContent(projectId)
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
