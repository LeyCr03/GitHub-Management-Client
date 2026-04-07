# Issue 1: Setup Inicial y Dependencias

## Objetivo
Configurar el proyecto base con todas las dependencias necesarias y estructura fundamental.

## Tareas

### 1. Verificar y actualizar package.json
**Ubicación:** `package.json`

**Dependencias a instalar:**
```bash
pnpm add zustand swr axios markdown-to-jsx react-window classnames clsx
pnpm add -D @types/react-window
```

**Package.json debe contener:**
```json
{
  "dependencies": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "zustand": "^4.4.x",
    "swr": "^2.2.x",
    "axios": "^1.6.x",
    "markdown-to-jsx": "^7.x",
    "react-window": "^1.8.x",
    "classnames": "^2.3.x",
    "clsx": "^2.x",
    "lucide-react": "^0.x"
  }
}
```

### 2. Crear estructura de carpetas
```bash
mkdir -p src/{components,hooks,types,lib,stores,pages,constants}
mkdir -p src/components/{layout,dashboard,project,ui}
```

**Estructura final esperada:**
```
src/
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── project/
│   └── ui/
├── hooks/
├── types/
├── lib/
├── stores/
├── pages/
├── constants/
├── App.tsx
├── index.css
└── main.tsx
```

### 3. Configurar variables de entorno
**Crear archivo:** `.env.example`
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GITHUB_BASE_URL=https://api.github.com
```

**Crear archivo:** `.env.local` (no commitear)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GITHUB_BASE_URL=https://api.github.com
```

### 4. Verificar configuración de TypeScript
**Archivo:** `tsconfig.app.json`
- Debe tener `strict: true`
- Debe incluir `jsx: "react-jsx"`
- Verificar que `paths` esté configurado si lo necesitas

### 5. Instalar dependencias
```bash
pnpm install
```

## Criterios de Aceptación
- ✅ Todas las dependencias instaladas sin errores
- ✅ Estructura de carpetas creada
- ✅ `.env.example` y `.env.local` creados
- ✅ `pnpm dev` ejecuta sin errores
- ✅ TypeScript compila correctamente

## Referencias
- [Guía de Setup Vite + React](https://vitejs.dev/guide/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
