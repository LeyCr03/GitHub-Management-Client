/**
 * Página del Dashboard
 * Issue 06 - Dashboard y FoldersView
 *
 * Estructura:
 * - MainLayout (Sidebar + Header + Main)
 * - FoldersView (proyectos agrupados por tags)
 */

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { FoldersView } from '@/components/dashboard/FoldersView'

export const DashboardPage = () => {
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null)

  return (
    <MainLayout onTagSelect={setSelectedTagId} selectedTagId={selectedTagId}>
      <FoldersView selectedTagId={selectedTagId} />
    </MainLayout>
  )
}
