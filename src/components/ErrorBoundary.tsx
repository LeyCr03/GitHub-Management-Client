/**
 * Error Boundary para capturar errores en la aplicación
 * Issue 10 - Integración Final y Polish
 *
 * Captura errores no manejados y muestra interfaz de error
 * con opción de recargar la página
 */

import React, { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('Error capturado:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <AlertCircle className="w-16 h-16 text-destructive" />
          <h1 className="text-2xl font-bold">Algo salió mal</h1>
          <p className="text-muted-foreground text-center max-w-md">
            {this.state.error?.message || 'Error desconocido'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            Recargar página
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
