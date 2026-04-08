# Issue 11: Integración con Servidor NestJS

## Objetivo
Adaptar el cliente React para conectarse al servidor NestJS real. Este issue cubre todos los cambios necesarios para que el cliente funcione con la API del servidor.

**Tiempo estimado:** 2-3 horas  
**Prioridad:** 🔴 CRÍTICA - Debe completarse después del Issue 10  
**Dependencias:** Issues 01-10 completados

---

## 📋 Resumen de Cambios

### Cambios Críticos (Obligatorios)
1. Actualizar baseURL en axios
2. Agregar /api prefix a endpoints
3. Cambiar formato projectId → owner/repo
4. Actualizar .env.local
5. Crear componente de Login OAuth
6. Manejar callback OAuth en App.tsx

### Cambios Moderados (Actualizaciones)
1. Actualizar hooks para nuevo formato de ID
2. Actualizar componentes que usan projectId
3. Validar tipos TypeScript

---

## 🔧 Tareas Detalladas

### 1. Actualizar axios-instance.ts (CRÍTICO)

**Archivo:** `src/lib/axios-instance.ts`

**Cambio:** El baseURL no debe incluir `/api` al final, ya que cada endpoint lo incluye.

```typescript
import axios from 'axios'

const instance = axios.create({
  // ANTES: baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  // DESPUÉS:
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Interceptor de request
 * Agrega token de autenticación si existe
 */
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Interceptor de response
 * Maneja errores de autenticación
 */
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_username')
      // Opcional: redirigir a login
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance
```

**Pasos:**
- [ ] Cambiar baseURL
- [ ] Verificar interceptores
- [ ] Testear en consola: `axios.defaults.baseURL`

---

### 2. Actualizar api.ts (CRÍTICO)

**Archivo:** `src/lib/api.ts`

**Cambio:** Agregar `/api` al inicio de cada endpoint.

```typescript
/**
 * Cliente API centralizado
 * Conecta con servidor NestJS en http://localhost:3000
 */

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

  /**
   * Obtiene lista de proyectos con filtro opcional de tag
   */
  async getProjects(filterTag?: string): Promise<GetProjectsResponse> {
    const params = filterTag ? { tag: filterTag } : {}
    // ANTES: const response = await axios.get<GetProjectsResponse>('/projects', { params })
    // DESPUÉS:
    const response = await axios.get<GetProjectsResponse>('/api/projects', { params })
    return response.data
  }

  /**
   * Obtiene detalles completos de un proyecto
   * @param ownerRepo Formato: "owner/repo" (ej: "anthropics/claude-code")
   */
  async getProjectDetail(ownerRepo: string): Promise<GetProjectDetailResponse> {
    if (!ownerRepo.includes('/')) {
      throw new Error('projectId debe estar en formato owner/repo')
    }
    // ANTES: const response = await axios.get<GetProjectDetailResponse>(`/projects/${projectId}`)
    // DESPUÉS:
    const response = await axios.get<GetProjectDetailResponse>(`/api/projects/${ownerRepo}`)
    return response.data
  }

  // ===== TAGS =====

  /**
   * Obtiene todos los tags disponibles
   */
  async getTags() {
    // ANTES: const response = await axios.get<ApiResponse<any>>('/tags')
    // DESPUÉS:
    const response = await axios.get<ApiResponse<any>>('/api/tags')
    return response.data.data
  }

  /**
   * Crea un nuevo tag personalizado
   */
  async createTag(tagData: CreateTagRequest): Promise<CreateTagResponse> {
    // ANTES: const response = await axios.post<CreateTagResponse>('/tags', tagData)
    // DESPUÉS:
    const response = await axios.post<CreateTagResponse>('/api/tags', tagData)
    return response.data
  }

  /**
   * Actualiza los tags de un proyecto
   * @param ownerRepo Formato: "owner/repo"
   */
  async updateProjectTags(
    ownerRepo: string,
    tagIds: string[]
  ): Promise<UpdateProjectTagsResponse> {
    if (!ownerRepo.includes('/')) {
      throw new Error('projectId debe estar en formato owner/repo')
    }
    const payload: UpdateProjectTagsRequest = { tags: tagIds }
    // ANTES: const response = await axios.patch<UpdateProjectTagsResponse>(`/projects/${projectId}/tags`, payload)
    // DESPUÉS:
    const response = await axios.patch<UpdateProjectTagsResponse>(
      `/api/projects/${ownerRepo}/tags`,
      payload
    )
    return response.data
  }

  /**
   * Elimina un tag personalizado
   */
  async deleteTag(tagId: string): Promise<void> {
    // ANTES: await axios.delete(`/tags/${tagId}`)
    // DESPUÉS:
    await axios.delete(`/api/tags/${tagId}`)
  }

  // ===== README =====

  /**
   * Obtiene el contenido del README en markdown
   * @param ownerRepo Formato: "owner/repo"
   */
  async getReadmeContent(ownerRepo: string): Promise<string> {
    if (!ownerRepo.includes('/')) {
      throw new Error('projectId debe estar en formato owner/repo')
    }
    // ANTES: const response = await axios.get<{ content: string }>(`/projects/${projectId}/readme`)
    // DESPUÉS:
    const response = await axios.get<{ content: string }>(
      `/api/projects/${ownerRepo}/readme`
    )
    return response.data.content
  }

  // ===== COMMITS =====

  /**
   * Obtiene commits de un proyecto con límite configurable
   * @param ownerRepo Formato: "owner/repo"
   */
  async getProjectCommits(ownerRepo: string, limit: number = 10) {
    if (!ownerRepo.includes('/')) {
      throw new Error('projectId debe estar en formato owner/repo')
    }
    // ANTES: const response = await axios.get(`/projects/${projectId}/commits`, { params: { limit } })
    // DESPUÉS:
    const response = await axios.get(`/api/projects/${ownerRepo}/commits`, {
      params: { limit },
    })
    return response.data
  }
}

// Exportar instancia única del API
export const api = new GitHubDashboardAPI()
```

**Pasos:**
- [ ] Agregar `/api` a todos los endpoints GET
- [ ] Agregar `/api` a todos los endpoints POST/PATCH/DELETE
- [ ] Cambiar parámetro `projectId` → `ownerRepo` en funciones
- [ ] Agregar validación de formato owner/repo
- [ ] Testear cada función

---

### 3. Actualizar .env.local (CRÍTICO)

**Archivo:** `.env.local`

```env
# Antes:
# VITE_API_BASE_URL=http://localhost:3000/api

# Después:
VITE_API_BASE_URL=http://localhost:3000
```

**Pasos:**
- [ ] Actualizar variable de entorno
- [ ] Verificar que se carga correctamente

---

### 4. Crear LoginButton Component (CRÍTICO)

**Archivo:** `src/components/LoginButton.tsx` (NUEVO)

```typescript
import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

interface LoginButtonProps {
  size?: 'sm' | 'md' | 'lg'
}

export const LoginButton = ({ size = 'md' }: LoginButtonProps) => {
  const handleLogin = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    window.location.href = `${baseUrl}/auth/github`
  }

  return (
    <Button onClick={handleLogin} size={size} className="gap-2">
      <Github className="w-4 h-4" />
      Login con GitHub
    </Button>
  )
}
```

**Pasos:**
- [ ] Crear archivo LoginButton.tsx
- [ ] Copiar código arriba
- [ ] Exportar en `src/components/index.ts`

---

### 5. Manejar OAuth Callback (CRÍTICO)

**Archivo:** `src/App.tsx`

Actualizar para extraer token de URL después del callback:

```typescript
import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { FoldersView } from '@/components/dashboard/FoldersView'
import { ProjectDetailModal } from '@/components/project/ProjectDetailModal'
import { LoginButton } from '@/components/LoginButton'
import '@/index.css'

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Manejar OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const username = params.get('username')

    if (token && username) {
      // Guardar token en localStorage
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user_username', username)

      // Marcar como autenticado
      setIsAuthenticated(true)

      // Limpiar URL
      window.history.replaceState({}, document.title, '/')
    } else {
      // Verificar si ya hay token guardado
      const savedToken = localStorage.getItem('auth_token')
      setIsAuthenticated(!!savedToken)
    }
  }, [])

  // Mostrar login si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">GitHub Dashboard</h1>
          <p className="text-muted-foreground">
            Inicia sesión con GitHub para ver tus proyectos
          </p>
          <LoginButton />
        </div>
      </div>
    )
  }

  return (
    <MainLayout>
      <FoldersView
        onProjectSelect={(projectId) => {
          setSelectedProjectId(projectId)
          setDetailModalOpen(true)
        }}
      />

      <ProjectDetailModal
        projectId={selectedProjectId}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
    </MainLayout>
  )
}

export default App
```

**Pasos:**
- [ ] Agregar useEffect para extraer token de URL
- [ ] Guardar token en localStorage
- [ ] Mostrar LoginButton si no está autenticado
- [ ] Limpiar URL después de guardar token
- [ ] Testear flow completo de login

---

### 6. Actualizar Hooks para owner/repo Format (MODERADO)

**Archivos afectados:**
- `src/hooks/useProjectDetail.ts`
- `src/hooks/useProjectCommits.ts`
- `src/hooks/useReadmeContent.ts`

**Ejemplo - useProjectDetail.ts:**

```typescript
/**
 * Hook para obtener detalles de un proyecto
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
    // Validar formato
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
```

Cambios similares para otros hooks.

**Pasos:**
- [ ] Actualizar parámetro projectId → ownerRepo
- [ ] Validar formato owner/repo antes de hacer request
- [ ] Actualizar docstrings
- [ ] Testear cada hook

---

### 7. Actualizar Componentes que usan projectId (MODERADO)

**Archivos afectados:**
- `src/components/dashboard/ProjectCard.tsx`
- `src/components/project/ProjectDetailModal.tsx`

**Cambio en ProjectCard:**

```typescript
// Crear helper para convertir project.url a owner/repo
const toOwnerRepo = (url: string): string => {
  // Convertir: https://github.com/user/repo → user/repo
  return url.split('github.com/')[1] || ''
}

// Uso en onSelect:
<Card
  onClick={() => {
    const ownerRepo = toOwnerRepo(project.url)
    onSelect?.(ownerRepo)
  }}
>
  {/* ... */}
</Card>
```

**Cambio en ProjectDetailModal:**

```typescript
// Ahora recibe ownerRepo en lugar de projectId
interface ProjectDetailModalProps {
  ownerRepo: string | null  // Cambió de projectId
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ProjectDetailModal = ({
  ownerRepo,
  open,
  onOpenChange,
}: ProjectDetailModalProps) => {
  const { project, isLoading } = useProjectDetail(ownerRepo || '')

  // ... resto del componente
}
```

**Pasos:**
- [ ] Crear helper toOwnerRepo
- [ ] Actualizar ProjectCard para pasar ownerRepo
- [ ] Actualizar ProjectDetailModal para recibir ownerRepo
- [ ] Actualizar App.tsx para pasar ownerRepo
- [ ] Testear navegación entre componentes

---

### 8. Crear Helper para Conversión de IDs (OPCIONAL)

**Archivo:** `src/lib/project-helpers.ts` (NUEVO)

```typescript
/**
 * Helpers para trabajar con formato owner/repo
 */

/**
 * Convierte URL de GitHub a formato owner/repo
 * @example
 * urlToOwnerRepo('https://github.com/anthropics/claude-code') → 'anthropics/claude-code'
 */
export function urlToOwnerRepo(url: string): string {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)(?:\.git)?$/)
  if (!match) {
    throw new Error(`Invalid GitHub URL: ${url}`)
  }
  return `${match[1]}/${match[2]}`
}

/**
 * Convierte owner/repo a URL de GitHub
 * @example
 * ownerRepoToUrl('anthropics/claude-code') → 'https://github.com/anthropics/claude-code'
 */
export function ownerRepoToUrl(ownerRepo: string): string {
  return `https://github.com/${ownerRepo}`
}

/**
 * Valida que el string esté en formato owner/repo
 */
export function isValidOwnerRepo(str: string): boolean {
  return /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(str)
}
```

**Pasos:**
- [ ] Crear archivo con helpers
- [ ] Usar en componentes donde sea necesario
- [ ] Exportar en `src/lib/index.ts`

---

### 9. Validar Tipos TypeScript (MODERADO)

**Archivo:** `src/types/project.ts`

Verificar que los tipos se alinean con servidor:

```typescript
// El servidor RETORNA estos campos en GET /api/projects/:owner/:repo:
export interface ProjectDetail extends Project {
  contributors: number       // ✅ Servidor proporciona
  watchers: number          // ✅ Servidor proporciona
  defaultBranch: string     // ✅ Servidor proporciona
}

// Estos campos vienen en endpoints separados:
// - readme → GET /api/projects/:owner/:repo (incluido)
// - commits → GET /api/projects/:owner/:repo/commits (separado)

// Estos campos son OPCIONALES (no siempre vienen del servidor):
export interface Project {
  // ... otros campos ...
  readme?: ProjectReadme;        // ✅ Opcional
  coverImage?: ProjectImage;     // ✅ Opcional (servidor no proporciona)
  images: ProjectImage[];        // ✅ Puede ser array vacío
  commits: GitHubCommit[];       // ✅ Puede venir vacío
}
```

**Pasos:**
- [ ] Revisar que tipos sean compatibles
- [ ] Hacer campos opcionales si es necesario
- [ ] Ejecutar `pnpm tsc --noEmit` para validar
- [ ] No debe haber errores de TypeScript

---

### 10. Testing de Integración (IMPORTANTE)

**Test 1: Login OAuth**

```bash
1. Navega a http://localhost:5173
2. Haz click en "Login con GitHub"
3. Se redirige a GitHub
4. Te autenticas
5. Vuelves a http://localhost:5173?token=ghu_xxx&username=xxx
6. Se guarda token en localStorage
7. ✅ Ves el dashboard
```

**Test 2: Cargar Proyectos**

```bash
1. GET /api/projects debe retornar lista
2. Verifica que projects están en variable
3. FoldersView agrupa por tags
4. ✅ Ves proyectos agrupados
```

**Test 3: Ver Detalles**

```bash
1. Click en proyecto
2. GET /api/projects/owner/repo debe funcionar
3. Modal abre con detalles
4. ✅ Ves README, commits, metadata
```

**Test 4: Filtros y Búsqueda**

```bash
1. GET /api/projects?tag=javascript
2. Solo proyectos con ese tag
3. ✅ Filtrado funciona
```

**Test 5: Crear Custom Tag**

```bash
1. POST /api/tags { name, color, type: 'custom' }
2. Tag aparece en lista
3. ✅ Se puede crear tag
```

**Pasos:**
- [ ] Test 1: Login
- [ ] Test 2: Proyectos
- [ ] Test 3: Detalles
- [ ] Test 4: Filtros
- [ ] Test 5: Tags

---

## ✅ Checklist de Completación

### Antes de empezar
- [ ] Servidor NestJS está corriendo en http://localhost:3000
- [ ] `pnpm dev` funciona en cliente
- [ ] Tienes token OAuth de GitHub válido

### Cambios Críticos
- [ ] ✅ axios-instance.ts actualizado
- [ ] ✅ api.ts actualizado con /api prefix
- [ ] ✅ .env.local actualizado
- [ ] ✅ LoginButton creado
- [ ] ✅ App.tsx maneja OAuth callback

### Cambios Moderados
- [ ] ✅ Hooks actualizados para owner/repo
- [ ] ✅ Componentes actualizados
- [ ] ✅ Tipos validados

### Opcionales
- [ ] ✅ Helper project-helpers.ts creado
- [ ] ✅ TypeScript sin warnings

### Testing
- [ ] ✅ Login OAuth funciona
- [ ] ✅ Proyectos cargan
- [ ] ✅ Detalles funcionan
- [ ] ✅ Filtros funcionan
- [ ] ✅ Tags funcionan

### Final
- [ ] ✅ No hay errores en consola
- [ ] ✅ Responsive en móvil/tablet/desktop
- [ ] ✅ Sin warnings de TypeScript
- [ ] ✅ Commit con todos los cambios

---

## 🔗 Referencias

**Documentación relacionada:**
- `INTEGRACION_CLIENTE_SERVIDOR.md` - Análisis completo
- Servidor docs: `API_ENDPOINTS.md`, `CLIENTE_INTEGRACION.md`

**URLs Importantes:**
- Servidor: http://localhost:3000
- Cliente: http://localhost:5173
- OAuth: http://localhost:3000/auth/github
- Health: http://localhost:3000/api/health

---

## 🚨 Troubleshooting

### Error: "401 Unauthorized"
→ Token inválido o expirado  
Solución: Hacer login de nuevo

### Error: "Invalid repository ID format"
→ Usar formato owner/repo  
Solución: Verificar que projectId contiene /

### Error: CORS bloqueado
→ Servidor no tiene CORS permitido  
Solución: Verificar CORS en servidor

### Error: baseURL incorrecto
→ Axios apuntando a URL equivocada  
Solución: Revisar VITE_API_BASE_URL

---

## 📝 Notas Finales

- **Este issue es crítico** - Sin él, el cliente no funciona con servidor
- **Cambios están bien documentados** - Sigue el orden
- **Testing es importante** - Prueba cada test antes de marcar como done
- **Commits frecuentes** - Haz commit después de cada sección

---

**Estado:** 🟡 PENDIENTE  
**Prioridad:** 🔴 CRÍTICA  
**Tiempo:** 2-3 horas  
**Bloqueador:** Issues 01-10 completados
