# Issue 2: Definir Tipos TypeScript

## Objetivo
Crear toda la estructura de tipos necesaria para el proyecto.

## Tareas

### 1. Crear tipos de GitHub
**Archivo:** `src/types/github.ts`

```typescript
export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language: string | null
  updated_at: string
  pushed_at: string
}

export interface GitHubCommit {
  sha: string
  message: string
  author: {
    name: string
    email: string
    date: string
  }
  committer: {
    name: string
    email: string
    date: string
  }
  html_url: string
}

export interface GitHubReadme {
  content: string // Base64 encoded
  download_url: string
  html_url: string
}
```

### 2. Crear tipos de Tags
**Archivo:** `src/types/tags.ts`

```typescript
export type TagType = 'finished' | 'side-project' | 'pet-project' | 'learning' | 'archived' | 'custom'

export interface Tag {
  id: string
  name: string
  color: string // hex color: #FF5733
  type: TagType
  createdAt: string
  updatedAt: string
}

export interface TagColorMap {
  finished: string
  'side-project': string
  'pet-project': string
  learning: string
  archived: string
  custom: string
}
```

### 3. Crear tipos de Proyecto
**Archivo:** `src/types/project.ts`

```typescript
import { Tag } from './tags'
import { GitHubCommit } from './github'

export interface ProjectReadme {
  content: string // Markdown raw
  rawUrl: string
  lastUpdated: string
}

export interface ProjectImage {
  url: string
  alt: string
  name: string
}

export interface Project {
  id: string
  repositoryId: number
  name: string
  description: string
  url: string // GitHub repo URL
  tags: Tag[]
  readme?: ProjectReadme
  coverImage?: ProjectImage
  images: ProjectImage[]
  commits: GitHubCommit[]
  stats: {
    stars: number
    forks: number
    openIssues: number
    language?: string
  }
  updatedAt: string
  createdAt: string
  visibility: 'public' | 'private'
}

export interface ProjectDetail extends Project {
  contributors: number
  watchers: number
  defaultBranch: string
}

export interface ProjectCreateRequest {
  repositoryId: number
  tags: string[] // Tag IDs
}

export interface ProjectUpdateRequest {
  tags: string[] // Tag IDs
  coverImage?: ProjectImage
}
```

### 4. Crear tipos de API
**Archivo:** `src/types/api.ts`

```typescript
import { Project, ProjectDetail } from './project'
import { Tag } from './tags'

export interface ApiResponse<T> {
  data: T
  status: 'success' | 'error'
  message?: string
  timestamp: string
}

export interface ApiErrorResponse {
  status: 'error'
  message: string
  code: string
  timestamp: string
}

export interface GetProjectsResponse {
  projects: Project[]
  total: number
  tags: Tag[]
}

export interface GetProjectDetailResponse {
  project: ProjectDetail
}

export interface UpdateProjectTagsRequest {
  tags: string[] // Tag IDs
}

export interface UpdateProjectTagsResponse {
  project: Project
}

export interface CreateTagRequest {
  name: string
  color: string
  type: 'custom'
}

export interface CreateTagResponse {
  tag: Tag
}
```

### 5. Crear archivo índice de tipos
**Archivo:** `src/types/index.ts`

```typescript
export * from './github'
export * from './tags'
export * from './project'
export * from './api'
```

## Criterios de Aceptación
- ✅ Todos los archivos de tipos creados
- ✅ No hay conflictos de importación circular
- ✅ TypeScript compila sin errores
- ✅ Todos los tipos son exportados desde `src/types/index.ts`
- ✅ Las interfaces están bien documentadas

## Notas Importantes
- Asegúrate que los nombres de tipos sean **PascalCase**
- Los **tipos de API deben coincidir** con lo que devuelve tu backend
- Mantén los tipos **pequeños y enfocados** en una responsabilidad
