/**
 * Constantes de colores para Tags
 * Paleta profesional en tonos azul
 */

export const DEFAULT_TAG_COLORS: Record<string, string> = {
  finished: '#10B981',      // Verde
  'side-project': '#0052CC', // Azul profesional
  'pet-project': '#8B5CF6',  // Púrpura
  learning: '#06B6D4',       // Cian
  archived: '#6B7280',       // Gris
}

/**
 * Presets de colores para crear tags personalizados
 * Paleta moderna en tonos azul profesionales
 */
export const TAG_COLOR_PRESETS = [
  // Tonos Azul (Primarios)
  '#0052CC', // Azul profesional
  '#0078D4', // Azul Microsoft
  '#3B82F6', // Azul brillante
  '#0EA5E9', // Cian
  '#0891B2', // Cian oscuro
  '#06B6D4', // Cian claro
  '#00B4D8', // Cian cielo

  // Complementarios - Verde
  '#10B981', // Verde
  '#059669', // Verde oscuro

  // Complementarios - Púrpura
  '#8B5CF6', // Púrpura
  '#7C3AED', // Púrpura oscuro
  '#6366F1', // Índigo

  // Tonos cálidos - Naranja/Rojo
  '#F59E0B', // Ámbar
  '#F97316', // Naranja
  '#EF4444', // Rojo
  '#DC2626', // Rojo oscuro

  // Neutrales
  '#6B7280', // Gris
  '#4B5563', // Gris azulado
]

/**
 * Colores por categoría
 * Para una organización visual mejor
 */
export const TAG_COLORS_BY_CATEGORY = {
  blues: [
    { color: '#0052CC', label: 'Azul Profesional', hex: '#0052CC' },
    { color: '#0078D4', label: 'Azul Microsoft', hex: '#0078D4' },
    { color: '#3B82F6', label: 'Azul Brillante', hex: '#3B82F6' },
    { color: '#0EA5E9', label: 'Cian', hex: '#0EA5E9' },
    { color: '#06B6D4', label: 'Cian Claro', hex: '#06B6D4' },
  ],
  greens: [
    { color: '#10B981', label: 'Verde', hex: '#10B981' },
    { color: '#059669', label: 'Verde Oscuro', hex: '#059669' },
  ],
  purples: [
    { color: '#8B5CF6', label: 'Púrpura', hex: '#8B5CF6' },
    { color: '#7C3AED', label: 'Púrpura Oscuro', hex: '#7C3AED' },
    { color: '#6366F1', label: 'Índigo', hex: '#6366F1' },
  ],
  warm: [
    { color: '#F59E0B', label: 'Ámbar', hex: '#F59E0B' },
    { color: '#F97316', label: 'Naranja', hex: '#F97316' },
    { color: '#EF4444', label: 'Rojo', hex: '#EF4444' },
    { color: '#DC2626', label: 'Rojo Oscuro', hex: '#DC2626' },
  ],
  neutral: [
    { color: '#6B7280', label: 'Gris', hex: '#6B7280' },
    { color: '#4B5563', label: 'Gris Azulado', hex: '#4B5563' },
  ],
}
