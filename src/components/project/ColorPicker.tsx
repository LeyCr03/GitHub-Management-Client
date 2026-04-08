import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { TAG_COLOR_PALETTE } from '@/constants/color-palette'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  showPresets?: boolean
  label?: string
}

/**
 * Componente Color Picker avanzado
 * Permite seleccionar color con selector nativo, input hex y presets
 */
export const ColorPicker = ({
  value,
  onChange,
  showPresets = true,
  label = 'Color'
}: ColorPickerProps) => {
  const [showCustom, setShowCustom] = useState(false)

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>

      {/* Color Preview y Input */}
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded cursor-pointer border border-border"
          title="Selector de color nativo"
          aria-label="Selector de color nativo"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#0052CC"
          className="flex-1 font-mono"
          title="Ingresa código hex (ej: #0052CC)"
          aria-label="Código de color en formato hex"
        />
      </div>

      {/* Presets */}
      {showPresets && TAG_COLOR_PALETTE.custom && TAG_COLOR_PALETTE.custom.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setShowCustom(!showCustom)}
            className="text-xs text-primary hover:underline"
            type="button"
          >
            {showCustom ? '← Ocultar' : 'Ver'} presets
          </button>

          {showCustom && (
            <div className="grid grid-cols-6 gap-2">
              {TAG_COLOR_PALETTE.custom.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color)
                    setShowCustom(false)
                  }}
                  className={`h-8 rounded border-2 transition-all hover:scale-110 ${
                    value === color ? 'border-foreground' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                  aria-label={`Seleccionar color ${color}`}
                  type="button"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
