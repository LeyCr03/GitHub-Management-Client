
/**
 * Componente raíz de la aplicación
 * Issue 06 - Dashboard y FoldersView
 * Issue 11 - Integración con Servidor NestJS
 */

import { useEffect, useState } from 'react'
import { DashboardPage } from '@/pages/Dashboard'
import { LoginButton } from '@/components/LoginButton'
import '@/index.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Manejar OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const username = params.get('username')

    if (token && username) {
      // Guardar token en localStorage
      localStorage.setItem('auth_token', token)
      localStorage.setItem('user_username', username)

      // Marcar como autenticado
      setIsAuthenticated(true)

      // Limpiar URL
      window.history.replaceState({}, document.title, '/')
    } else {
      // Verificar si ya hay token guardado
      const savedToken = localStorage.getItem('auth_token')
      setIsAuthenticated(!!savedToken)
    }

    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  // Mostrar login si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-6 px-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">GitHub Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Gestiona tus repositorios en un solo lugar
            </p>
          </div>
          <div className="pt-4">
            <LoginButton size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">
            Inicia sesión con tu cuenta de GitHub para continuar
          </p>
        </div>
      </div>
    )
  }

  return <DashboardPage />
}

export default App
