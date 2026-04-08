/**
 * Hook para validación de tags
 * Proporciona validaciones para nombre, color y cantidad de tags
 */
export const useTagValidation = () => {
  /**
   * Valida el nombre del tag
   * @param name - Nombre del tag a validar
   * @returns Objeto con estado de validación y mensaje de error opcional
   */
  const validateTagName = (name: string): { valid: boolean; error?: string } => {
    if (!name.trim()) {
      return { valid: false, error: 'El nombre del tag no puede estar vacío' }
    }

    if (name.length > 50) {
      return { valid: false, error: 'El nombre debe tener máximo 50 caracteres' }
    }

    if (name.length < 2) {
      return { valid: false, error: 'El nombre debe tener al menos 2 caracteres' }
    }

    // Permitir letras, números, guiones y espacios
    if (!/^[a-zA-Z0-9\s\-]+$/.test(name)) {
      return { valid: false, error: 'Solo se permiten letras, números, guiones y espacios' }
    }

    return { valid: true }
  }

  /**
   * Valida un código de color hex
   * @param color - Código de color en formato hex (ej: #FF5733)
   * @returns Objeto con estado de validación y mensaje de error opcional
   */
  const validateColor = (color: string): { valid: boolean; error?: string } => {
    const hexRegex = /^#[0-9A-F]{6}$/i
    if (!hexRegex.test(color)) {
      return { valid: false, error: 'El color debe ser un código hex válido (ej: #FF5733)' }
    }
    return { valid: true }
  }

  /**
   * Valida la cantidad de tags
   * @param count - Cantidad de tags actual
   * @param max - Máximo permitido (default: 10)
   * @returns Objeto con estado de validación y mensaje de error opcional
   */
  const validateTagsCount = (count: number, max: number = 10): { valid: boolean; error?: string } => {
    if (count > max) {
      return { valid: false, error: `Máximo ${max} tags por proyecto` }
    }
    return { valid: true }
  }

  return {
    validateTagName,
    validateColor,
    validateTagsCount,
  }
}
