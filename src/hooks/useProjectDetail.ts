/**
 * Hook para obtener detalles de un proyecto
 * Issue 04 - Hooks Personalizados
 *
 * Obtiene información completa del proyecto incluyendo:
 * - Información base
 * - README
 * - Commits recientes
 * - Estadísticas
 */

import useSWR from 'swr'
import { api } from '@/lib/api'
import { ProjectDetail } from '@/types'

interface UseProjectDetailReturn {
  project: ProjectDetail | undefined
  isLoading: boolean
  isError: boolean
  mutate: () => Promise<any>
}

/**
 * Hook para obtener detalles completos de un proyecto
 * Solo hace fetch si projectId es válido
 *
 * @param projectId - ID del proyecto a cargar
 * @returns Objeto con proyecto, loading, error y función mutate
 *
 * @example
 * const { project, isLoading } = useProjectDetail('project-id')
 */
export const useProjectDetail = (projectId: string): UseProjectDetailReturn => {
  const { data, error, mutate, isLoading } = useSWR(
    projectId ? ['project', projectId] : null,
    async () => {
      if (!projectId) return null
      const response = await api.getProjectDetail(projectId)
      return response.project
    },
    {
      revalidateOnFocus: false,
    }
  )

  return {
    project: data,
    isLoading,
    isError: !!error,
    mutate,
  }
}
