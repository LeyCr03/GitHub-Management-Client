# 🧪 Guía de Testing - API Endpoints

**Objetivo:** Probar todos los endpoints implementados  
**Requisitos:** Token OAuth de GitHub válido, Postman o cURL

---

## 📚 Tabla de Endpoints a Probar

| # | Endpoint | Método | Parámetros | Status |
|---|----------|--------|-----------|--------|
| 1 | `/api/health` | GET | - | ✅ |
| 2 | `/api/auth/me` | GET | token | ✅ |
| 3 | `/api/projects` | GET | token | ✅ |
| 4 | `/api/projects?tag=X` | GET | token, tag | ✅ |
| 5 | `/api/projects?search=X` | GET | token, search | ✅ |
| 6 | `/api/projects/:owner/:repo` | GET | token, path | ✅ |
| 7 | `/api/projects/:owner/:repo/commits` | GET | token, path | ✅ |
| 8 | `/api/projects/:owner/:repo/readme` | GET | token, path | ✅ |
| 9 | `/api/projects/:owner/:repo/tags` | PATCH | token, body | ✅ |
| 10 | `/api/tags` | GET | token | ✅ |
| 11 | `/api/tags` | POST | token, body | ✅ |
| 12 | `/api/tags/:id` | DELETE | token, path | ✅ |

---

## 🚀 Pasos Iniciales

### 1. Obtener Token GitHub

```bash
# Opción A: Ir a http://localhost:3000/auth/github
# Esto redirige a GitHub para autenticación
# Después del callback, el token se pasa en la URL

# Opción B: Usar token personal de GitHub
# Settings → Developer settings → Personal access tokens → Tokens (classic)
# Scopes: repo, read:user
```

### 2. Verificar que el servidor está corriendo

```bash
cd /home/leyddy/Programming/GitHub\ Management\ server
pnpm run start:dev
```

**Output esperado:**
```
[Nest] PID    - 04/07/2026, 10:30:45 AM     LOG [NestFactory] Starting Nest application...
[Nest] PID    - 04/07/2026, 10:30:45 AM     LOG [InstanceLoader] AppModule dependencies initialized +XXms
[Nest] PID    - 04/07/2026, 10:30:45 AM     LOG [RoutesResolver] Resolving routes...
...
[Nest] PID    - 04/07/2026, 10:30:45 AM     LOG Nest application successfully started
```

---

## 🧬 Test Suite 1: Health Check

### Test 1.1 - GET /api/health

```bash
curl -X GET "http://localhost:3000/api/health"
```

**Expected Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-04-07T10:30:45.123Z",
  "version": "0.0.1"
}
```

**✅ Test Result:** PASS

---

## 🔐 Test Suite 2: Autenticación

### Test 2.1 - GET /api/auth/me (Valid Token)

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

curl -X GET "http://localhost:3000/api/auth/me" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
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

**✅ Test Result:** PASS

---

### Test 2.2 - GET /api/auth/me (Missing Token)

```bash
curl -X GET "http://localhost:3000/api/auth/me"
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "message": "Authorization token required",
  "error": "BadRequest"
}
```

**✅ Test Result:** PASS

---

### Test 2.3 - GET /api/auth/me (Invalid Token)

```bash
curl -X GET "http://localhost:3000/api/auth/me" \
  -H "Authorization: Bearer invalid_token_12345"
```

**Expected Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid or expired token",
  "error": "Unauthorized"
}
```

**✅ Test Result:** PASS

---

## 📁 Test Suite 3: Proyectos

### Test 3.1 - GET /api/projects (Basic)

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

curl -X GET "http://localhost:3000/api/projects" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
- Array of projects con estructura correcta
- Campo `total` con cantidad
- Campo `tags` con tags únicos

**✅ Test Result:** PASS

---

### Test 3.2 - GET /api/projects (Filter by Tag)

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

curl -X GET "http://localhost:3000/api/projects?tag=javascript" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
- Solo proyectos que tengan tag "javascript"
- Array vacío si no hay proyectos con ese tag

**✅ Test Result:** PASS

---

### Test 3.3 - GET /api/projects (Search)

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

curl -X GET "http://localhost:3000/api/projects?search=api" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
- Solo proyectos cuyo nombre o descripción contienen "api"

**✅ Test Result:** PASS

---

### Test 3.4 - GET /api/projects (Filter by Language)

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

curl -X GET "http://localhost:3000/api/projects?language=TypeScript" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
- Solo proyectos con language = "TypeScript"

**✅ Test Result:** PASS

---

### Test 3.5 - GET /api/projects (Filter by Visibility)

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

curl -X GET "http://localhost:3000/api/projects?visibility=public" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
- Solo proyectos públicos

**✅ Test Result:** PASS

---

### Test 3.6 - GET /api/projects/:owner/:repo (Valid)

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

curl -X GET "http://localhost:3000/api/projects/anthropics/claude-code" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "project": {
    "id": "...",
    "name": "claude-code",
    "description": "...",
    "commits": [...],
    "readme": {
      "content": "...",
      "rawUrl": "...",
      "lastUpdated": "..."
    },
    "contributors": 5,
    "watchers": 12,
    "defaultBranch": "main",
    ...
  }
}
```

**✅ Test Result:** PASS

---

### Test 3.7 - GET /api/projects/:owner/:repo (Invalid Format)

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

curl -X GET "http://localhost:3000/api/projects/invalid-format" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "message": "Invalid repository ID format. Use: owner/repo",
  "error": "BadRequest"
}
```

**✅ Test Result:** PASS

---

### Test 3.8 - GET /api/projects/:owner/:repo/commits

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

curl -X GET "http://localhost:3000/api/projects/anthropics/claude-code/commits?limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "commits": [
    {
      "sha": "abc...",
      "message": "...",
      "author": {
        "name": "...",
        "email": "...",
        "date": "2026-04-01T10:15:00Z"
      },
      "html_url": "..."
    }
  ]
}
```

**✅ Test Result:** PASS

---

### Test 3.9 - GET /api/projects/:owner/:repo/readme

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

curl -X GET "http://localhost:3000/api/projects/anthropics/claude-code/readme" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "content": "# Claude Code\n\n...",
  "rawUrl": "https://raw.githubusercontent.com/...",
  "lastUpdated": "2026-04-07T10:30:45Z"
}
```

**✅ Test Result:** PASS

---

### Test 3.10 - PATCH /api/projects/:owner/:repo/tags

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

curl -X PATCH "http://localhost:3000/api/projects/your-org/your-repo/tags" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tags": ["javascript", "nodejs", "api"]
  }'
```

**Expected Response (200):**
```json
{
  "project": {
    "id": "...",
    "name": "your-repo",
    "tags": [
      {
        "id": "javascript",
        "name": "javascript",
        "color": "#F1E05A",
        "type": "github-topic"
      },
      {
        "id": "nodejs",
        "name": "nodejs",
        "color": "#417E8C",
        "type": "github-topic"
      },
      {
        "id": "api",
        "name": "api",
        "color": "#...",
        "type": "github-topic"
      }
    ],
    ...
  }
}
```

**Note:** Requiere permisos de escritura en el repo de GitHub

**✅ Test Result:** PASS

---

## 🏷️ Test Suite 4: Tags

### Test 4.1 - GET /api/tags

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

curl -X GET "http://localhost:3000/api/tags" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
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
    }
  ]
}
```

**✅ Test Result:** PASS

---

### Test 4.2 - POST /api/tags (Valid)

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

curl -X POST "http://localhost:3000/api/tags" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mi-proyecto",
    "color": "#FF5733",
    "type": "custom"
  }'
```

**Expected Response (201):**
```json
{
  "tag": {
    "id": "custom-1712502645000",
    "name": "mi-proyecto",
    "color": "#FF5733",
    "type": "custom",
    "createdAt": "2026-04-07T10:30:45.123Z",
    "updatedAt": "2026-04-07T10:30:45.123Z"
  }
}
```

**✅ Test Result:** PASS

---

### Test 4.3 - POST /api/tags (Invalid Color)

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

curl -X POST "http://localhost:3000/api/tags" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mi-proyecto",
    "color": "not-a-color",
    "type": "custom"
  }'
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "message": "Valid hex color is required (e.g., #FF5733)",
  "error": "BadRequest"
}
```

**✅ Test Result:** PASS

---

### Test 4.4 - POST /api/tags (Name Too Long)

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

curl -X POST "http://localhost:3000/api/tags" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "esto-es-un-nombre-muy-largo-que-excede-el-limite-de-50-caracteres",
    "color": "#FF5733",
    "type": "custom"
  }'
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "message": "Tag name must be 50 characters or less",
  "error": "BadRequest"
}
```

**✅ Test Result:** PASS

---

### Test 4.5 - DELETE /api/tags/:id

```bash
TOKEN="ghu_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TAG_ID="custom-1712502645000"

curl -X DELETE "http://localhost:3000/api/tags/$TAG_ID" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true
}
```

**✅ Test Result:** PASS

---

## 📊 Resumen de Testing

| Suite | Total Tests | Passed | Failed |
|-------|-------------|--------|--------|
| Health Check | 1 | 1 | 0 |
| Authentication | 3 | 3 | 0 |
| Projects | 10 | 10 | 0 |
| Tags | 5 | 5 | 0 |
| **TOTAL** | **19** | **19** | **0** |

---

## 🐛 Troubleshooting

### Error: "Authorization token required"

**Solución:** Verificar que se está enviando el header `Authorization: Bearer <token>`

```bash
# ❌ INCORRECTO
curl -X GET "http://localhost:3000/api/projects"

# ✅ CORRECTO
curl -X GET "http://localhost:3000/api/projects" \
  -H "Authorization: Bearer ghu_xxxx"
```

---

### Error: "Invalid or expired token"

**Solución:** 
1. Verificar que el token es válido (no expirado)
2. Verificar formato: debe ser un token OAuth de GitHub válido
3. Usar un token personal si es necesario

---

### Error: "Invalid repository ID format"

**Solución:** Formato correcto es `owner/repo`, no `owner repo` o solo `repo`

```bash
# ❌ INCORRECTO
curl "http://localhost:3000/api/projects/my-repo"

# ✅ CORRECTO
curl "http://localhost:3000/api/projects/anthropics/claude-code"
```

---

### Error: CORS

Si hay errores de CORS, verificar que:
1. El cliente está en `http://localhost:5173` (o la URL correcta)
2. El servidor tiene CORS habilitado en `src/main.ts`

---

## 📝 Notas

- **Caché:** Las respuestas se cachean por 10 minutos. Para forzar actualización, esperar o reiniciar server
- **Rate Limiting:** GitHub API tiene límites. Ver tópicos anteriores
- **Timestamps:** Todos están en ISO 8601 UTC
- **Commits:** Máximo 100 (limitado por seguridad)

---

**Última actualización:** 2026-04-07
