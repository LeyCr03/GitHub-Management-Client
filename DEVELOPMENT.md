# GitHub Dashboard - Guía de Desarrollo

## Setup

1. Clonar repositorio
2. Instalar dependencias: `pnpm install`
3. Crear `.env.local` desde `.env.example`
4. Ejecutar: `pnpm dev`

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── layout/         # Componentes de layout
│   ├── dashboard/      # Componentes del dashboard
│   ├── project/        # Componentes de proyectos
│   ├── ui/            # Componentes UI reutilizables
│   └── ErrorBoundary.tsx
├── hooks/              # Custom hooks
├── types/              # Definiciones TypeScript
├── lib/               # Utilidades y helpers
│   ├── api.ts         # Cliente API
│   ├── toast.ts       # Notificaciones
│   └── ...
├── stores/            # Estado global (Zustand)
├── pages/             # Páginas/vistas principales
├── App.tsx            # Componente raíz
└── main.tsx           # Punto de entrada
```

## Flujo de Datos

```
API Server → axios instance → hooks (SWR) → components
                                    ↓
                             React state/Context
```

## Convenciones

- **Components**: PascalCase (`ProjectCard.tsx`)
- **Hooks**: `useXxx` (`useGithubProjects.ts`)
- **Files**: camelCase o PascalCase (components)
- **Types**: PascalCase con interfaz (`interface ProjectCardProps`)

## Scripts Disponibles

```bash
# Desarrollo
pnpm dev                # Ejecutar servidor de desarrollo
pnpm build             # Compilar para producción
pnpm lint              # Validar código con ESLint
pnpm preview           # Vista previa de build

# Instalar dependencias
pnpm add <package>     # Instalar paquete
pnpm add -D <package>  # Instalar como dev dependency
```

## Herramientas y Librerías

- **React 19**: Framework principal
- **TypeScript**: Tipado estático
- **Tailwind CSS 4**: Estilos
- **Vite**: Build tool
- **SWR**: Data fetching
- **Zustand**: State management
- **Axios**: HTTP client
- **Sonner**: Toast notifications
- **Lucide React**: Iconos
- **Radix UI**: Componentes primitivos

## Patrón de Componentes

### Componente Funcional Típico

```typescript
interface MyComponentProps {
  title: string
  onAction?: (data: string) => void
}

export const MyComponent = ({ title, onAction }: MyComponentProps) => {
  const [state, setState] = useState<string>('')

  const handleClick = () => {
    onAction?.(state)
  }

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  )
}
```

## Patrón de Hooks

### Custom Hook Típico

```typescript
interface UseMyHookReturn {
  data: Data | null
  isLoading: boolean
  error: string | null
}

export const useMyHook = (): UseMyHookReturn => {
  const [data, setData] = useState<Data | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.getData()
      setData(response)
    } catch (err) {
      setError('Error al cargar datos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, isLoading, error }
}
```

## Notificaciones (Toast)

Usar la librería `sonner` para mostrar notificaciones:

```typescript
import { showSuccess, showError, showLoading, updateToast } from '@/lib/toast'

// Éxito
showSuccess('Guardado correctamente')

// Error
showError('Error al guardar')

// Con carga
const toastId = showLoading('Guardando...')
// ... hacer algo ...
updateToast(toastId, 'Guardado correctamente', 'success')
```

## Error Handling

La aplicación incluye un `ErrorBoundary` que captura errores no manejados. Los errores de la API se manejan en los hooks y se muestran como toasts.

## Estilos CSS

- Usar Tailwind CSS clases
- Colores definidos en variables CSS en `index.css`
- Animaciones personalizadas disponibles: `animate-fade-in`, `animate-slide-up`
- Clase `.prose` para contenido markdown

## Testing

```bash
pnpm test           # Ejecutar tests
pnpm test:watch    # Modo watch
```

## Build y Deploy

Ver guía en `DEPLOYMENT.md` (futuro)

## Debugging

- Usar DevTools de React
- Console logging con `console.log`, `console.error`
- Verificar red en DevTools → Network
- Validar tipos con `tsc --noEmit`

## Próximos Pasos

- Tests unitarios con Vitest
- E2E tests con Cypress
- Performance optimization
- PWA features
- Internacionalización (i18n)
