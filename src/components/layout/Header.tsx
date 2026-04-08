/**
 * Header mejorado con breadcrumbs, búsqueda y usuario
 * Issue 12 - Rediseño UI Moderno
 *
 * Características:
 * - Breadcrumbs de navegación
 * - Búsqueda visual
 * - Notificaciones
 * - User profile menu
 */

import { Bell, Search, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  userName?: string
}

export const Header = ({ userName = 'Usuario' }: HeaderProps) => {
  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_username')
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-8">
        {/* Left: Welcome Message */}
        <div className="flex flex-col">
          <h2 className="text-sm font-medium text-muted-foreground">Welcome Back!</h2>
          <p className="text-lg font-semibold text-foreground">{userName}</p>
        </div>

        {/* Right: Search + Notifications + User */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 bg-muted/40 border border-border/40 rounded-lg
                       text-sm text-foreground placeholder-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-primary/20
                       transition-all duration-200"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Settings className="w-5 h-5" />
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
