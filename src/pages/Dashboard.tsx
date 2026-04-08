

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { FoldersView } from '@/components/dashboard/FoldersView'

export const DashboardPage = () => {
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null)

  const handleProjectSelect = (ownerRepo: string) => {
    // Aquí se podría abrir un modal o navegar a una página de detalles
    console.log('Proyecto seleccionado:', ownerRepo)
  }

  return (
    <MainLayout onTagSelect={setSelectedTagId} selectedTagId={selectedTagId}>
      <FoldersView
        selectedTagId={selectedTagId}
        onProjectSelect={handleProjectSelect}
      />
    </MainLayout>
  )
}
