/**
 * Página del Dashboard
 * Issue 06 - Dashboard y FoldersView
 * Issue 11 - Integración con Servidor NestJS
 * Issue 12 - Rediseño UI Moderno
 *
 * Estructura:
 * - MainLayout (Sidebar + Header + Main)
 * - FoldersView (vista de carpetas) o FolderDetailPage (detalles de carpeta)
 */

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { FoldersView } from '@/components/dashboard/FoldersView'
import { FolderDetailPage } from './FolderDetail'

type ViewType = 'folders' | 'folder-detail'

export const DashboardPage = () => {
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>('folders')
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId)
    setCurrentView('folder-detail')
  }

  const handleBackToFolders = () => {
    setCurrentView('folders')
    setSelectedFolderId(null)
  }

  const handleProjectSelect = (ownerRepo: string) => {
    // Aquí se podría abrir un modal o navegar a una página de detalles
    console.log('Proyecto seleccionado:', ownerRepo)
  }

  return (
    <MainLayout onTagSelect={setSelectedTagId} selectedTagId={selectedTagId}>
      {currentView === 'folders' ? (
        <FoldersView
          selectedTagId={selectedTagId}
          onProjectSelect={handleProjectSelect}
          onFolderSelect={handleFolderSelect}
        />
      ) : (
        selectedFolderId && (
          <FolderDetailPage
            folderId={selectedFolderId}
            onBack={handleBackToFolders}
          />
        )
      )}
    </MainLayout>
  )
}
