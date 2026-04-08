# 🚀 GitHub Management Server - Documento para Entregar al Cliente

**Preparado:** 2026-04-07  
**Versión:** 0.0.1  
**Estado:** ✅ Listo para Usar

---

## 📦 ¿Qué es esto?

Un **servidor API REST** que conecta tu aplicación React con **GitHub**, permitiendo:

- ✅ Autenticación con GitHub OAuth
- ✅ Obtener lista de repositorios
- ✅ Ver detalles (commits, README, estadísticas)
- ✅ Gestionar etiquetas/tags
- ✅ Todo cacheado y optimizado

---

## 🎯 Lo que necesitas hacer

### 1. **Paso 1: Configuración (5 minutos)**

En tu proyecto React, crear archivo `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 2. **Paso 2: Leer la guía (60 minutos)**

📖 **Lee este archivo:**
```
CLIENTE_INTEGRACION.md
```

Contiene TODO lo que necesitas:
- Configuración inicial
- Cómo autenticarse
- Todos los endpoints disponibles
- Tipos TypeScript listos
- Ejemplos de servicios
- Ejemplos de componentes
- Manejo de errores

### 3. **Paso 3: Implementar (2-4 horas)**

Copia y adapta los ejemplos del archivo anterior a tu proyecto.

---

## 📚 Documentos Incluidos

| Archivo | Para Quién | Tiempo |
|---------|-----------|--------|
| **CLIENTE_INTEGRACION.md** | 👨‍💻 Frontend | 60 min |
| **API_ENDPOINTS.md** | 👨‍💻 Backend / QA | 30 min |
| **TESTING_GUIDE.md** | 🧪 QA | 45 min |
| **README_COMPLETO.md** | 📚 Índice general | 15 min |
| **IMPLEMENTACION_COMPLETADA.md** | 📊 Gerentes | 15 min |

---

## 🔌 URLs Base

### Desarrollo (Local)
```
API:    http://localhost:3000
Cliente: http://localhost:5173
```

### Endpoints Principales

```
GET    /api/projects                  # Obtener lista de proyectos
GET    /api/projects/:owner/:repo     # Detalles de un proyecto
GET    /api/projects/:owner/:repo/commits    # Commits recientes
GET    /api/projects/:owner/:repo/readme     # Contenido README
GET    /api/tags                      # Obtener tags disponibles
GET    /api/auth/me                   # Info del usuario actual
```

**Autenticación:** Todo request necesita header:
```
Authorization: Bearer <github_token>
```

---

## 🔐 Cómo Autenticarse

### Paso 1: Usuario hace click en "Login"
```
→ Cliente llama: GET /auth/github
```

### Paso 2: Redirige a GitHub
```
→ Usuario se autentica en GitHub
```

### Paso 3: Callback a tu app
```
→ URL se convierte en: http://localhost:5173?token=ghu_xxxx&username=john
```

### Paso 4: Guardar token
```typescript
const token = new URLSearchParams(window.location.search).get('token');
localStorage.setItem('auth_token', token);
```

### Paso 5: Usar en requests
```typescript
const response = await fetch('http://localhost:3000/api/projects', {
  headers: { Authorization: `Bearer ${token}` }
});
```

---

## 📊 Ejemplo de Respuesta

### GET /api/projects
```json
{
  "projects": [
    {
      "id": "MDEwOlJlcG9zaXRvcnk1MjA3NzA1Mg==",
      "repositoryId": 123456,
      "name": "my-awesome-project",
      "description": "A cool project",
      "url": "https://github.com/user/my-awesome-project",
      "tags": [
        {
          "id": "javascript",
          "name": "javascript",
          "color": "#F1E05A",
          "type": "github-topic"
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
  "tags": [...]
}
```

---

## ⚡ Características

✅ **Implementado:**
- Autenticación OAuth 2.0
- Lista de proyectos con filtros
- Detalles completos (commits, README)
- Tags/Topics
- Caché automático
- Validación de inputs
- Error handling

⚠️ **Limitaciones:**
- Tags personalizados se guardan en `localStorage` (cliente)
- Sin BD persistente (GitHub es source of truth)
- Rate limit de GitHub: 5000 points/hora

---

## 🚀 Para Empezar Rápido

```bash
# 1. Asegúrate que el servidor está corriendo
pnpm run start:dev

# 2. Abre http://localhost:3000/api/health
# Debe retornar: { status: "ok", ... }

# 3. En tu cliente React, copia CLIENTE_INTEGRACION.md
# y sigue los pasos
```

---

## 🐛 Errores Comunes

**Error:** "401 Unauthorized"
```
→ Token inválido o expirado
Solución: Hacer login de nuevo
```

**Error:** "Invalid repository ID format"
```
→ URL debe ser /api/projects/owner/repo
Incorrecto: /api/projects/my-repo
```

**Error:** CORS bloqueado
```
→ El navegador bloquea requests
Solución: El servidor debe estar en http://localhost:3000
```

---

## 💻 Ejemplo Mínimo (Copy-Paste Ready)

### React Component

```typescript
import { useEffect, useState } from 'react';

export function MyProjects() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    fetch('http://localhost:3000/api/projects', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setProjects(d.projects));
  }, [token]);

  return (
    <div>
      <h1>Mis Proyectos</h1>
      <ul>
        {projects.map(p => (
          <li key={p.id}>
            <h2>{p.name}</h2>
            <p>{p.description}</p>
            <a href={p.url}>Ver en GitHub</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🔗 Documentación Detallada

Para más información, ver:

- **CLIENTE_INTEGRACION.md** - Guía completa para frontend
- **API_ENDPOINTS.md** - Referencia técnica de endpoints
- **TESTING_GUIDE.md** - Cómo probar los endpoints
- **README_COMPLETO.md** - Índice de toda la documentación

---

## ✅ Checklist de Implementación

- [ ] Leer CLIENTE_INTEGRACION.md
- [ ] Crear .env.local con VITE_API_BASE_URL
- [ ] Crear AuthService
- [ ] Crear ProjectsService
- [ ] Crear hooks con SWR
- [ ] Crear componentes React
- [ ] Probar login
- [ ] Probar carga de proyectos
- [ ] Probar filtros

---

## 📞 Preguntas

**P: ¿Cómo actualizo a BD si escala?**
A: La arquitectura es compatible. Agregar DB sin cambios en endpoints.

**P: ¿Qué pasa si GitHub API está down?**
A: Datos cacheados (10 min) se mantienen disponibles.

**P: ¿Puedo desplegar a producción?**
A: Sí, cambiar URLs a tu dominio y configurar HTTPS.

---

## 🎯 Próximo Paso

👉 **Lee:** `CLIENTE_INTEGRACION.md`

Tiene todo lo que necesitas para implementar en tu proyecto React.

---

**Versión:** 0.0.1  
**Última actualización:** 2026-04-07  
**Estado:** ✅ Listo para usar

**¿Preguntas?** Revisa los documentos incluidos o contacta al equipo de desarrollo.
