"use client"

import { useMemo, useState } from "react"
import { CalendarNote } from "./types"
import { monthKey, toDateKey } from "./date-utils"

type NotesPanelProps = {
  notes: CalendarNote[]
  currentDate: Date
  selectedDate: Date | null
  onAddNote: (dateKey: string, text: string) => void
  onDeleteNote: (id: string) => void
}

export function NotesPanel({
  notes,
  currentDate,
  selectedDate,
  onAddNote,
  onDeleteNote,
}: NotesPanelProps) {
  const [text, setText] = useState("")
  const selectedKey = selectedDate ? toDateKey(selectedDate) : null
  const activeMonthKey = monthKey(currentDate)

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        if (selectedKey) return note.dateKey === selectedKey
        return note.dateKey.startsWith(activeMonthKey)
      })
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [notes, selectedKey, activeMonthKey])

  const targetDateKey = selectedKey ?? toDateKey(currentDate)

  return (
    <aside className="rounded-2xl border border-zinc-200/90 bg-white/95 p-4 shadow-xl shadow-zinc-900/5 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/70">
      <div className="mb-3">
        <h3 className="text-base font-semibold tracking-tight">Notes</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {selectedKey ? `Linked to ${selectedKey}` : `Linked to ${activeMonthKey}`}
        </p>
      </div>

      <div className="mb-3 space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a quick note..."
          className="min-h-24 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-inner outline-none transition focus:ring-2 focus:ring-indigo-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
        <button
          onClick={() => {
            if (!text.trim()) return
            onAddNote(targetDateKey, text.trim())
            setText("")
          }}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition hover:scale-[1.01] active:scale-[0.99]"
        >
          Add Note
        </button>
      </div>

      <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
        {filteredNotes.length === 0 ? (
          <p className="rounded-xl border border-dashed px-3 py-6 text-center text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No notes yet for this scope.
          </p>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-medium text-zinc-500">{note.dateKey}</span>
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="text-xs text-rose-500 hover:text-rose-600"
                >
                  Delete
                </button>
              </div>
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{note.text}</p>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
