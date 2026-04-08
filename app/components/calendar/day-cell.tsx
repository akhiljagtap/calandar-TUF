"use client"

import { CalendarEvent, Range } from "./types"
import { inRange, sameDay, startOfDay } from "./date-utils"
import { EventCard } from "./event-card"

type DayCellProps = {
  date: Date
  currentMonth: number
  selectedRange: Range
  hoveredDate: Date | null
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onDateHover: (date: Date | null) => void
  onAddEvent: (date: Date) => void
  onEditEvent: (event: CalendarEvent) => void
  onDragStartEvent: (eventId: string) => void
  onDropEvent: (date: Date) => void
  holidayLabel?: string
}

export function DayCell({
  date,
  currentMonth,
  selectedRange,
  hoveredDate,
  events,
  onDateClick,
  onDateHover,
  onAddEvent,
  onEditEvent,
  onDragStartEvent,
  onDropEvent,
  holidayLabel,
}: DayCellProps) {
  const isToday = sameDay(date, new Date())
  const isCurrentMonth = date.getMonth() === currentMonth
  const isSelected = inRange(date, selectedRange, hoveredDate)
  const isRangeStart = selectedRange.start ? sameDay(date, selectedRange.start) : false
  const isRangeEnd = selectedRange.end ? sameDay(date, selectedRange.end) : false
  const isRangeEdge = isRangeStart || isRangeEnd
  const isSunday = date.getDay() === 0

  return (
    <div
      onMouseEnter={() => onDateHover(date)}
      onMouseLeave={() => onDateHover(null)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDropEvent(date)}
      className={`group min-h-[110px] rounded-2xl border p-2 transition ${
        isCurrentMonth ? "" : "opacity-40"
      } ${
        isSelected
          ? "bg-gradient-to-r from-indigo-500/12 via-violet-500/12 to-cyan-500/12 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.12)]"
          : "hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80"
      }`}
    >
      <button
        onClick={() => onDateClick(date)}
        className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm ${
          isRangeEdge
            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40"
            : isToday
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-400/60"
              : ""
        }`}
      >
        {date.getDate()}
      </button>
      {holidayLabel && (
        <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-500">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          {holidayLabel}
        </div>
      )}
      {!holidayLabel && isSunday && (
        <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-500">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          Sunday
        </div>
      )}
      <div className="space-y-1">
        {events.slice(0, 3).map((event) => (
          <EventCard
            key={event.id}
            event={event}
            compact
            showTime={false}
            onEdit={onEditEvent}
            onDragStart={onDragStartEvent}
          />
        ))}
        <button
          onClick={() => onAddEvent(startOfDay(date))}
          className="w-full rounded-lg border border-dashed px-2 py-1 text-xs text-zinc-500 opacity-0 transition group-hover:opacity-100"
        >
          + Add event
        </button>
      </div>
    </div>
  )
}
