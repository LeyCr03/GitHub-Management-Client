/**
 * Botón de login con GitHub OAuth
 * Issue 11 - Integración con Servidor NestJS
 */

import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

interface LoginButtonProps {
  size?: 'sm' | 'default' | 'lg' | 'icon'
}

export const LoginButton = ({ size = 'default' }: LoginButtonProps) => {
  const handleLogin = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
    window.location.href = `${baseUrl}/auth/github`
  }

  return (
    <Button onClick={handleLogin} size={size} className="gap-2">
      <Github className="w-4 h-4" />
      Login con GitHub
    </Button>
  )
}
