# 🔌 Plan de Integración Cliente ↔ Servidor

**Fecha:** 2026-04-07  
**Versión:** 0.0.1  
**Estado:** Análisis Completo - Listo para Implementación  
**Cliente:** React 19.2 + TypeScript  
**Servidor:** NestJS 11 (GitHub Management Server)

---

## 📋 Índice

1. [Análisis Actual](#análisis-actual)
2. [Incompatibilidades Encontradas](#incompatibilidades-encontradas)
3. [Cambios Necesarios en Cliente](#cambios-necesarios-en-cliente)
4. [Cambios Necesarios en Servidor](#cambios-necesarios-en-servidor)
5. [Cambios Opcionales](#cambios-opcionales)
6. [Guía Paso a Paso](#guía-paso-a-paso)
7. [Testing de Integración](#testing-de-integración)
8. [Roadmap de Implementación](#roadmap-de-implementación)

---

## 📊 Análisis Actual

### Cliente (React)

**Estado:** 80% funcional, necesita adaptación a servidor real

- ✅ Estructura base lista
- ✅ Componentes UI creados
- ✅ Hooks SWR implementados
- ✅ API client configurado
- ✅ Autenticación (localStorage ready)
- ⚠️ Endpoints no coinciden con servidor
- ⚠️ Tipos no coinciden completamente
- ⚠️ Formato de respuestas diferente

### Servidor (NestJS)

**Estado:** 100% funcional y listo

- ✅ Todos los endpoints implementados
- ✅ OAuth con GitHub
- ✅ Caché automático
- ✅ Validaciones
- ✅ Error handling
- ✅ CORS configurado

---

## ❌ Incompatibilidades Encontradas

### 1. **Path de Proyectos**

#### Cliente espera:
```
GET /api/projects/:projectId
GET /api/projects/:projectId/readme
GET /api/projects/:projectId/commits
PATCH /api/projects/:projectId/tags
```

#### Servidor proporciona:
```
GET /api/projects/:owner/:repo
GET /api/projects/:owner/:repo/readme
GET /api/projects/:owner/:repo/commits
PATCH /api/projects/:owner/:repo/tags
```

**Impacto:** 🔴 CRÍTICO

**Solución:** Cliente debe usar formato `owner/repo` en lugar de `projectId`

---

### 2. **Estructura de Respuesta - GET /api/projects**

#### Cliente espera:
```json
{
  "projects": [Project],
  "total": number,
  "tags": [Tag]
}
```

#### Servidor retorna:
```json
{
  "projects": [Project],
  "total": number,
  "tags": [Tag]
}
```

**Impacto:** ✅ COMPATIBLE

---

### 3. **Tags Personalizados**

#### Cliente espera:
```
- Crear tags en servidor: POST /api/tags
- Guardar en BD del servidor
- Otros usuarios pueden verlos
```

#### Servidor proporciona:
```
- Tags son solo GitHub topics (no personalizados)
- Endpoint POST /api/tags simula creación pero guarda en localStorage
- Solo el usuario local ve sus custom tags
```

**Impacto:** 🟡 MODERADO

**Solución:** Aceptar limitación actual o agregar BD en futuro

---

### 4. **Modelo de Datos - Project**

#### Cliente define:
```typescript
{
  id: string;                          // ← Espera ID
  repositoryId: number;
  name: string;
  description: string;
  url: string;
  tags: Tag[];
  readme?: ProjectReadme;
  coverImage?: ProjectImage;           // ← No viene del servidor
  images: ProjectImage[];              // ← No viene del servidor
  commits: GitHubCommit[];             // ← Viene en endpoint separado
  stats: { stars, forks, openIssues, language };
  updatedAt: string;
  createdAt: string;
  visibility: 'public' | 'private';
}
```

#### Servidor proporciona:
```typescript
{
  id: string;                          // GitHub global node ID
  repositoryId: number;
  name: string;
  description: string;
  url: string;
  tags: Tag[];
  // NO viene: readme, coverImage, images, commits
  stats: { stars, forks, openIssues, language };
  updatedAt: string;
  createdAt: string;
  visibility: 'public' | 'private';
}
```

**Impacto:** 🟡 MODERADO

**Solución:** Cliente debe obtener `readme` y `commits` en endpoints separados

---

### 5. **Autenticación - OAuth Callback**

#### Cliente espera:
```
http://localhost:5173?token=ghu_xxxx&username=john
```

#### Servidor proporciona:
```
http://localhost:5173?token=ghu_xxxx&username=john
```

**Impacto:** ✅ COMPATIBLE

---

### 6. **Modelo ProjectDetail**

#### Cliente espera:
```typescript
interface ProjectDetail extends Project {
  contributors: number;
  watchers: number;
  defaultBranch: string;
}
```

#### Servidor proporciona:
```typescript
En GET /api/projects/:owner/:repo {
  contributors: number;
  watchers: number;
  defaultBranch: string;
  // PLUS todo el resto del Project
}
```

**Impacto:** ✅ COMPATIBLE

---

### 7. **Commits**

#### Cliente espera:
```
GET /api/projects/:projectId/commits?limit=10
```

#### Servidor proporciona:
```
GET /api/projects/:owner/:repo/commits?limit=10
```

**Impacto:** 🔴 CRÍTICO (mismo problema del path)

---

### 8. **README**

#### Cliente espera:
```
GET /api/projects/:projectId/readme → { content: string }
```

#### Servidor proporciona:
```
GET /api/projects/:owner/:repo/readme → { content, rawUrl, lastUpdated }
```

**Impacto:** ✅ COMPATIBLE (servidor devuelve más datos, cliente solo usa content)

---

### 9. **Tags**

#### Cliente espera:
```
GET /api/tags → { data: [Tag] }
POST /api/tags → { tag: Tag }
PATCH /api/projects/:projectId/tags → { project: Project }
DELETE /api/tags/:id → { success: boolean }
```

#### Servidor proporciona:
```
GET /api/tags → { data: [Tag] }
POST /api/tags → { tag: Tag }
PATCH /api/projects/:owner/:repo/tags → { project: Project }
DELETE /api/tags/:id → { success: boolean }
```

**Impacto:** 🔴 CRÍTICO (path diferente en PATCH)

---

## ✏️ Cambios Necesarios en Cliente

### 1. **Actualizar API Base URL (CRÍTICO)**

**Archivo:** `src/lib/axios-instance.ts`

```typescript
// ANTES
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
})

// DESPUÉS (Sin /api al final, se agrega en endpoints)
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
})
```

**Archivo:** `src/lib/api.ts`

```typescript
// Actualizar todos los endpoints para incluir /api
class GitHubDashboardAPI {
  async getProjects(filterTag?: string): Promise<GetProjectsResponse> {
    const params = filterTag ? { tag: filterTag } : {}
    const response = await axios.get<GetProjectsResponse>('/api/projects', { params })
    return response.data
  }

  async getProjectDetail(projectId: string): Promise<GetProjectDetailResponse> {
    // ANTES: const response = await axios.get<GetProjectDetailResponse>(`/projects/${projectId}`)
    // DESPUÉS: Convertir projectId a owner/repo format
    // Si projectId es "owner/repo", enviar tal cual
    // Si projectId es "id", buscar primero en caché o hacer búsqueda
    const response = await axios.get<GetProjectDetailResponse>(`/api/projects/${projectId}`)
    return response.data
  }

  async getReadmeContent(projectId: string): Promise<string> {
    // ANTES: const response = await axios.get<{ content: string }>(`/projects/${projectId}/readme`)
    // DESPUÉS:
    const response = await axios.get<{ content: string }>(
      `/api/projects/${projectId}/readme`
    )
    return response.data.content
  }

  async getProjectCommits(projectId: string, limit: number = 10) {
    // ANTES: const response = await axios.get(`/projects/${projectId}/commits`, ...)
    // DESPUÉS:
    const response = await axios.get(`/api/projects/${projectId}/commits`, {
      params: { limit },
    })
    return response.data
  }

  async updateProjectTags(projectId: string, tagIds: string[]): Promise<UpdateProjectTagsResponse> {
    const payload: UpdateProjectTagsRequest = { tags: tagIds }
    // ANTES: const response = await axios.patch<UpdateProjectTagsResponse>(`/projects/${projectId}/tags`, payload)
    // DESPUÉS:
    const response = await axios.patch<UpdateProjectTagsResponse>(
      `/api/projects/${projectId}/tags`,
      payload
    )
    return response.data
  }

  async deleteTag(tagId: string): Promise<void> {
    // ANTES: await axios.delete(`/tags/${tagId}`)
    // DESPUÉS:
    await axios.delete(`/api/tags/${tagId}`)
  }

  async getTags() {
    // ANTES: const response = await axios.get<ApiResponse<any>>('/tags')
    // DESPUÉS:
    const response = await axios.get<ApiResponse<any>>('/api/tags')
    return response.data.data
  }

  async createTag(tagData: CreateTagRequest): Promise<CreateTagResponse> {
    // ANTES: const response = await axios.post<CreateTagResponse>('/tags', tagData)
    // DESPUÉS:
    const response = await axios.post<CreateTagResponse>('/api/tags', tagData)
    return response.data
  }
}
```

### 2. **Actualizar Tipos TypeScript (CRÍTICO)**

**Archivo:** `src/types/api.ts` y `src/types/project.ts`

El servidor responde diferente, necesita actualizar:

```typescript
// El servidor NO retorna coverImage ni images en la lista inicial
// Estos deben ser opcionales o null
export interface Project {
  id: string;
  repositoryId: number;
  name: string;
  description: string;
  url: string;
  tags: Tag[];
  readme?: ProjectReadme;
  coverImage?: ProjectImage;  // ← Puede ser null del servidor
  images: ProjectImage[];     // ← Puede ser [] vacío
  commits: GitHubCommit[];    // ← SOLO en /api/projects/:owner/:repo
  stats: { ... };
  updatedAt: string;
  createdAt: string;
  visibility: 'public' | 'private';
}

// El servidor USA owner/repo en lugar de projectId
// Necesita mapeo o cambio en hooks
```

### 3. **Actualizar Hooks SWR (CRÍTICO)**

**Archivo:** `src/hooks/useProjectDetail.ts`

```typescript
// ANTES
export const useProjectDetail = (projectId: string): UseProjectDetailReturn => {
  const { data, error, mutate, isLoading } = useSWR(
    projectId ? ['project', projectId] : null,
    async () => {
      if (!projectId) return null
      const response = await api.getProjectDetail(projectId)
      return response.project
    },
  )
  return { project: data ?? undefined, isLoading, isError: !!error, mutate }
}

// DESPUÉS
// Ahora el servidor espera owner/repo format
// El cliente puede recibir projectId como "owner/repo" y pasar directo
// O puede recibir solo "name" y necesitar owner del contexto
export const useProjectDetail = (ownerRepo: string): UseProjectDetailReturn => {
  const { data, error, mutate, isLoading } = useSWR(
    ownerRepo ? ['project', ownerRepo] : null,
    async () => {
      if (!ownerRepo) return null
      const response = await api.getProjectDetail(ownerRepo)
      return response.project
    },
  )
  return { project: data ?? undefined, isLoading, isError: !!error, mutate }
}
```

### 4. **Componentes que usan projectId (CRÍTICO)**

Revisar y actualizar:

**Archivos afectados:**
- `src/components/dashboard/FoldersView.tsx` - Si usa projectId
- `src/components/dashboard/ProjectCard.tsx` - Si navega a detalles
- `src/pages/Dashboard.tsx` - Si pasa projectId

**Cambio:**
```typescript
// ANTES: Pasar projectId como simple string
// DESPUÉS: Pasar en formato owner/repo o construir desde componente

// Si tienen acceso a repository.full_name usar eso:
const ownerRepo = project.url.split('github.com/')[1]  // "owner/repo"
// O mejor aún, guardar en el objeto Project
```

### 5. **Validar Autenticación y Token Handling**

**Archivo:** `src/lib/axios-instance.ts`

El servidor usa `/auth/github` para OAuth, verificar que:

```typescript
// Interceptor está bien, solo verificar URLs
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Esto está correcto, mantener igual
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      // Opcional: window.location.href = '/auth/github' o '/login'
    }
    return Promise.reject(error)
  }
)
```

### 6. **Componente de Login (IMPORTANTE)**

**Archivo:** `src/App.tsx` o componente de login

El servidor proporciona `/auth/github` para iniciar OAuth:

```typescript
// Crear componente o función que llame a:
const handleGithubLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`
}

// El servidor redirigirá a GitHub y luego de callback enviará a:
// http://localhost:5173?token=ghu_xxxx&username=john

// En App.tsx, extraer token de URL:
useEffect(() => {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  const username = params.get('username')

  if (token && username) {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_username', username)
    // Limpiar URL
    window.history.replaceState({}, document.title, '/')
  }
}, [])
```

### 7. **Actualizar .env (IMPORTANTE)**

**Archivo:** `.env.local`

```env
# ANTES
VITE_API_BASE_URL=http://localhost:3000/api

# DESPUÉS (sin /api)
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🔧 Cambios Necesarios en Servidor

### 1. **Base URL en CORS (IMPORTANTE)**

**Archivo:** `src/main.ts` (servidor)

Verificar que CORS permite origen correcto:

```typescript
// ANTES
app.enableCors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
})

// DESPUÉS (igual, ya está correcto)
```

### 2. **Validación de Tokens (IMPORTANTE)**

El servidor debe validar tokens correctamente. Verificar en `src/services/github.service.ts`:

```typescript
// Validar que:
1. Token se recibe como "Bearer {token}" en header Authorization
2. Token se valida contra GitHub API
3. Responder con 401 si es inválido

// Esto ya está implementado según documentación, pero verificar
```

### 3. **Agregar Endpoint de Info del Usuario (OPCIONAL)**

El servidor tiene `/api/auth/me` pero cliente podría necesitar más info.

Servidor ya lo proporciona, cliente solo necesita llamarlo después de login.

### 4. **Campos Adicionales en Respuesta de Projects (OPCIONAL)**

El cliente espera ciertos campos que el servidor no proporciona:

```typescript
// Cliente espera en Project:
- readme (opcional)
- coverImage (opcional)
- images (array)
- commits (array)

// Servidor proporciona estos en endpoints separados:
GET /api/projects/:owner/:repo → readme incluido
GET /api/projects/:owner/:repo/commits → commits separado

// SOLUCIÓN: Cliente debe hacer requests adicionales o aceptar campos opcionales
```

### 5. **Documentación de Rate Limits (INFORMATIVO)**

Servidor respeta límites de GitHub (5000 points/hora). Documentar en cliente:

```typescript
// Si obtiene error de rate limit (status 429):
// - Mostrar mensaje al usuario
// - Sugerir esperar 1 hora
// - O usar datos cacheados (válidos por 10 minutos)
```

---

## 📝 Cambios Opcionales

### 1. **Agregar Mapeo de projectId a owner/repo**

Para mantener compatibilidad, crear helper:

```typescript
// src/lib/project-helpers.ts
export function toOwnerRepo(projectUrl: string): string {
  // Convertir: https://github.com/user/repo → user/repo
  return projectUrl.split('github.com/')[1]
}

export function toProjectUrl(ownerRepo: string): string {
  return `https://github.com/${ownerRepo}`
}

// Uso en componentes:
const ownerRepo = toOwnerRepo(project.url)
await api.getProjectDetail(ownerRepo)
```

### 2. **Cache Strategy en Cliente**

Cliente ya usa SWR, pero podría optimizar:

```typescript
// Actual
const { projects, tags, isLoading } = useGithubProjects()

// Mejorado: Agregar opciones de caché
const { projects, tags, isLoading } = useGithubProjects('finished', {
  revalidateOnFocus: false,
  dedupingInterval: 60000, // 1 minuto
  focusThrottleInterval: 300000, // 5 minutos
})
```

### 3. **Agregar BD para Tags Personalizados (FUTURO)**

Actualmente:
- Tags de GitHub se guardan en servidor
- Custom tags se guardan en localStorage

Futuro:
- Agregar BD PostgreSQL
- Migrar custom tags a BD
- Permitir compartir tags entre usuarios

No es necesario para integración inicial.

### 4. **Agregar Gestión de Imágenes (FUTURO)**

Cliente espera `coverImage` e `images`. Opciones:

1. **Ignorar por ahora** - Campos opcionales en Cliente, servidor no los proporciona
2. **Agregar endpoint de imágenes** - POST /api/projects/:owner/:repo/images
3. **Guardar en BD** - Cuando haya BD

No es necesario para integración inicial.

---

## 🛣️ Guía Paso a Paso

### Fase 1: Cambios Críticos (2 horas)

**Estos cambios son obligatorios:**

#### 1.1. Actualizar axios-instance.ts
```bash
Archivo: src/lib/axios-instance.ts
Cambio: baseURL debe ser 'http://localhost:3000' sin /api
Tiempo: 5 minutos
```

#### 1.2. Actualizar api.ts
```bash
Archivo: src/lib/api.ts
Cambio: Todos los endpoints deben llevar /api al inicio
Ejemplo: '/projects' → '/api/projects'
Tiempo: 15 minutos
```

#### 1.3. Actualizar hooks
```bash
Archivos: src/hooks/useProjectDetail.ts, useProjectCommits.ts, etc.
Cambio: Parámetro projectId → ownerRepo (formato owner/repo)
Tiempo: 30 minutos
```

#### 1.4. Actualizar .env
```bash
Archivo: .env.local
Cambio: VITE_API_BASE_URL=http://localhost:3000
Tiempo: 2 minutos
```

#### 1.5. Crear componente de Login
```bash
Archivo: src/components/LoginButton.tsx (NUEVO)
Cambio: Botón que llama a window.location.href = baseURL + '/auth/github'
Tiempo: 15 minutos
```

#### 1.6. Manejar OAuth Callback en App
```bash
Archivo: src/App.tsx
Cambio: Extraer token y username de URL después de login
Tiempo: 15 minutos
```

### Fase 2: Cambios de Tipos (1 hora)

#### 2.1. Validar tipos en src/types/
```bash
Archivos: src/types/project.ts, src/types/api.ts
Cambio: Hacer coverImage, images opcionales
Cambio: readme viene en endpoint separado
Tiempo: 30 minutos
```

#### 2.2. Actualizar componentes que usan projectId
```bash
Archivos: FoldersView, ProjectCard, Dashboard
Cambio: Usar formato owner/repo o extraer de project.url
Tiempo: 30 minutos
```

### Fase 3: Testing (1 hora)

#### 3.1. Test de Login
```bash
Acción: Click en botón Login → Redirige a GitHub
Resultado: Vuelve a app con token en URL
Tiempo: 15 minutos
```

#### 3.2. Test de Carga de Proyectos
```bash
Acción: GET /api/projects con token válido
Resultado: Muestra lista de proyectos
Tiempo: 15 minutos
```

#### 3.3. Test de Detalles
```bash
Acción: Click en proyecto → Ve detalles
Resultado: Muestra commits, README, estadísticas
Tiempo: 15 minutos
```

#### 3.4. Test de Filtros
```bash
Acción: Filtrar por tag, buscar, etc.
Resultado: Filtra correctamente
Tiempo: 15 minutos
```

---

## 🧪 Testing de Integración

### Test 1: Autenticación

```bash
1. Navega a http://localhost:5173
2. Click en "Login con GitHub"
3. Autentícate en GitHub
4. Vuelves a http://localhost:5173?token=ghu_xxx&username=xxx
5. Se guarda token en localStorage
6. ✅ PASS si ves el dashboard
```

### Test 2: Obtener Proyectos

```bash
1. Con token válido, GET /api/projects
2. Esperar respuesta con { projects, total, tags }
3. Verificar estructura de cada proyecto
4. ✅ PASS si renderiza lista completa
```

### Test 3: Ver Detalles

```bash
1. Click en un proyecto
2. GET /api/projects/owner/repo (ej: anthropics/claude-code)
3. Mostrar commits, README, stats
4. ✅ PASS si carga todos los datos
```

### Test 4: Actualizar Tags

```bash
1. En detalles, agregar/quitar tags
2. PATCH /api/projects/owner/repo/tags
3. Refrescar lista
4. ✅ PASS si persisten los cambios
```

### Test 5: Crear Custom Tag

```bash
1. Click en "Crear Tag"
2. POST /api/tags { name, color, type: 'custom' }
3. ✅ PASS si retorna tag creado
4. ⚠️ Nota: Se guarda en localStorage, no es persistente entre sesiones
```

---

## 📅 Roadmap de Implementación

### Sprint 1: Integración Básica (Día 1-2)

**Objetivos:**
- ✅ Cliente conecta al servidor
- ✅ Login con GitHub funciona
- ✅ Lista de proyectos carga

**Tareas:**
- [ ] Actualizar axios-instance.ts
- [ ] Actualizar api.ts con /api prefix
- [ ] Actualizar .env.local
- [ ] Crear LoginButton.tsx
- [ ] Manejar OAuth callback en App.tsx
- [ ] Test: Login funciona
- [ ] Test: Lista de proyectos carga

**Tiempo estimado:** 4 horas

### Sprint 2: Funcionalidades Principales (Día 3-4)

**Objetivos:**
- ✅ Ver detalles de proyectos
- ✅ Filtrar por tags
- ✅ Buscar proyectos

**Tareas:**
- [ ] Actualizar hooks para usar owner/repo
- [ ] Actualizar componentes
- [ ] Actualizar tipos TypeScript
- [ ] Test: Detalles de proyecto
- [ ] Test: Filtros funcionan
- [ ] Test: Búsqueda funciona

**Tiempo estimado:** 3 horas

### Sprint 3: Tags y Edición (Día 5)

**Objetivos:**
- ✅ Crear custom tags
- ✅ Actualizar tags de proyectos
- ✅ Eliminar tags

**Tareas:**
- [ ] Validar endpoint POST /api/tags
- [ ] Validar endpoint PATCH /api/projects/:owner/:repo/tags
- [ ] Validar endpoint DELETE /api/tags/:id
- [ ] Test: Crear tag
- [ ] Test: Actualizar tags de proyecto
- [ ] Test: Eliminar tag

**Tiempo estimado:** 2 horas

### Sprint 4: Polish y Optimización (Día 6)

**Objetivos:**
- ✅ Performance optimizado
- ✅ Error handling completo
- ✅ Documentación actualizada

**Tareas:**
- [ ] Optimizar caché en SWR
- [ ] Mejorar error messages
- [ ] Loading states en componentes
- [ ] Test de performance
- [ ] Actualizar documentación

**Tiempo estimado:** 2 horas

---

## 📊 Matriz de Cambios

| Componente | Cambio Necesario | Prioridad | Horas | Estado |
|-----------|------------------|-----------|-------|--------|
| axios-instance.ts | Remover /api de baseURL | 🔴 CRÍTICO | 0.25 | TODO |
| api.ts | Agregar /api a endpoints | 🔴 CRÍTICO | 0.5 | TODO |
| useProjectDetail | Cambiar projectId → ownerRepo | 🔴 CRÍTICO | 0.5 | TODO |
| useProjectCommits | Cambiar projectId → ownerRepo | 🔴 CRÍTICO | 0.25 | TODO |
| useReadmeContent | Cambiar projectId → ownerRepo | 🔴 CRÍTICO | 0.25 | TODO |
| types/project.ts | Hacer fields opcionales | 🟡 MODERADO | 0.5 | TODO |
| types/api.ts | Validar compatibilidad | 🟡 MODERADO | 0.25 | TODO |
| App.tsx | Manejar OAuth callback | 🔴 CRÍTICO | 0.5 | TODO |
| LoginButton.tsx | Crear botón de login | 🔴 CRÍTICO | 0.25 | TODO |
| FoldersView.tsx | Actualizar referencias | 🟡 MODERADO | 0.5 | TODO |
| ProjectCard.tsx | Actualizar referencias | 🟡 MODERADO | 0.5 | TODO |
| Dashboard.tsx | Verificar compatibilidad | 🟡 MODERADO | 0.25 | TODO |
| .env.local | Actualizar baseURL | 🔴 CRÍTICO | 0.1 | TODO |
| Color Palette | Ya completado | ✅ HECHO | 0 | DONE |
| **TOTAL** | | | **6.75h** | |

---

## ✅ Checklist de Integración

### Pre-Integración
- [ ] Servidor NestJS está running en http://localhost:3000
- [ ] Cliente React está en http://localhost:5173
- [ ] Token OAuth de GitHub está disponible
- [ ] Documentación leída completa

### Fase 1: Setup
- [ ] Actualizar axios-instance.ts
- [ ] Actualizar api.ts
- [ ] Actualizar .env.local
- [ ] Crear LoginButton.tsx
- [ ] Manejar OAuth callback en App.tsx

### Fase 2: Integración
- [ ] Actualizar useProjectDetail hook
- [ ] Actualizar useProjectCommits hook
- [ ] Actualizar useReadmeContent hook
- [ ] Actualizar componentes que usan projectId
- [ ] Validar tipos TypeScript

### Fase 3: Testing
- [ ] Test login con GitHub
- [ ] Test carga de proyectos
- [ ] Test filtro por tag
- [ ] Test búsqueda
- [ ] Test detalles de proyecto
- [ ] Test crear custom tag
- [ ] Test actualizar tags
- [ ] Test eliminar tags

### Fase 4: Optimización
- [ ] Optimizar caché SWR
- [ ] Mejorar error messages
- [ ] Agregar loading states
- [ ] Test de performance
- [ ] Documentación actualizada

### Producción
- [ ] Configurar variables de entorno (producción)
- [ ] HTTPS configurado
- [ ] CORS configurado para producción
- [ ] OAuth app en GitHub actualizada
- [ ] Testing en producción
- [ ] Monitoreo activo

---

## 🚨 Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|--------|-----------|
| Token expirado | Alta | Crítico | Refrescar login automático |
| Rate limit GitHub | Media | Moderado | Caché de 10 min, feedback al usuario |
| CORS error | Media | Crítico | Verificar CORS en servidor |
| Formato projectId | Alta | Crítico | Documentación clara, helpers |
| Custom tags no persisten | Baja | Bajo | Documentar limitación, plan futuro BD |
| Datos inconsistentes | Baja | Crítico | Validación en cliente + servidor |

---

## 📚 Documentación Actualizar

**Archivos que necesitan actualización después de integración:**

1. `README.md` - Agregar instrucciones de integración
2. `docs/ARQUITECTURA.md` - Actualizar con flujo real
3. `docs/SETUP.md` - Agregar pasos servidor + cliente
4. `SERVER_REQUIREMENTS.md` - Validar con implementación real

---

## 🎯 Resumen Ejecutivo

### Estado Actual
- **Cliente:** 80% funcional, necesita adaptación a servidor
- **Servidor:** 100% funcional y listo

### Cambios Requeridos
- **Críticos:** 6 cambios (baseURL, endpoints, hooks, login, .env, tipos)
- **Moderados:** 6 cambios (componentes, tipos)
- **Opcionales:** 4 cambios (helpers, caché, imágenes, BD)

### Tiempo Estimado
- **Setup:** 2 horas
- **Integración:** 3 horas
- **Testing:** 1 hora
- **Optimización:** 1 hora
- **Total:** ~7 horas (1 día de trabajo)

### Go/No-Go
✅ **GO** - Todos los cambios son viables y no requieren cambios en servidor

---

## 📞 Q&A

**P: ¿Necesito cambiar el servidor?**
A: NO. El servidor está listo. Solo cambios en cliente.

**P: ¿Qué pasa con los custom tags?**
A: Se guardan en localStorage. Futuro: agregar BD para persistencia.

**P: ¿Qué pasa si cambio a producción?**
A: Actualizar URLs en .env y CORS en servidor.

**P: ¿Se pueden mantener ambas versiones de API?**
A: Sí, agregar prefix v2 si es necesario.

---

**Versión:** 0.0.1  
**Última actualización:** 2026-04-07  
**Status:** ✅ Listo para Implementación
