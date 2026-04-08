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
 * Solo hace fetch si ownerRepo es válido (formato owner/repo)
 *
 * @param ownerRepo - Proyecto en formato owner/repo (ej: "anthropics/claude-code")
 * @param limit - Cantidad de commits a obtener (default 10)
 * @returns Objeto con commits, loading e isError
 *
 * @example
 * const { commits, isLoading } = useProjectCommits('anthropics/claude-code', 5)
 */
export const useProjectCommits = (
  ownerRepo?: string,
  limit: number = 10
): UseProjectCommitsReturn => {
  const { data, error, isLoading } = useSWR(
    ownerRepo && ownerRepo.includes('/') ? ['commits', ownerRepo] : null,
    async () => {
      if (!ownerRepo || !ownerRepo.includes('/')) return null
      return await api.getProjectCommits(ownerRepo, limit)
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
