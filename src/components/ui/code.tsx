import { ReactNode } from 'react'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CodeProps {
  children: ReactNode
  className?: string
  language?: string
  showCopy?: boolean
}

/**
 * Componente Code para mostrar bloques de código con botón copiar
 * Usado en README preview y documentación
 */
export const Code = ({
  children,
  className,
  language,
  showCopy = true,
}: CodeProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const code = (children as string).trim()
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative bg-muted rounded-lg overflow-hidden mb-4 border border-border">
      {/* Language Badge */}
      {language && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-background/80 rounded text-xs text-muted-foreground font-mono">
          {language}
        </div>
      )}

      {/* Code Block */}
      <pre className={cn('text-sm p-4 overflow-x-auto', className)}>
        <code>{children}</code>
      </pre>

      {/* Copy Button */}
      {showCopy && (
        <button
          onClick={handleCopy}
          className={cn(
            'absolute top-2 right-2 p-2 hover:bg-background rounded transition-all',
            language ? 'top-10' : 'top-2'
          )}
          title={copied ? 'Copiado!' : 'Copiar código'}
          aria-label={copied ? 'Copiado!' : 'Copiar código'}
          type="button"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      )}
    </div>
  )
}
