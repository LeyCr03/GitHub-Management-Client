/**
 * Encabezado del dashboard
 * Issue 05 - Componentes de Layout
 *
 * Contiene:
 * - Buscador de proyectos
 * - Botones de ajustes/acciones
 */

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Settings } from 'lucide-react'

export const Header = () => {
  return (
    <header className="h-16 bg-background border-b border-border px-6 flex items-center justify-between">
      {/* Búsqueda */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar proyectos..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" title="Ajustes">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
