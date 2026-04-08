"use client"

import { AnimatePresence, motion } from "framer-motion"
import { EventColor, CalendarEvent } from "./types"
import { EVENT_COLOR_STYLES } from "./event-card"

type EventEditorModalProps = {
  open: boolean
  editingEvent: CalendarEvent | null
  onClose: () => void
  onChange: (event: CalendarEvent) => void
  onSave: () => void
  onDelete: (eventId: string) => void
}

export function EventEditorModal({
  open,
  editingEvent,
  onClose,
  onChange,
  onSave,
  onDelete,
}: EventEditorModalProps) {
  return (
    <AnimatePresence>
      {open && editingEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-zinc-900/20 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <h3 className="mb-3 text-lg font-semibold">
              {editingEvent.id ? "Edit event" : "Create event"}
            </h3>
            <div className="space-y-3">
              <input
                value={editingEvent.title}
                onChange={(e) => onChange({ ...editingEvent, title: e.target.value })}
                placeholder="Event title"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-400"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="datetime-local"
                  value={new Date(
                    editingEvent.start.getTime() -
                      editingEvent.start.getTimezoneOffset() * 60000,
                  )
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) =>
                    onChange({ ...editingEvent, start: new Date(e.target.value) })
                  }
                  className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <input
                  type="datetime-local"
                  value={new Date(
                    editingEvent.end.getTime() - editingEvent.end.getTimezoneOffset() * 60000,
                  )
                    .toISOString()
                    .slice(0, 16)}
                  onChange={(e) =>
                    onChange({ ...editingEvent, end: new Date(e.target.value) })
                  }
                  className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>
              <div className="flex gap-2">
                {(Object.keys(EVENT_COLOR_STYLES) as EventColor[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => onChange({ ...editingEvent, color: c })}
                    className={`h-7 w-7 rounded-full ring-offset-2 transition ${
                      EVENT_COLOR_STYLES[c]
                    } ${editingEvent.color === c ? "ring-2 ring-zinc-900 dark:ring-white" : ""}`}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              {editingEvent.id ? (
                <button
                  onClick={() => onDelete(editingEvent.id)}
                  className="rounded-xl bg-rose-500 px-3 py-2 text-sm text-white"
                >
                  Delete
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button onClick={onClose} className="rounded-xl border px-3 py-2 text-sm">
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  className="rounded-xl bg-indigo-600 px-3 py-2 text-sm text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
