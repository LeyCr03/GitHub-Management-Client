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
 * Solo hace fetch si ownerRepo es válido (formato owner/repo)
 *
 * @param ownerRepo - Proyecto en formato owner/repo (ej: "anthropics/claude-code")
 * @returns Objeto con proyecto, loading, error y función mutate
 *
 * @example
 * const { project, isLoading } = useProjectDetail('anthropics/claude-code')
 */
export const useProjectDetail = (ownerRepo: string): UseProjectDetailReturn => {
  const { data, error, mutate, isLoading } = useSWR(
    // Validar formato owner/repo
    ownerRepo && ownerRepo.includes('/') ? ['project', ownerRepo] : null,
    async () => {
      if (!ownerRepo || !ownerRepo.includes('/')) return null
      const response = await api.getProjectDetail(ownerRepo)
      return response.project
    },
    {
      revalidateOnFocus: false,
    }
  )

  return {
    project: data ?? undefined,
    isLoading,
    isError: !!error,
    mutate,
  }
}
