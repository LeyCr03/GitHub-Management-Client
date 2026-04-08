# 🚀 API Endpoints Implementados

**Versión:** 0.0.1  
**Estado:** ✅ Funcional sin Base de Datos  
**Base URL:** `http://localhost:3000`

---

## 📋 Índice

1. [Autenticación](#autenticación)
2. [Proyectos](#proyectos)
3. [Tags](#tags)
4. [Health Check](#health-check)
5. [Ejemplos cURL](#ejemplos-curl)

---

## 🔐 Autenticación

### 1. Iniciar Flujo OAuth (Legacy)

```http
GET /auth/github
```

**Descripción:** Redirige a GitHub para autenticación OAuth  
**Autenticación:** No requerida  
**Response:** Redirección a GitHub

---

### 2. Callback GitHub OAuth (Legacy)

```http
GET /auth/github/callback?code=<CODE>
```

**Descripción:** Callback de GitHub. Retorna token y usuario.  
**Response:**
```
http://localhost:5173?token=ghu_xxxx&username=john-doe
```

---

### 3. Obtener Usuario Actual

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Descripción:** Obtiene información del usuario autenticado  
**Headers Requeridos:**
- `Authorization: Bearer <github_access_token>`

**Response (200 OK):**
```json
{
  "user": {
    "id": "MDQ6VXNlcjEyMzQ1Ng==",
    "username": "john-doe",
    "email": "john@example.com",
    "name": "John Doe",
    "avatar": "https://avatars.githubusercontent.com/u/123456?v=4",
    "accessToken": "ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

**Error (400):**
```json
{
  "statusCode": 400,
  "message": "Authorization token required"
}
```

**Error (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

---

## 📁 Proyectos

### 1. Obtener Lista de Proyectos

```http
GET /api/projects
Authorization: Bearer <token>
```

**Query Parameters:**
- `tag` (opcional): Filtrar por tag/topic
- `search` (opcional): Buscar en nombre/descripción
- `language` (opcional): Filtrar por lenguaje
- `visibility` (opcional): `public` o `private`

**Response (200 OK):**
```json
{
  "projects": [
    {
      "id": "MDEwOlJlcG9zaXRvcnk1MjA3NzA1Mg==",
      "repositoryId": 123456,
      "name": "awesome-project",
      "description": "A cool project",
      "url": "https://github.com/user/awesome-project",
      "tags": [
        {
          "id": "javascript",
          "name": "javascript",
          "color": "#F1E05A",
          "type": "github-topic",
          "createdAt": "2025-12-01T09:00:00Z",
          "updatedAt": "2026-04-05T12:00:00Z"
        }
      ],
      "stats": {
        "stars": 42,
        "forks": 5,
        "openIssues": 3,
        "language": "TypeScript"
      },
      "updatedAt": "2026-04-05T12:00:00Z",
      "createdAt": "2025-12-01T09:00:00Z",
      "visibility": "public"
    }
  ],
  "total": 15,
  "tags": [
    {
      "id": "javascript",
      "name": "javascript",
      "color": "#F1E05A",
      "type": "github-topic",
      "createdAt": "2025-12-01T09:00:00Z",
      "updatedAt": "2026-04-05T12:00:00Z"
    }
  ]
}
```

**Cache:** 10 minutos

---

### 2. Obtener Detalles de un Proyecto

```http
GET /api/projects/:owner/:repo
Authorization: Bearer <token>
```

**Path Parameters:**
- `:owner/:repo` - Formato: `owner/repositoryname`

**Ejemplo:**
```http
GET /api/projects/anthropics/claude-code
Authorization: Bearer ghu_xxxx
```

**Response (200 OK):**
```json
{
  "project": {
    "id": "MDEwOlJlcG9zaXRvcnk1MjA3NzA1Mg==",
    "repositoryId": 123456,
    "name": "awesome-project",
    "description": "A cool project",
    "url": "https://github.com/user/awesome-project",
    "tags": [...],
    "readme": {
      "content": "# Awesome Project\n\nDescription...",
      "rawUrl": "https://raw.githubusercontent.com/user/awesome-project/HEAD/README.md",
      "lastUpdated": "2026-03-20T14:22:00Z"
    },
    "commits": [
      {
        "sha": "abc1234567890def",
        "message": "Fix bug in parser",
        "author": {
          "name": "John Doe",
          "email": "john@example.com",
          "date": "2026-04-01T10:15:00Z"
        },
        "committer": {
          "name": "John Doe",
          "email": "john@example.com",
          "date": "2026-04-01T10:15:00Z"
        },
        "html_url": "https://github.com/user/repo/commit/abc1234567890def"
      }
    ],
    "stats": {
      "stars": 42,
      "forks": 5,
      "openIssues": 3,
      "language": "TypeScript"
    },
    "contributors": 5,
    "watchers": 12,
    "defaultBranch": "main",
    "updatedAt": "2026-04-05T12:00:00Z",
    "createdAt": "2025-12-01T09:00:00Z",
    "visibility": "public"
  }
}
```

**Cache:** 5 minutos

---

### 3. Obtener Commits de un Proyecto

```http
GET /api/projects/:owner/:repo/commits
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (opcional, default=10): Cantidad máxima de commits (máx 100)

**Ejemplo:**
```http
GET /api/projects/anthropics/claude-code/commits?limit=10
Authorization: Bearer ghu_xxxx
```

**Response (200 OK):**
```json
{
  "commits": [
    {
      "sha": "abc1234567890def",
      "message": "Fix bug in parser",
      "author": {
        "name": "John Doe",
        "email": "john@example.com",
        "date": "2026-04-01T10:15:00Z"
      },
      "committer": {
        "name": "John Doe",
        "email": "john@example.com",
        "date": "2026-04-01T10:15:00Z"
      },
      "html_url": "https://github.com/user/repo/commit/abc1234567890def"
    }
  ]
}
```

**Cache:** 5 minutos

---

### 4. Obtener README de un Proyecto

```http
GET /api/projects/:owner/:repo/readme
Authorization: Bearer <token>
```

**Ejemplo:**
```http
GET /api/projects/anthropics/claude-code/readme
Authorization: Bearer ghu_xxxx
```

**Response (200 OK):**
```json
{
  "content": "# Project Title\n\nMarkdown content...",
  "rawUrl": "https://raw.githubusercontent.com/anthropics/claude-code/HEAD/README.md",
  "lastUpdated": "2026-04-07T10:30:45Z"
}
```

**Response si no hay README (200 OK):**
```json
{
  "content": "No README found",
  "rawUrl": "",
  "lastUpdated": "2026-04-07T10:30:45Z"
}
```

**Cache:** 5 minutos

---

### 5. Actualizar Tags de un Proyecto

```http
PATCH /api/projects/:owner/:repo/tags
Authorization: Bearer <token>
Content-Type: application/json

{
  "tags": ["javascript", "nodejs", "api"]
}
```

**Descripción:** Actualiza GitHub topics del repositorio  
**Ejemplo:**
```http
PATCH /api/projects/anthropics/claude-code/tags
Authorization: Bearer ghu_xxxx
Content-Type: application/json

{
  "tags": ["ai", "claude", "sdk"]
}
```

**Response (200 OK):**
```json
{
  "project": {
    "id": "MDEwOlJlcG9zaXRvcnk1MjA3NzA1Mg==",
    "name": "awesome-project",
    "tags": [
      {
        "id": "javascript",
        "name": "javascript",
        "color": "#F1E05A",
        "type": "github-topic",
        "createdAt": "2025-12-01T09:00:00Z",
        "updatedAt": "2026-04-07T10:30:45Z"
      }
    ]
    // ... resto del proyecto
  }
}
```

**Error (400):**
```json
{
  "statusCode": 400,
  "message": "tags array required"
}
```

---

## 🏷️ Tags

### 1. Obtener Todos los Tags

```http
GET /api/tags
Authorization: Bearer <token>
```

**Descripción:** Obtiene todos los tags (GitHub topics) de los repositorios del usuario  
**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "javascript",
      "name": "javascript",
      "color": "#F1E05A",
      "type": "github-topic",
      "createdAt": "2025-12-01T09:00:00Z",
      "updatedAt": "2026-04-05T12:00:00Z"
    },
    {
      "id": "nodejs",
      "name": "nodejs",
      "color": "#417E8C",
      "type": "github-topic",
      "createdAt": "2025-12-01T09:00:00Z",
      "updatedAt": "2026-04-05T12:00:00Z"
    }
  ]
}
```

**Cache:** 10 minutos

---

### 2. Crear Custom Tag

```http
POST /api/tags
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "mi-tag-personalizado",
  "color": "#FF5733",
  "type": "custom"
}
```

**Body:**
- `name` (string, requerido): Nombre del tag (max 50 caracteres)
- `color` (string, requerido): Color hex (ej: #FF5733)
- `type` (string, opcional): Tipo de tag

**Validaciones:**
- Name no vacío, max 50 caracteres
- Color formato hex válido (#RRGGBB)

**Response (201 Created):**
```json
{
  "tag": {
    "id": "custom-1712502645000",
    "name": "mi-tag-personalizado",
    "color": "#FF5733",
    "type": "custom",
    "createdAt": "2026-04-07T10:30:45Z",
    "updatedAt": "2026-04-07T10:30:45Z"
  }
}
```

**Error (400):**
```json
{
  "statusCode": 400,
  "message": "Valid hex color is required (e.g., #FF5733)"
}
```

**Nota:** Los tags personalizados se guardan en el **cliente (localStorage)**, no en el servidor. Este endpoint simula la creación server-side.

---

### 3. Eliminar Custom Tag

```http
DELETE /api/tags/:id
Authorization: Bearer <token>
```

**Path Parameters:**
- `:id` - ID del tag a eliminar

**Ejemplo:**
```http
DELETE /api/tags/custom-1712502645000
Authorization: Bearer ghu_xxxx
```

**Response (200 OK):**
```json
{
  "success": true
}
```

**Nota:** Los tags personalizados se eliminan en el **cliente**, no en el servidor. Este endpoint simula la eliminación server-side.

---

## 🏥 Health Check

### GET /api/health

```http
GET /api/health
```

**Descripción:** Verifica el estado del servidor  
**Autenticación:** No requerida

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-04-07T10:30:45.123Z",
  "version": "0.0.1"
}
```

---

## 📝 Ejemplos cURL

### 1. Obtener Usuario Actual

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 2. Obtener Lista de Proyectos

```bash
curl -X GET "http://localhost:3000/api/projects" \
  -H "Authorization: Bearer ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 3. Filtrar Proyectos por Tag

```bash
curl -X GET "http://localhost:3000/api/projects?tag=javascript" \
  -H "Authorization: Bearer ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 4. Buscar Proyectos

```bash
curl -X GET "http://localhost:3000/api/projects?search=api" \
  -H "Authorization: Bearer ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 5. Obtener Detalles de un Proyecto

```bash
curl -X GET "http://localhost:3000/api/projects/anthropics/claude-code" \
  -H "Authorization: Bearer ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 6. Obtener Commits

```bash
curl -X GET "http://localhost:3000/api/projects/anthropics/claude-code/commits?limit=5" \
  -H "Authorization: Bearer ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 7. Obtener README

```bash
curl -X GET "http://localhost:3000/api/projects/anthropics/claude-code/readme" \
  -H "Authorization: Bearer ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 8. Actualizar Tags

```bash
curl -X PATCH "http://localhost:3000/api/projects/anthropics/claude-code/tags" \
  -H "Authorization: Bearer ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{"tags": ["javascript", "nodejs", "api"]}'
```

### 9. Obtener Todos los Tags

```bash
curl -X GET "http://localhost:3000/api/tags" \
  -H "Authorization: Bearer ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 10. Crear Custom Tag

```bash
curl -X POST "http://localhost:3000/api/tags" \
  -H "Authorization: Bearer ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mi-proyecto",
    "color": "#FF5733",
    "type": "custom"
  }'
```

### 11. Health Check

```bash
curl -X GET "http://localhost:3000/api/health"
```

---

## ⚙️ Notas de Implementación

### Rate Limiting GitHub API
- GitHub GraphQL: 5,000 points/hour
- Respuestas cacheadas 10 minutos para optimizar
- Commits y README cacheados 5 minutos

### CORS
- **Origen permitido:** `http://localhost:5173`
- **Métodos:** GET, POST, PATCH, DELETE
- **Headers:** Content-Type, Authorization

### Error Handling
Todos los errores siguen este formato:

```json
{
  "statusCode": 400,
  "message": "Descripción del error",
  "error": "BadRequest"
}
```

Códigos HTTP:
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - No token o token inválido
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## 🔄 Flujo Típico del Cliente

```
1. Usuario hace click en "Login con GitHub"
   ↓
2. GET /auth/github (OAuth redirect a GitHub)
   ↓
3. Usuario se autentica en GitHub
   ↓
4. GET /auth/github/callback?code=XXX
   ↓
5. Cliente recibe: http://localhost:5173?token=ghu_xxxx&username=john-doe
   ↓
6. Cliente almacena token en localStorage
   ↓
7. GET /api/auth/me (verifica usuario)
   ↓
8. GET /api/projects (carga lista)
   ↓
9. Usuario interactúa con proyectos (filtros, detalles, etc.)
```

---

**Última actualización:** 2026-04-07
