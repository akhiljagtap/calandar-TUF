"use client"

import { motion } from "framer-motion"
import { CalendarEvent } from "./types"
import { formatTime } from "./date-utils"

export const EVENT_COLOR_STYLES = {
  violet: "bg-violet-500/90 text-white shadow-violet-500/25",
  blue: "bg-blue-500/90 text-white shadow-blue-500/25",
  emerald: "bg-emerald-500/90 text-white shadow-emerald-500/25",
  rose: "bg-rose-500/90 text-white shadow-rose-500/25",
  amber: "bg-amber-500/90 text-black shadow-amber-500/25",
} as const

type EventCardProps = {
  event: CalendarEvent
  onEdit: (event: CalendarEvent) => void
  onDragStart: (eventId: string) => void
  compact?: boolean
  showTime?: boolean
}

export function EventCard({
  event,
  onEdit,
  onDragStart,
  compact = false,
  showTime = true,
}: EventCardProps) {
  return (
    <motion.button
      draggable
      onDragStart={() => onDragStart(event.id)}
      onClick={() => onEdit(event)}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 360, damping: 22 }}
      className={`w-full rounded-xl border border-white/20 px-2.5 py-1.5 text-left shadow-lg transition ${
        EVENT_COLOR_STYLES[event.color]
      } ${compact ? "text-xs" : "text-sm"}`}
    >
      <div className="truncate font-medium tracking-tight">{event.title}</div>
      {showTime && (
        <div className="opacity-85">
          {formatTime(event.start)}
          {!compact ? ` - ${formatTime(event.end)}` : ""}
        </div>
      )}
    </motion.button>
  )
}
