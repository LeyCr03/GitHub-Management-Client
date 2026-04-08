/**
 * Panel lateral derecho con Todos y Notes
 * Issue 12 - Rediseño UI Moderno
 *
 * Características:
 * - Sección de Todos con checkboxes
 * - Sección de Notes
 * - Botones de acción
 * - Layout responsivo
 */

import { Plus, CheckCircle2, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Todo {
  id: string
  text: string
  completed: boolean
}

interface Note {
  id: string
  title: string
  content: string
  date: string
}

interface RightPanelProps {
  todos?: Todo[]
  notes?: Note[]
}

export const RightPanel = ({ todos = [], notes = [] }: RightPanelProps) => {
  const mockTodos: Todo[] = [
    { id: '1', text: 'Organize GitHub repos', completed: true },
    { id: '2', text: 'Update documentation', completed: false },
    { id: '3', text: 'Review pull requests', completed: false },
  ]

  const mockNotes: Note[] = [
    {
      id: '1',
      title: 'Performance Tips',
      content: 'Consider caching API responses for faster load times',
      date: 'Apr 2, 2025',
    },
    {
      id: '2',
      title: 'Next Steps',
      content: 'Implement dark mode and improve mobile responsiveness',
      date: 'Mar 28, 2025',
    },
  ]

  const displayTodos = todos.length > 0 ? todos : mockTodos
  const displayNotes = notes.length > 0 ? notes : mockNotes

  return (
    <aside className="hidden lg:flex w-80 bg-card border-l border-border/40 flex-col">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Todos Section */}
        <div className="p-6 border-b border-border/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">
              📋 Todos
            </h3>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {displayTodos.map((todo) => (
              <button
                key={todo.id}
                className="flex items-center gap-3 w-full p-2 rounded-lg
                         hover:bg-muted/40 transition-colors group text-left"
              >
                {todo.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                )}
                <span
                  className={`text-sm flex-1 truncate ${
                    todo.completed
                      ? 'line-through text-muted-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {todo.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">
              📝 Notes
            </h3>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {displayNotes.map((note) => (
              <button
                key={note.id}
                className="p-3 rounded-lg border border-border/20 hover:border-primary/40
                         hover:bg-muted/20 transition-all group text-left w-full"
              >
                <h4 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                  {note.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {note.content}
                </p>
                <span className="text-xs text-muted-foreground/60 mt-2 inline-block">
                  {note.date}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
