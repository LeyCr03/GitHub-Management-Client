/**
 * Hook para obtener commits de un proyecto
 * Issue 04 - Hooks Personalizados
 *
 * Obtiene los commits recientes de un proyecto
 * Con límite configurable (default 10)
 */

import useSWR from 'swr'
import { api } from '@/lib/api'
import { GitHubCommit } from '@/types'

interface UseProjectCommitsReturn {
  commits: GitHubCommit[] | undefined
  isLoading: boolean
  isError: boolean
}

/**
 * Hook para obtener commits de un proyecto
 * Solo hace fetch si projectId es válido
 *
 * @param projectId - ID del proyecto (opcional)
 * @param limit - Cantidad de commits a obtener (default 10)
 * @returns Objeto con commits, loading e isError
 *
 * @example
 * const { commits, isLoading } = useProjectCommits('project-id', 5)
 */
export const useProjectCommits = (
  projectId?: string,
  limit: number = 10
): UseProjectCommitsReturn => {
  const { data, error, isLoading } = useSWR(
    projectId ? ['commits', projectId] : null,
    async () => {
      if (!projectId) return null
      return await api.getProjectCommits(projectId, limit)
    },
    {
      revalidateOnFocus: false,
    }
  )

  return {
    commits: data?.commits,
    isLoading,
    isError: !!error,
  }
}
