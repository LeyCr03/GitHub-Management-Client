# 🎨 Ejemplos de Uso de la Paleta de Colores

Ejemplos prácticos para usar la paleta de colores en componentes React.

---

## 1. Componentes de Botones

### Botón Primario

```tsx
// src/components/ui/button.tsx
export const Button = ({ children, variant = 'primary', ...props }) => {
  const styles = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-secondary hover:bg-secondary-light text-white',
    ghost: 'bg-transparent text-primary hover:bg-surface-hover',
    destructive: 'bg-error hover:bg-red-700 text-white',
  }

  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition ${styles[variant]}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

### Uso en componentes

```tsx
// Dashboard.tsx
<Button variant="primary">Crear Proyecto</Button>
<Button variant="secondary">Editar</Button>
<Button variant="ghost">Cancelar</Button>
<Button variant="destructive">Eliminar</Button>
```

---

## 2. Cards

### Card Base

```tsx
// src/components/ui/card.tsx
export const Card = ({ children, highlighted = false }) => {
  return (
    <div
      className={`
        rounded-lg border p-4 transition
        ${
          highlighted
            ? 'bg-surface-active border-primary shadow-sm'
            : 'bg-surface border-border hover:border-primary hover:bg-surface-hover'
        }
      `}
    >
      {children}
    </div>
  )
}
```

### Project Card con paleta

```tsx
// src/components/dashboard/ProjectCard.tsx
interface ProjectCardProps {
  project: Project
  selected?: boolean
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  selected = false,
}) => {
  return (
    <Card highlighted={selected}>
      {/* Header con colores del proyecto */}
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-foreground font-semibold">{project.name}</h3>
        <span className="text-foreground-light text-sm">
          {project.stats.stars} ⭐
        </span>
      </div>

      {/* Descripción */}
      <p className="text-foreground-muted text-sm mb-3">
        {project.description}
      </p>

      {/* Tags con colores personalizados */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag.id}
            style={{
              backgroundColor: tag.color + '20', // 20% opacity
              color: tag.color,
              border: `1px solid ${tag.color}`,
            }}
            className="px-2 py-1 rounded text-xs font-medium"
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-3 pt-3 border-t border-border flex gap-4 text-xs text-foreground-light">
        <span>Forks: {project.stats.forks}</span>
        <span>Issues: {project.stats.openIssues}</span>
        {project.stats.language && <span>{project.stats.language}</span>}
      </div>
    </Card>
  )
}
```

---

## 3. Alertas y Notificaciones

### Alert Component

```tsx
// src/components/ui/alert.tsx
type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  type: AlertType
  title: string
  message: string
  onClose?: () => void
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
}) => {
  const styles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-950',
      border: 'border-success',
      title: 'text-success',
      icon: '✓',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-950',
      border: 'border-error',
      title: 'text-error',
      icon: '✕',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950',
      border: 'border-warning',
      title: 'text-warning',
      icon: '⚠',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950',
      border: 'border-info',
      title: 'text-info',
      icon: 'ℹ',
    },
  }

  const style = styles[type]

  return (
    <div className={`${style.bg} border-l-4 ${style.border} p-4 rounded`}>
      <div className="flex items-start gap-3">
        <span className={`text-xl ${style.title}`}>{style.icon}</span>
        <div className="flex-1">
          <h3 className={`font-semibold ${style.title}`}>{title}</h3>
          <p className="text-foreground-muted text-sm mt-1">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-foreground-light hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
```

### Uso

```tsx
// En componentes
<Alert
  type="success"
  title="Proyecto creado"
  message="El proyecto ha sido añadido exitosamente"
/>

<Alert
  type="error"
  title="Error"
  message="No se pudo crear el tag"
/>
```

---

## 4. Formularios

### Input Component

```tsx
// src/components/ui/input.tsx
interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-foreground font-medium mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 rounded-md border transition
          bg-input text-foreground placeholder-foreground-light
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${error ? 'border-error focus:ring-red-500' : 'border-border focus:border-primary focus:ring-primary'}
          disabled:bg-background-dark disabled:text-foreground-light disabled:cursor-not-allowed
        `}
        {...props}
      />
      {error && <p className="text-error text-sm mt-1">{error}</p>}
      {helperText && (
        <p className="text-foreground-light text-sm mt-1">{helperText}</p>
      )}
    </div>
  )
}
```

### Form con inputs

```tsx
// src/components/dialogs/CreateTagDialog.tsx
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TAG_COLOR_PRESETS } from '@/constants/tag-colors'

export const CreateTagDialog = ({ onClose, onCreate }: Props) => {
  const [name, setName] = useState('')
  const [color, setColor] = useState(TAG_COLOR_PRESETS[0])
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('El nombre del tag es requerido')
      return
    }
    await onCreate(name, color)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre del tag"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error}
        placeholder="Ej: Backend"
      />

      <div>
        <label className="block text-foreground font-medium mb-2">
          Color
        </label>
        <div className="grid grid-cols-5 gap-2">
          {TAG_COLOR_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setColor(preset)}
              className={`
                w-full h-10 rounded-md border-2 transition
                ${
                  color === preset
                    ? 'border-foreground'
                    : 'border-border hover:border-foreground-muted'
                }
              `}
              style={{ backgroundColor: preset }}
              title={preset}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          Crear
        </Button>
      </div>
    </form>
  )
}
```

---

## 5. Sidebar

### Sidebar Component

```tsx
// src/components/layout/Sidebar.tsx
interface SidebarLink {
  id: string
  label: string
  icon: React.ReactNode
  active?: boolean
  onClick: () => void
}

interface SidebarProps {
  links: SidebarLink[]
  title?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ links, title }) => {
  return (
    <aside className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      {title && (
        <div className="px-4 py-4 border-b border-sidebar-border">
          <h2 className="text-sidebar-foreground font-semibold">{title}</h2>
        </div>
      )}

      {/* Links */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={link.onClick}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-md transition
              ${
                link.active
                  ? 'bg-sidebar-accent text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-hover'
              }
            `}
          >
            {link.icon}
            <span className="font-medium">{link.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <p className="text-sidebar-foreground text-sm">© 2026</p>
      </div>
    </aside>
  )
}
```

---

## 6. Badges y Pills

### Badge Component

```tsx
// src/components/ui/badge.tsx
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md'
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
}) => {
  const styles = {
    default:
      'bg-blue-100 dark:bg-blue-900 text-primary dark:text-primary-light',
    success:
      'bg-green-100 dark:bg-green-900 text-success dark:text-green-400',
    warning:
      'bg-amber-100 dark:bg-amber-900 text-warning dark:text-amber-400',
    error: 'bg-red-100 dark:bg-red-900 text-error dark:text-red-400',
    info: 'bg-blue-100 dark:bg-blue-900 text-info dark:text-blue-400',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={`
        inline-block rounded-full font-medium
        ${styles[variant]} ${sizes[size]}
      `}
    >
      {children}
    </span>
  )
}
```

### Uso

```tsx
<Badge variant="success">Activo</Badge>
<Badge variant="warning">En progreso</Badge>
<Badge variant="error">Eliminado</Badge>
<Badge variant="info" size="sm">Info</Badge>
```

---

## 7. Tablas

### Table Component

```tsx
// src/components/ui/table.tsx
export const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">{children}</table>
  </div>
)

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-background-dark border-b border-border">
    {children}
  </thead>
)

export const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b border-border hover:bg-surface-hover transition">
    {children}
  </tr>
)

export const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-4 py-3 text-foreground">{children}</td>
)

export const TableHeaderCell = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-left font-semibold text-foreground-muted">
    {children}
  </th>
)
```

### Uso

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHeaderCell>Proyecto</TableHeaderCell>
      <TableHeaderCell>Tags</TableHeaderCell>
      <TableHeaderCell>Stars</TableHeaderCell>
    </TableRow>
  </TableHeader>
  <tbody>
    {projects.map((project) => (
      <TableRow key={project.id}>
        <TableCell>{project.name}</TableCell>
        <TableCell>
          {project.tags.map((tag) => (
            <Badge key={tag.id} variant="default">
              {tag.name}
            </Badge>
          ))}
        </TableCell>
        <TableCell>{project.stats.stars}</TableCell>
      </TableRow>
    ))}
  </tbody>
</Table>
```

---

## 8. Indicadores de Carga

### Skeleton Loader

```tsx
// src/components/ui/skeleton.tsx
export const Skeleton = ({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`bg-surface-hover dark:bg-surface-active animate-pulse rounded-md ${className}`}
    {...props}
  />
)
```

### Spinner

```tsx
// src/components/ui/spinner.tsx
export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`${sizes[size]} animate-spin`}>
      <div
        className={`w-full h-full border-2 border-border border-t-primary rounded-full`}
      />
    </div>
  )
}
```

---

## 9. Texto con Estados

### Text Component

```tsx
// src/components/ui/text.tsx
type TextVariant = 'primary' | 'secondary' | 'muted' | 'success' | 'error'

interface TextProps {
  children: React.ReactNode
  variant?: TextVariant
  size?: 'sm' | 'base' | 'lg' | 'xl'
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'primary',
  size = 'base',
}) => {
  const variants = {
    primary: 'text-foreground',
    secondary: 'text-foreground-muted',
    muted: 'text-foreground-light',
    success: 'text-success',
    error: 'text-error',
  }

  const sizes = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  return <p className={`${variants[variant]} ${sizes[size]}`}>{children}</p>
}
```

---

## 10. Selector de Color

### Color Picker

```tsx
// src/components/ui/color-picker.tsx
import { TAG_COLOR_PALETTE } from '@/constants/color-palette'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  showPresets?: boolean
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  showPresets = true,
}) => {
  return (
    <div className="space-y-3">
      {/* Input custom */}
      <div className="flex gap-2">
        <div
          className="w-10 h-10 rounded-md border-2 border-border cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => {
            // Aquí va un color picker nativo si lo deseas
          }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#0052CC"
          className="flex-1 px-3 py-2 border border-border rounded-md"
        />
      </div>

      {/* Presets */}
      {showPresets && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Presets</p>
          <div className="grid grid-cols-7 gap-2">
            {TAG_COLOR_PALETTE.custom.map((color) => (
              <button
                key={color}
                onClick={() => onChange(color)}
                className={`
                  w-full aspect-square rounded-md border-2 transition
                  ${value === color ? 'border-foreground' : 'border-border'}
                `}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## 11. Modo Oscuro Toggle

### Theme Toggle

```tsx
// src/components/layout/ThemeToggle.tsx
import { Sun, Moon } from 'lucide-react'

export const ThemeToggle = () => {
  const [isDark, setIsDark] = React.useState(
    document.documentElement.classList.contains('dark')
  )

  const toggleTheme = () => {
    const html = document.documentElement
    html.classList.toggle('dark')
    setIsDark(html.classList.contains('dark'))

    // Persist preference
    localStorage.setItem('theme', isDark ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-md transition
        ${isDark ? 'bg-sidebar text-sidebar-foreground' : 'bg-surface text-foreground'}
        hover:bg-surface-hover dark:hover:bg-surface-hover
      `}
      title="Cambiar tema"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
```

### Usar en Header

```tsx
export const Header = () => {
  return (
    <header className="bg-surface dark:bg-surface border-b border-border px-4 py-3 flex justify-between items-center">
      <h1 className="text-foreground font-bold">GitHub Manager</h1>
      <ThemeToggle />
    </header>
  )
}
```

---

## 12. Práctica Completa - Dashboard

### Dashboard Page

```tsx
// src/pages/Dashboard.tsx
import { useGithubProjects } from '@/hooks/useGithubProjects'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

export const Dashboard = () => {
  const { projects, tags, isLoading, isError } = useGithubProjects()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8">
        <Alert type="error" title="Error" message="No se pudieron cargar los proyectos" />
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-surface border-b border-border px-8 py-6">
        <h1 className="text-foreground text-3xl font-bold">
          Mis Proyectos
        </h1>
        <p className="text-foreground-muted mt-2">
          {projects?.length || 0} proyectos encontrados
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Tags Filter */}
        <div className="mb-8 flex gap-2 flex-wrap">
          {tags?.map((tag) => (
            <button
              key={tag.id}
              style={{
                backgroundColor: tag.color + '20',
                color: tag.color,
                border: `1px solid ${tag.color}`,
              }}
              className="px-4 py-2 rounded-full font-medium hover:opacity-80 transition"
            >
              {tag.name}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {projects?.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-foreground-muted">
                No hay proyectos para mostrar
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
```

---

## Resumen de mejores prácticas

✅ Usa siempre variables CSS en lugar de colores hardcodeados  
✅ Respeta el contraste WCAG AA mínimo  
✅ El dark mode se aplica automáticamente con `classList.contains('dark')`  
✅ Los tags usan colores dinámicos del servidor  
✅ Las animaciones usan `transition` de Tailwind  
✅ Los estados (hover, active, disabled) tienen colores consistentes

---

**Última actualización:** 2026-04-07
