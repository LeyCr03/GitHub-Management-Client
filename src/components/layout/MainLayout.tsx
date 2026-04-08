/**
 * Layout principal del dashboard
 * Issue 05 - Componentes de Layout
 *
 * Estructura:
 * - Sidebar (navegación + filtros)
 * - Header (búsqueda + ajustes)
 * - Main (contenido)
 */

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import '../../../src/styles/layout.css'

interface MainLayoutProps {
  children: ReactNode
  onTagSelect?: (tagId: string | null) => void
  selectedTagId?: string | null
}

export const MainLayout = ({
  children,
  onTagSelect,
  selectedTagId
}: MainLayoutProps) => {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Navegación y filtros */}
      <Sidebar onTagSelect={onTagSelect} selectedTagId={selectedTagId} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Búsqueda y ajustes */}
        <Header />

        {/* Contenido principal */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
