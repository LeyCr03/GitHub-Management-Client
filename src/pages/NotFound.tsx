/**
 * Página 404 - Página no encontrada
 * Issue 10 - Integración Final y Polish
 */

import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export const NotFoundPage = () => {
  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AlertCircle className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-3xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground mb-6">Página no encontrada</p>
      <Button onClick={handleGoHome}>Volver al inicio</Button>
    </div>
  )
}
