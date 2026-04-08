# 🔌 Guía de Integración para Cliente React

**Versión:** 0.0.1  
**Servidor:** GitHub Management Server  
**Base URL:** `http://localhost:3000` (desarrollo)  
**Última actualización:** 2026-04-07

---

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Autenticación](#autenticación)
3. [Endpoints Disponibles](#endpoints-disponibles)
4. [Tipos TypeScript](#tipos-typescript)
5. [Ejemplos de Uso](#ejemplos-de-uso)
6. [Interceptores Axios](#interceptores-axios)
7. [Manejo de Errores](#manejo-de-errores)
8. [Caché y Performance](#caché-y-performance)

---

## ⚙️ Configuración Inicial

### 1. Variables de Entorno

Crear archivo `.env.local` en tu proyecto React:

```env
# Servidor API
VITE_API_BASE_URL=http://localhost:3000
VITE_API_VERSION=v1

# GitHub OAuth (opcional, el servidor maneja)
VITE_GITHUB_CLIENT_ID=your_client_id
```

### 2. Cargar Configuración en tu App

```typescript
// src/config/api.ts
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
};

export const API_ENDPOINTS = {
  // Auth
  auth: {
    me: '/api/auth/me',
    github: '/auth/github',
    githubCallback: '/auth/github/callback',
  },
  // Projects
  projects: {
    list: '/api/projects',
    detail: (owner: string, repo: string) => `/api/projects/${owner}/${repo}`,
    commits: (owner: string, repo: string) => `/api/projects/${owner}/${repo}/commits`,
    readme: (owner: string, repo: string) => `/api/projects/${owner}/${repo}/readme`,
    updateTags: (owner: string, repo: string) => `/api/projects/${owner}/${repo}/tags`,
  },
  // Tags
  tags: {
    list: '/api/tags',
    create: '/api/tags',
    delete: (id: string) => `/api/tags/${id}`,
  },
  // Health
  health: '/api/health',
};
```

---

## 🔐 Autenticación

### Flujo OAuth Completo

```
1. Usuario hace click "Login con GitHub"
   ↓
2. GET /auth/github (servidor redirige a GitHub)
   ↓
3. Usuario se autentica en GitHub
   ↓
4. GitHub redirige a: http://localhost:5173?token=ghu_xxxx&username=john
   ↓
5. Cliente extrae token de URL y lo guarda
   ↓
6. Todos los requests incluyen: Authorization: Bearer ghu_xxxx
```

### Implementación del Login

```typescript
// src/services/auth.service.ts
export class AuthService {
  private readonly API_BASE = 'http://localhost:3000';

  /**
   * Inicia flujo OAuth con GitHub
   */
  initiateGithubLogin() {
    window.location.href = `${this.API_BASE}/auth/github`;
  }

  /**
   * Extrae token de la URL después del callback
   */
  extractTokenFromURL(): { token: string; username: string } | null {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const username = params.get('username');

    if (token && username) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_username', username);
      // Limpiar URL
      window.history.replaceState({}, document.title, '/');
      return { token, username };
    }
    return null;
  }

  /**
   * Obtiene token del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Obtiene usuario del localStorage
   */
  getUsername(): string | null {
    return localStorage.getItem('user_username');
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Logout - elimina token
   */
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_username');
  }

  /**
   * Obtiene info del usuario actual desde servidor
   */
  async getCurrentUser() {
    const token = this.getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch('http://localhost:3000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Token expired');
      }
      throw new Error('Failed to fetch user');
    }

    return response.json();
  }
}
```

---

## 📁 Endpoints Disponibles

### Autenticación

#### GET /api/auth/me
Obtiene información del usuario autenticado

```typescript
interface CurrentUserResponse {
  user: {
    id: string;                    // GitHub ID
    username: string;              // GitHub username
    email?: string;
    name?: string;
    avatar?: string;               // Avatar URL
    accessToken: string;           // OAuth token
  };
}

// Uso:
const { user } = await apiClient.get<CurrentUserResponse>('/api/auth/me');
```

---

### Proyectos

#### GET /api/projects
Lista de repositorios del usuario con filtros opcionales

**Query Parameters:**
```typescript
interface GetProjectsParams {
  tag?: string;          // Filtrar por tag/topic
  search?: string;       // Buscar en nombre/descripción
  language?: string;     // Filtrar por lenguaje (TypeScript, Python, etc)
  visibility?: 'public' | 'private';  // Filtrar por visibilidad
}

interface GetProjectsResponse {
  projects: ProjectDto[];
  total: number;
  tags: TagDto[];
}

// Uso:
const response = await apiClient.get<GetProjectsResponse>('/api/projects', {
  params: {
    tag: 'javascript',
    search: 'api',
    language: 'TypeScript',
  },
});
```

---

#### GET /api/projects/:owner/:repo
Obtiene detalles completos de un proyecto

```typescript
interface GetProjectDetailResponse {
  project: ProjectDetailDto;
}

interface ProjectDetailDto extends ProjectDto {
  contributors: number;           // Número de contribuidores
  watchers: number;              // Watchers
  defaultBranch: string;         // Rama principal
}

// Uso:
const { project } = await apiClient.get<GetProjectDetailResponse>(
  '/api/projects/anthropics/claude-code'
);
```

---

#### GET /api/projects/:owner/:repo/commits
Obtiene commits recientes

```typescript
interface GetCommitsParams {
  limit?: number;  // Default: 10, Max: 100
}

interface GetCommitsResponse {
  commits: CommitDto[];
}

interface CommitDto {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;  // ISO 8601
  };
  committer: {
    name: string;
    email: string;
    date: string;
  };
  html_url: string;  // Link al commit en GitHub
}

// Uso:
const { commits } = await apiClient.get<GetCommitsResponse>(
  '/api/projects/anthropics/claude-code/commits',
  { params: { limit: 5 } }
);
```

---

#### GET /api/projects/:owner/:repo/readme
Obtiene contenido del README

```typescript
interface ReadmeDto {
  content: string;        // Contenido en markdown raw
  rawUrl: string;         // URL raw en GitHub
  lastUpdated: string;    // ISO 8601
}

// Uso:
const readme = await apiClient.get<ReadmeDto>(
  '/api/projects/anthropics/claude-code/readme'
);
```

---

#### PATCH /api/projects/:owner/:repo/tags
Actualiza GitHub topics del proyecto

```typescript
interface UpdateProjectTagsRequest {
  tags: string[];  // Array de nombres de tags/topics
}

interface UpdateProjectTagsResponse {
  project: ProjectDetailDto;
}

// Uso:
const { project } = await apiClient.patch<UpdateProjectTagsResponse>(
  '/api/projects/anthropics/claude-code/tags',
  { tags: ['javascript', 'nodejs', 'api'] }
);
```

---

### Tags

#### GET /api/tags
Obtiene lista de todos los tags disponibles

```typescript
interface GetTagsResponse {
  data: TagDto[];
}

interface TagDto {
  id: string;                              // ID único
  name: string;
  color: string;                           // Hex color (#RRGGBB)
  type: 'github-topic' | 'custom';
  createdAt: string;                       // ISO 8601
  updatedAt: string;
}

// Uso:
const { data: tags } = await apiClient.get<GetTagsResponse>('/api/tags');
```

---

#### POST /api/tags
Crea un custom tag (se guarda en localStorage del cliente)

```typescript
interface CreateTagRequest {
  name: string;        // Max 50 caracteres
  color: string;       // Hex color (#RRGGBB)
  type?: string;
}

interface CreateTagResponse {
  tag: TagDto;
}

// Uso:
const { tag } = await apiClient.post<CreateTagResponse>(
  '/api/tags',
  {
    name: 'mi-proyecto-favorito',
    color: '#FF5733',
    type: 'custom',
  }
);
```

---

#### DELETE /api/tags/:id
Elimina un custom tag

```typescript
interface DeleteTagResponse {
  success: boolean;
}

// Uso:
await apiClient.delete<DeleteTagResponse>('/api/tags/custom-1712502645000');
```

---

## 📦 Tipos TypeScript Completos

```typescript
// src/types/api.ts

// ============ USER ============
export interface User {
  id: string;
  username: string;
  email?: string;
  name?: string;
  avatar?: string;
  accessToken: string;
}

// ============ PROJECT ============
export interface ProjectStats {
  stars: number;
  forks: number;
  openIssues: number;
  language?: string;
}

export interface ProjectImage {
  url: string;
  alt: string;
  name: string;
}

export interface ProjectReadme {
  content: string;
  rawUrl: string;
  lastUpdated: string;
}

export interface ProjectCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  committer: {
    name: string;
    email: string;
    date: string;
  };
  html_url: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  type: 'github-topic' | 'custom';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  repositoryId: number;
  name: string;
  description: string;
  url: string;
  tags: Tag[];
  readme?: ProjectReadme;
  coverImage?: ProjectImage;
  images: ProjectImage[];
  commits: ProjectCommit[];
  stats: ProjectStats;
  updatedAt: string;
  createdAt: string;
  visibility: 'public' | 'private';
}

export interface ProjectDetail extends Project {
  contributors: number;
  watchers: number;
  defaultBranch: string;
}

// ============ API RESPONSES ============
export interface ApiResponse<T> {
  data?: T;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ============ API ERRORS ============
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  timestamp?: string;
}
```

---

## 💻 Ejemplos de Uso

### 1. Configurar Axios Client

```typescript
// src/lib/axios-instance.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from '../config/api';

const axiosInstance: AxiosInstance = axios.create(API_CONFIG);

// Interceptor: Agregar token a todos los requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_username');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

### 2. Service para Proyectos

```typescript
// src/services/projects.service.ts
import axios from '../lib/axios-instance';
import { API_ENDPOINTS } from '../config/api';
import { Project, ProjectDetail, ProjectCommit, ProjectReadme } from '../types/api';

export class ProjectsService {
  /**
   * Obtener lista de proyectos
   */
  static async getProjects(filters?: {
    tag?: string;
    search?: string;
    language?: string;
    visibility?: 'public' | 'private';
  }) {
    const response = await axios.get<{
      projects: Project[];
      total: number;
      tags: any[];
    }>(API_ENDPOINTS.projects.list, { params: filters });

    return response.data;
  }

  /**
   * Obtener detalles de un proyecto
   */
  static async getProjectDetail(
    owner: string,
    repo: string
  ): Promise<ProjectDetail> {
    const response = await axios.get<{ project: ProjectDetail }>(
      API_ENDPOINTS.projects.detail(owner, repo)
    );

    return response.data.project;
  }

  /**
   * Obtener commits recientes
   */
  static async getProjectCommits(
    owner: string,
    repo: string,
    limit: number = 10
  ): Promise<ProjectCommit[]> {
    const response = await axios.get<{ commits: ProjectCommit[] }>(
      API_ENDPOINTS.projects.commits(owner, repo),
      { params: { limit } }
    );

    return response.data.commits;
  }

  /**
   * Obtener README
   */
  static async getProjectReadme(
    owner: string,
    repo: string
  ): Promise<ProjectReadme> {
    const response = await axios.get<ProjectReadme>(
      API_ENDPOINTS.projects.readme(owner, repo)
    );

    return response.data;
  }

  /**
   * Actualizar tags del proyecto
   */
  static async updateProjectTags(
    owner: string,
    repo: string,
    tags: string[]
  ): Promise<ProjectDetail> {
    const response = await axios.patch<{ project: ProjectDetail }>(
      API_ENDPOINTS.projects.updateTags(owner, repo),
      { tags }
    );

    return response.data.project;
  }
}
```

---

### 3. Hook para SWR (Recomendado)

```typescript
// src/hooks/useProjects.ts
import useSWR from 'swr';
import axios from '../lib/axios-instance';
import { Project } from '../types/api';
import { API_ENDPOINTS } from '../config/api';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

/**
 * Hook para obtener lista de proyectos con caché
 */
export function useProjects(filters?: {
  tag?: string;
  search?: string;
  language?: string;
}) {
  const queryString = new URLSearchParams(filters).toString();
  const url = `${API_ENDPOINTS.projects.list}${queryString ? `?${queryString}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minuto
    focusThrottleInterval: 300000, // 5 minutos
  });

  return {
    projects: data?.projects ?? [],
    tags: data?.tags ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook para obtener detalles de un proyecto
 */
export function useProjectDetail(owner: string, repo: string) {
  const url = API_ENDPOINTS.projects.detail(owner, repo);

  const { data, error, isLoading, mutate } = useSWR(
    owner && repo ? url : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutos
    }
  );

  return {
    project: data?.project,
    isLoading,
    error,
    mutate,
  };
}

/**
 * Hook para obtener commits
 */
export function useProjectCommits(owner: string, repo: string, limit = 10) {
  const url = `${API_ENDPOINTS.projects.commits(owner, repo)}?limit=${limit}`;

  const { data, error, isLoading } = useSWR(
    owner && repo ? url : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000,
    }
  );

  return {
    commits: data?.commits ?? [],
    isLoading,
    error,
  };
}
```

---

### 4. Componente React Login

```typescript
// src/components/LoginButton.tsx
import { AuthService } from '../services/auth.service';

export function LoginButton() {
  const handleLogin = () => {
    const authService = new AuthService();
    authService.initiateGithubLogin();
  };

  return (
    <button onClick={handleLogin} className="btn btn-primary">
      Login con GitHub
    </button>
  );
}
```

---

### 5. Componente React Dashboard

```typescript
// src/pages/Dashboard.tsx
import { useProjects, useProjectDetail } from '../hooks/useProjects';
import { ProjectsService } from '../services/projects.service';
import { useState } from 'react';

export function Dashboard() {
  const [selectedTag, setSelectedTag] = useState<string>();
  const [searchQuery, setSearchQuery] = useState<string>();
  const { projects, tags, isLoading } = useProjects({
    tag: selectedTag,
    search: searchQuery,
  });

  const handleUpdateTags = async (owner: string, repo: string, newTags: string[]) => {
    try {
      await ProjectsService.updateProjectTags(owner, repo, newTags);
      // Refresh
      alert('Tags actualizados');
    } catch (error) {
      alert('Error al actualizar tags');
    }
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <div className="filters">
        <input
          placeholder="Buscar proyectos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={selectedTag || ''}
          onChange={(e) => setSelectedTag(e.target.value || undefined)}
        >
          <option value="">Todos los tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <div className="tags">
              {project.tags.map((tag) => (
                <span
                  key={tag.id}
                  style={{ backgroundColor: tag.color }}
                  className="tag"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="stats">
              <span>⭐ {project.stats.stars}</span>
              <span>🔀 {project.stats.forks}</span>
              <span>🐛 {project.stats.openIssues}</span>
            </div>
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              Ver en GitHub
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔄 Interceptores Axios

### Request Interceptor (Agregar Token)

```typescript
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Agregar timestamp para debugging
    config.headers['X-Request-Time'] = new Date().toISOString();
    return config;
  },
  (error) => Promise.reject(error)
);
```

### Response Interceptor (Manejar Errores)

```typescript
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[${response.status}] ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data as any;

    switch (status) {
      case 400:
        console.error('Bad Request:', data?.message);
        break;
      case 401:
        console.error('Unauthorized - Token expirado');
        localStorage.removeItem('auth_token');
        window.location.href = '/';
        break;
      case 403:
        console.error('Forbidden:', data?.message);
        break;
      case 404:
        console.error('Not Found:', data?.message);
        break;
      case 500:
        console.error('Server Error:', data?.message);
        break;
      default:
        console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);
```

---

## ❌ Manejo de Errores

### Tipos de Errores Esperados

```typescript
// src/utils/errorHandler.ts

export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = (error.response?.data as any)?.message || error.message;

    switch (status) {
      case 400:
        return `Solicitud inválida: ${message}`;
      case 401:
        return 'Sesión expirada. Por favor, inicia sesión de nuevo.';
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 500:
        return `Error del servidor: ${message}`;
      default:
        return message || 'Error desconocido';
    }
  }

  return 'Error desconocido';
}

// Uso:
try {
  await ProjectsService.getProjects();
} catch (error) {
  const errorMessage = handleApiError(error);
  showNotification(errorMessage, 'error');
}
```

---

## ⚡ Caché y Performance

### Estrategia de Caché Recomendada

```typescript
// SWR Configuration
const SWR_CONFIG = {
  projects: {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minuto (evita duplicados)
    focusThrottleInterval: 300000, // 5 minutos
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  },
  projectDetail: {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutos
  },
  readme: {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutos
  },
};
```

### Manejo de Actualizaciones

```typescript
// Forzar actualización manual
const { mutate } = useProjects();

const handleRefresh = async () => {
  await mutate();
};

// Actualización optimista (Optimistic UI)
const handleUpdateTags = async (owner: string, repo: string, tags: string[]) => {
  try {
    // Actualizar UI antes de confirmar en servidor
    mutate(
      (projects) => ({
        ...projects,
        projects: projects.projects.map((p) =>
          p.name === repo
            ? { ...p, tags: tags.map((t) => ({ id: t, name: t, ... })) }
            : p
        ),
      }),
      false
    );

    // Confirmar en servidor
    await ProjectsService.updateProjectTags(owner, repo, tags);

    // Revalidar si hay diferencias
    await mutate();
  } catch (error) {
    // Revertir cambios
    await mutate();
    throw error;
  }
};
```

---

## 📊 Ejemplo Completo: Página de Proyecto

```typescript
// src/pages/ProjectPage.tsx
import { useParams } from 'react-router-dom';
import { useProjectDetail, useProjectCommits } from '../hooks/useProjects';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ProjectsService } from '../services/projects.service';
import { useState } from 'react';

export function ProjectPage() {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const { project, isLoading: projectLoading } = useProjectDetail(owner, repo);
  const { commits, isLoading: commitsLoading } = useProjectCommits(owner, repo, 10);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (projectLoading) return <div>Cargando proyecto...</div>;
  if (!project) return <div>Proyecto no encontrado</div>;

  const handleSaveTags = async () => {
    try {
      await ProjectsService.updateProjectTags(owner, repo, selectedTags);
      alert('Tags actualizados correctamente');
    } catch (error) {
      alert('Error al actualizar tags');
    }
  };

  return (
    <div className="project-page">
      {/* Header */}
      <header className="project-header">
        <h1>{project.name}</h1>
        <p>{project.description}</p>
        <a href={project.url} target="_blank" rel="noopener noreferrer">
          Ver en GitHub →
        </a>
      </header>

      {/* Stats */}
      <section className="project-stats">
        <div>⭐ {project.stats.stars} Stars</div>
        <div>🔀 {project.stats.forks} Forks</div>
        <div>🐛 {project.stats.openIssues} Issues</div>
        <div>👥 {project.contributors} Contribuidores</div>
        <div>👁️ {project.watchers} Watchers</div>
      </section>

      {/* Tags */}
      <section className="project-tags">
        <h2>Tags</h2>
        <div className="tag-selector">
          {project.tags.map((tag) => (
            <label key={tag.id}>
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.id)}
                onChange={(e) => {
                  setSelectedTags(
                    e.target.checked
                      ? [...selectedTags, tag.id]
                      : selectedTags.filter((t) => t !== tag.id)
                  );
                }}
              />
              <span style={{ backgroundColor: tag.color }}>{tag.name}</span>
            </label>
          ))}
        </div>
        <button onClick={handleSaveTags}>Guardar Tags</button>
      </section>

      {/* README */}
      {project.readme && (
        <section className="project-readme">
          <h2>README</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.readme.content}
          </ReactMarkdown>
        </section>
      )}

      {/* Commits */}
      <section className="project-commits">
        <h2>Commits Recientes</h2>
        {commitsLoading ? (
          <div>Cargando commits...</div>
        ) : (
          <ul>
            {commits.map((commit) => (
              <li key={commit.sha}>
                <a href={commit.html_url} target="_blank" rel="noopener noreferrer">
                  {commit.message}
                </a>
                <div className="commit-meta">
                  por {commit.author.name} el{' '}
                  {new Date(commit.author.date).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
```

---

## 🔗 URLs Útiles

```typescript
// Base URLs
const URLS = {
  server: 'http://localhost:3000',
  client: 'http://localhost:5173',
  githubOAuth: 'http://localhost:3000/auth/github',
  health: 'http://localhost:3000/api/health',
};

// Para desarrollo local:
// - Servidor: http://localhost:3000
// - Cliente React: http://localhost:5173

// Para producción (ajustar según tu deploy):
// - Servidor: https://api.yourdomain.com
// - Cliente React: https://yourdomain.com
```

---

## ✅ Checklist de Integración

- [ ] Configurar variables de entorno (.env.local)
- [ ] Crear axios instance con interceptores
- [ ] Implementar AuthService
- [ ] Crear tipos TypeScript
- [ ] Implementar ProjectsService
- [ ] Crear hooks SWR
- [ ] Crear componentes React
- [ ] Probar login con GitHub
- [ ] Probar GET /api/projects
- [ ] Probar filtros y búsqueda
- [ ] Probar actualizar tags
- [ ] Probar manejo de errores
- [ ] Probar caché y performance

---

## 📞 Troubleshooting

### Error: "Cannot read token from localStorage"
```typescript
// Verificar que estamos en el cliente (no SSR)
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token');
}
```

### Error: CORS bloqueado
```
CORS error → El servidor necesita permitir tu dominio
Solución: Verificar CORS en src/main.ts del servidor
```

### Error: 401 Unauthorized
```
Token expirado o inválido
Solución: Hacer nuevo login en http://localhost:3000/auth/github
```

### Error: Project not found
```
Formato incorrecto: debe ser owner/repo
Correcto: /api/projects/anthropics/claude-code
```

---

## 🎯 Próximos Pasos

1. **Copia esta guía** a tu proyecto React
2. **Configura el .env.local** con la URL del servidor
3. **Implementa los servicios** (AuthService, ProjectsService)
4. **Crea los hooks** (useProjects, useProjectDetail)
5. **Integra en tus componentes** usando ejemplos arriba
6. **Prueba todo** con el TESTING_GUIDE.md

---

**Versión:** 0.0.1  
**Última actualización:** 2026-04-07  
**Estado:** ✅ Listo para integrar en Cliente React
