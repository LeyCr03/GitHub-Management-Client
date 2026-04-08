/**
 * Hook para obtener proyectos de GitHub
 * Issue 04 - Hooks Personalizados
 *
 * Usa SWR para caching automático y sincronización de datos
 * Soporta filtrado por tag
 */

import useSWR from 'swr'
import { api } from '@/lib/api'
import { Project, Tag } from '@/types'

interface UseGithubProjectsReturn {
  projects: Project[] | undefined
  tags: Tag[] | undefined
  isLoading: boolean
  isError: boolean
  mutate: () => Promise<any>
}

/**
 * Hook para obtener lista de proyectos con filtro opcional
 * @param filterTag - Tag ID para filtrar proyectos (opcional)
 * @returns Objeto con proyectos, tags, loading, error y función mutate
 *
 * @example
 * const { projects, tags, isLoading } = useGithubProjects()
 * const { projects } = useGithubProjects('finished')
 */
export const useGithubProjects = (filterTag?: string): UseGithubProjectsReturn => {
  const { data, error, mutate, isLoading } = useSWR(
    ['projects', filterTag],
    async () => {
      const response = await api.getProjects(filterTag)
      return response
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  return {
    projects: data?.projects,
    tags: data?.tags,
    isLoading,
    isError: !!error,
    mutate,
  }
}
