"use client"

import { useState } from "react"
import { Plus, Trash2, Calendar, StickyNote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Note, DateRange, formatDateKey } from "@/lib/calendar-utils"

interface NotesSectionProps {
  notes: Note[]
  selectedRange: DateRange
  onAddNote: (note: Omit<Note, 'id' | 'createdAt'>) => void
  onDeleteNote: (id: string) => void
}

export function NotesSection({ 
  notes, 
  selectedRange, 
  onAddNote, 
  onDeleteNote 
}: NotesSectionProps) {
  const [newNoteText, setNewNoteText] = useState("")
  const [isExpanded, setIsExpanded] = useState(true)

  const handleAddNote = () => {
    if (!newNoteText.trim()) return
    
    const dateKey = selectedRange.start 
      ? formatDateKey(selectedRange.start)
      : formatDateKey(new Date())
    
    onAddNote({
      date: dateKey,
      text: newNoteText.trim()
    })
    setNewNoteText("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleAddNote()
    }
  }

  // Filter notes for selected range or show all
  const filteredNotes = selectedRange.start
    ? notes.filter(note => {
        const noteDate = new Date(note.date)
        if (selectedRange.end) {
          return noteDate >= selectedRange.start! && noteDate <= selectedRange.end
        }
        return note.date === formatDateKey(selectedRange.start!)
      })
    : notes

  const sortedNotes = [...filteredNotes].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-amber-50/50 to-white border-l border-border">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Notes</h3>
          {sortedNotes.length > 0 && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {sortedNotes.length}
            </span>
          )}
        </div>
        <div 
          className={cn(
            "transition-transform duration-200",
            isExpanded ? "rotate-180" : ""
          )}
        >
          <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Selected date indicator */}
          {selectedRange.start && (
            <div className="px-4 py-2 bg-primary/5 border-b border-border">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">
                  {selectedRange.end ? (
                    <>
                      {selectedRange.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {' — '}
                      {selectedRange.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </>
                  ) : (
                    selectedRange.start.toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric' 
                    })
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Add note input */}
          <div className="p-4 border-b border-border">
            <Textarea
              placeholder="Add a note..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[80px] resize-none bg-white"
              aria-label="New note text"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                ⌘ + Enter to add
              </span>
              <Button 
                size="sm" 
                onClick={handleAddNote}
                disabled={!newNoteText.trim()}
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Note
              </Button>
            </div>
          </div>

          {/* Notes list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sortedNotes.length === 0 ? (
              <div className="text-center py-8">
                <StickyNote className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {selectedRange.start 
                    ? "No notes for this selection"
                    : "No notes yet"
                  }
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Select a date and add your first note
                </p>
              </div>
            ) : (
              sortedNotes.map((note) => (
                <div
                  key={note.id}
                  className="group relative bg-white rounded-lg p-3 shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                        {note.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(note.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDeleteNote(note.id)}
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
