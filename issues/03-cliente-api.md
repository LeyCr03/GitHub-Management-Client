# Issue 3: Implementar Cliente API

## Objetivo
Crear un cliente HTTP centralizado que se comunique con tu backend.

## Tareas

### 1. Crear instancia de Axios
**Archivo:** `src/lib/axios-instance.ts`

```typescript
import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token si existe
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejo de errores
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido, limpiar
      localStorage.removeItem('auth_token')
    }
    return Promise.reject(error)
  }
)

export default instance
```

### 2. Crear cliente API
**Archivo:** `src/lib/api.ts`

```typescript
import axios from './axios-instance'
import {
  GetProjectsResponse,
  GetProjectDetailResponse,
  UpdateProjectTagsResponse,
  CreateTagResponse,
  UpdateProjectTagsRequest,
  CreateTagRequest,
  ApiResponse,
} from '@/types'

class GitHubDashboardAPI {
  // ===== PROYECTOS =====
  
  async getProjects(filterTag?: string): Promise<GetProjectsResponse> {
    const params = filterTag ? { tag: filterTag } : {}
    const response = await axios.get<GetProjectsResponse>('/projects', { params })
    return response.data
  }

  async getProjectDetail(projectId: string): Promise<GetProjectDetailResponse> {
    const response = await axios.get<GetProjectDetailResponse>(`/projects/${projectId}`)
    return response.data
  }

  // ===== TAGS =====

  async getTags() {
    const response = await axios.get<ApiResponse<any>>('/tags')
    return response.data.data
  }

  async createTag(tagData: CreateTagRequest): Promise<CreateTagResponse> {
    const response = await axios.post<CreateTagResponse>('/tags', tagData)
    return response.data
  }

  async updateProjectTags(
    projectId: string,
    tagIds: string[]
  ): Promise<UpdateProjectTagsResponse> {
    const payload: UpdateProjectTagsRequest = { tags: tagIds }
    const response = await axios.patch<UpdateProjectTagsResponse>(
      `/projects/${projectId}/tags`,
      payload
    )
    return response.data
  }

  async deleteTag(tagId: string): Promise<void> {
    await axios.delete(`/tags/${tagId}`)
  }

  // ===== README =====

  async getReadmeContent(projectId: string): Promise<string> {
    const response = await axios.get<{ content: string }>(`/projects/${projectId}/readme`)
    return response.data.content
  }

  // ===== COMMITS =====

  async getProjectCommits(projectId: string, limit: number = 10) {
    const response = await axios.get(`/projects/${projectId}/commits`, {
      params: { limit },
    })
    return response.data
  }
}

export const api = new GitHubDashboardAPI()
```

### 3. Crear helper para URLs
**Archivo:** `src/lib/helpers.ts`

```typescript
/**
 * Construye URL relativa para imagen
 */
export const getImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null
  if (imageUrl.startsWith('http')) return imageUrl
  return `${import.meta.env.VITE_API_BASE_URL}/images/${imageUrl}`
}

/**
 * Formatea fecha para display
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

/**
 * Obtiene el dominio del repositorio
 */
export const getRepoOwner = (url: string): string => {
  const match = url.match(/github\.com\/([^/]+)/)
  return match ? match[1] : 'unknown'
}

/**
 * Obtiene el nombre del repositorio
 */
export const getRepoName = (url: string): string => {
  const match = url.match(/github\.com\/[^/]+\/([^/]+)/)
  return match ? match[1] : 'unknown'
}

/**
 * Abrevia número (1000 → 1k)
 */
export const abbreviateNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
```

### 4. Crear configuración de SWR
**Archivo:** `src/lib/swr-config.ts`

```typescript
import { SWRConfiguration } from 'swr'

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  dedupingInterval: 60000, // 1 minuto
  focusThrottleInterval: 300000, // 5 minutos
  errorRetryCount: 3,
  errorRetryInterval: 5000,
}

export const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
  }).then((r) => r.json())
```

## Criterios de Aceptación
- ✅ Cliente API funcional con métodos para todos los endpoints
- ✅ Interceptores de Axios configurados
- ✅ Helpers creados y exportados
- ✅ SWR configurado correctamente
- ✅ TypeScript sin errores

## Notas de Implementación
- El `baseURL` viene de variables de entorno
- Los interceptores manejan autenticación automáticamente
- Los métodos siguen patrón async/await
- Todos los tipos están importados desde `@/types`

## ⚠️ Nota Importante para Integración Servidor

Este issue crea un cliente API **temporal** que será **actualizado en el Issue 11**.

**Cambios que se harán en Issue 11:**
- Cambiar `baseURL` a `http://localhost:3000` (sin `/api`)
- Agregar `/api` prefix a todos los endpoints
- Cambiar parámetro `projectId` → `ownerRepo` (formato owner/repo)
- Agregar validación de formato en métodos

Ahora solo implementa lo básico. El Issue 11 hará los ajustes finales para conectar con el servidor NestJS real.
