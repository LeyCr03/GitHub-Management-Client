/**
 * Layout principal del dashboard - Mejorado
 * Issue 05 - Componentes de Layout
 * Issue 12 - Rediseño UI Moderno
 *
 * Estructura:
 * - Sidebar (navegación + filtros)
 * - Header (búsqueda + ajustes)
 * - Main (contenido)
 * - RightPanel (Todos + Notes)
 */

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { RightPanel } from './RightPanel'
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
  const userName = localStorage.getItem('user_username') || 'Usuario'

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Navegación y filtros */}
      <Sidebar onTagSelect={onTagSelect} selectedTagId={selectedTagId} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Búsqueda y ajustes */}
        <Header userName={userName} />

        {/* Content Area with RightPanel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>

          {/* Right Panel - Todos & Notes */}
          <RightPanel />
        </div>
      </div>
    </div>
  )
}
