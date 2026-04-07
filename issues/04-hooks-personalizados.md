# Issue 4: Implementar Hooks Personalizados

## Objetivo
Crear hooks reutilizables que centralicen la lógica de fetch y manejo de estado.

## Tareas

### 1. Hook para obtener proyectos
**Archivo:** `src/hooks/useGithubProjects.ts`

```typescript
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
```

### 2. Hook para obtener detalles del proyecto
**Archivo:** `src/hooks/useProjectDetail.ts`

```typescript
import useSWR from 'swr'
import { api } from '@/lib/api'
import { ProjectDetail } from '@/types'

interface UseProjectDetailReturn {
  project: ProjectDetail | undefined
  isLoading: boolean
  isError: boolean
  mutate: () => Promise<any>
}

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
```

### 3. Hook para obtener README
**Archivo:** `src/hooks/useReadmeContent.ts`

```typescript
import useSWR from 'swr'
import { api } from '@/lib/api'

interface UseReadmeContentReturn {
  content: string | undefined
  isLoading: boolean
  isError: boolean
}

export const useReadmeContent = (projectId?: string): UseReadmeContentReturn => {
  const { data, error, isLoading } = useSWR(
    projectId ? ['readme', projectId] : null,
    async () => {
      if (!projectId) return null
      return await api.getReadmeContent(projectId)
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutos
    }
  )

  return {
    content: data,
    isLoading,
    isError: !!error,
  }
}
```

### 4. Hook para gestionar tags
**Archivo:** `src/hooks/useTagManagement.ts`

```typescript
import { useState } from 'react'
import { api } from '@/lib/api'
import { Tag } from '@/types'

interface UseTagManagementReturn {
  isLoading: boolean
  error: string | null
  createTag: (name: string, color: string) => Promise<Tag | null>
  updateProjectTags: (projectId: string, tagIds: string[]) => Promise<boolean>
  deleteTag: (tagId: string) => Promise<boolean>
}

export const useTagManagement = (): UseTagManagementReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTag = async (name: string, color: string): Promise<Tag | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.createTag({
        name,
        color,
        type: 'custom',
      })
      return response.tag
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al crear tag'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const updateProjectTags = async (
    projectId: string,
    tagIds: string[]
  ): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await api.updateProjectTags(projectId, tagIds)
      return true
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al actualizar tags'
      setError(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTag = async (tagId: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await api.deleteTag(tagId)
      return true
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al eliminar tag'
      setError(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    createTag,
    updateProjectTags,
    deleteTag,
  }
}
```

### 5. Hook para commits
**Archivo:** `src/hooks/useProjectCommits.ts`

```typescript
import useSWR from 'swr'
import { api } from '@/lib/api'
import { GitHubCommit } from '@/types'

interface UseProjectCommitsReturn {
  commits: GitHubCommit[] | undefined
  isLoading: boolean
  isError: boolean
}

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
```

### 6. Crear archivo índice de hooks
**Archivo:** `src/hooks/index.ts`

```typescript
export { useGithubProjects } from './useGithubProjects'
export { useProjectDetail } from './useProjectDetail'
export { useReadmeContent } from './useReadmeContent'
export { useTagManagement } from './useTagManagement'
export { useProjectCommits } from './useProjectCommits'
```

## Criterios de Aceptación
- ✅ Todos los hooks creados con manejo de estado
- ✅ Utilizan SWR para caching automático
- ✅ Manejo de errores implementado
- ✅ TypeScript sin errores
- ✅ Hooks exportados desde índice

## Notas Importantes
- Los hooks con SWR solo se ejecutan cuando `projectId` existe
- El caché de SWR se invalida automáticamente
- Los errores se capturan y se exponen para mostrar al usuario
- Usa `mutate()` para revalidar manualmente cuando sea necesario
