/**
 * Paleta de Colores - Light & Dark Mode
 * Diseño profesional en tonos azul
 */

export const COLOR_PALETTE = {
  // LIGHT MODE - Tonos claros y neutrales
  light: {
    // Primarios
    primary: '#0052CC',        // Azul principal (profesional)
    primaryLight: '#0066FF',   // Azul más brillante
    primaryDark: '#003399',    // Azul más oscuro

    // Secundarios
    secondary: '#0078D4',      // Azul secundario (Microsoft)
    secondaryLight: '#107C10', // Verde azulado suave

    // Backgrounds
    background: '#FFFFFF',     // Blanco puro
    backgroundAlt: '#F8F9FC',  // Azul muy claro
    backgroundDark: '#F0F2F7', // Gris azulado muy claro

    // Cards & Surfaces
    surface: '#FFFFFF',        // Blanco
    surfaceHover: '#F5F7FA',   // Gris azulado claro
    surfaceActive: '#EEF2F9',  // Azul muy claro

    // Foreground
    foreground: '#0D1B2A',     // Casi negro (muy oscuro)
    foregroundMuted: '#404854', // Gris medio
    foregroundLight: '#7A869D', // Gris suave

    // Accents & UI
    accent: '#0052CC',         // Azul (mismo que primary)
    accentHover: '#0043A8',    // Azul más oscuro
    border: '#D1D5DB',         // Gris claro
    borderLight: '#E5E7EB',    // Gris más claro
    divider: '#F3F4F6',        // Gris muy claro

    // States
    success: '#0E7C27',        // Verde profesional
    warning: '#CD7C2D',        // Naranja/marrón
    error: '#C80F0F',          // Rojo
    info: '#0052CC',           // Azul (mismo que primary)
  },

  // DARK MODE - Tonos oscuros con azul saturado
  dark: {
    // Primarios
    primary: '#3B82F6',        // Azul brillante
    primaryLight: '#60A5FA',   // Azul más claro
    primaryDark: '#1E40AF',    // Azul muy oscuro

    // Secundarios
    secondary: '#0EA5E9',      // Cian/Azul cielo
    secondaryLight: '#06B6D4', // Cian más claro

    // Backgrounds
    background: '#0F172A',     // Casi negro (azul muy oscuro)
    backgroundAlt: '#1E293B',  // Gris azulado oscuro
    backgroundDark: '#0F172A', // Más oscuro aún

    // Cards & Surfaces
    surface: '#1E293B',        // Gris azulado oscuro
    surfaceHover: '#334155',   // Gris azulado más claro
    surfaceActive: '#475569',  // Gris azulado más aún

    // Foreground
    foreground: '#F1F5F9',     // Blanco grisáceo
    foregroundMuted: '#CBD5E1', // Gris claro
    foregroundLight: '#94A3B8', // Gris más oscuro (muted)

    // Accents & UI
    accent: '#3B82F6',         // Azul (mismo que primary)
    accentHover: '#60A5FA',    // Azul más claro
    border: '#334155',         // Gris azulado
    borderLight: '#475569',    // Gris azulado más claro
    divider: '#1E293B',        // Muy oscuro

    // States
    success: '#10B981',        // Verde
    warning: '#F59E0B',        // Naranja/Ámbar
    error: '#EF4444',          // Rojo
    info: '#3B82F6',           // Azul (mismo que primary)
  },
}

/**
 * Paleta de colores para Tags
 * Tonos azul profesionales y variados
 */
export const TAG_COLOR_PALETTE = {
  // Predefinidos para cada tipo
  presets: {
    finished: '#10B981',      // Verde
    'side-project': '#0052CC', // Azul principal
    'pet-project': '#8B5CF6',  // Púrpura
    learning: '#06B6D4',       // Cian
    archived: '#6B7280',       // Gris
  },

  // Opciones adicionales en tonos azul
  custom: [
    // Azules
    '#0052CC', // Azul profesional
    '#0078D4', // Azul Microsoft
    '#3B82F6', // Azul brillante
    '#0EA5E9', // Cian
    '#0891B2', // Cian más oscuro
    '#06B6D4', // Cian claro
    '#00B4D8', // Cian cielo

    // Complementarios (verdes, púrpuras)
    '#10B981', // Verde
    '#059669', // Verde oscuro
    '#8B5CF6', // Púrpura
    '#7C3AED', // Púrpura más oscuro
    '#6366F1', // Índigo

    // Warm tones (naranja, rojo)
    '#F59E0B', // Ámbar
    '#F97316', // Naranja
    '#EF4444', // Rojo
    '#DC2626', // Rojo oscuro
  ],
}

/**
 * Mapeo de colores por tema
 * Uso: THEME_COLORS[isDark ? 'dark' : 'light']
 */
export const THEME_COLORS = {
  light: COLOR_PALETTE.light,
  dark: COLOR_PALETTE.dark,
}

/**
 * Tokens de color para componentes
 * Abstraen el concepto de light/dark
 */
export const COLOR_TOKENS = {
  // Contenedores principales
  container: 'var(--background)',
  containerAlt: 'var(--background-primary)',

  // Cartas y superficies
  card: 'var(--card)',
  cardHover: 'var(--surface-hover)',
  cardActive: 'var(--surface-active)',

  // Texto
  text: 'var(--foreground)',
  textMuted: 'var(--muted-foreground)',
  textLight: 'var(--foreground-light)',

  // Acentos
  accent: 'var(--accent)',
  accentForeground: 'var(--accent-foreground)',

  // Bordes
  border: 'var(--border)',
  borderLight: 'var(--border-light)',

  // Estados
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
}

/**
 * Tipografía de colores
 * Para mantener consistencia en toda la app
 */
export const TEXT_COLORS = {
  primary: 'text-foreground',          // Texto principal
  secondary: 'text-muted-foreground',  // Texto secundario
  muted: 'text-foreground/50',         // Texto deshabilitado

  // Estados
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-amber-600 dark:text-amber-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
}

/**
 * Colores de fondo para badges y pills
 */
export const BG_COLORS = {
  subtle: 'bg-blue-50 dark:bg-blue-950',
  default: 'bg-blue-100 dark:bg-blue-900',
  strong: 'bg-blue-200 dark:bg-blue-800',

  // Variantes por estado
  success: 'bg-green-50 dark:bg-green-950',
  warning: 'bg-amber-50 dark:bg-amber-950',
  error: 'bg-red-50 dark:bg-red-950',
  info: 'bg-blue-50 dark:bg-blue-950',
}

export default COLOR_PALETTE
