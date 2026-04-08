"use client"

import { DAY_NAMES, sameDay } from "./date-utils"
import { CalendarEvent } from "./types"
import { EventCard } from "./event-card"

type WeekViewProps = {
  weekDays: Date[]
  events: CalendarEvent[]
  holidays?: Record<string, string>
  onDateClick: (date: Date) => void
  onEditEvent: (event: CalendarEvent) => void
  onDragStartEvent: (eventId: string) => void
  onDropEvent: (date: Date) => void
}

export function WeekView({
  weekDays,
  events,
  holidays = {},
  onDateClick,
  onEditEvent,
  onDragStartEvent,
  onDropEvent,
}: WeekViewProps) {
  return (
    <div className="grid grid-cols-7 gap-3">
      {weekDays.map((date) => {
        const dayEvents = events.filter((e) => sameDay(e.start, date))
        const dateKey = date.toISOString().slice(0, 10)
        const isSunday = date.getDay() === 0
        const holiday = holidays[dateKey]
        return (
          <div
            key={date.toISOString()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDropEvent(date)}
            className="rounded-2xl border p-2"
          >
            <button
              onClick={() => onDateClick(date)}
              className={`mb-2 flex w-full items-center justify-between rounded-lg px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                sameDay(date, new Date()) ? "ring-2 ring-indigo-400/60" : ""
              }`}
            >
              <span className={isSunday || holiday ? "text-rose-500 font-semibold" : ""}>
                {DAY_NAMES[date.getDay()]}
              </span>
              <span
                className={
                  isSunday || holiday
                    ? "rounded-full bg-rose-500 px-2 py-0.5 text-white"
                    : ""
                }
              >
                {date.getDate()}
              </span>
            </button>
            {holiday && (
              <p className="mb-2 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-500">
                {holiday}
              </p>
            )}
            <div className="space-y-2">
              {dayEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  compact
                  onEdit={onEditEvent}
                  onDragStart={onDragStartEvent}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
