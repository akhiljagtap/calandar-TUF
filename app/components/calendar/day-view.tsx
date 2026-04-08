"use client"

import { CalendarEvent } from "./types"
import { HOUR_SLOTS, sameDay } from "./date-utils"
import { EventCard } from "./event-card"

type DayViewProps = {
  currentDate: Date
  events: CalendarEvent[]
  holidays?: Record<string, string>
  onEditEvent: (event: CalendarEvent) => void
  onDragStartEvent: (eventId: string) => void
  onDropEventAtHour: (hour: number) => void
}

export function DayView({
  currentDate,
  events,
  holidays = {},
  onEditEvent,
  onDragStartEvent,
  onDropEventAtHour,
}: DayViewProps) {
  const dateKey = currentDate.toISOString().slice(0, 10)
  const isSunday = currentDate.getDay() === 0
  const holiday = holidays[dateKey]
  return (
    <div className="space-y-2">
      <div className="rounded-xl border px-3 py-2 text-sm font-medium">
        {currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
        {(isSunday || holiday) && (
          <span className="ml-2 inline-flex items-center rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">
            {holiday ?? "Sunday"}
          </span>
        )}
      </div>
      <div className="max-h-[560px] overflow-auto rounded-xl border">
        {HOUR_SLOTS.map((hour) => {
          const slotEvents = events.filter(
            (e) => sameDay(e.start, currentDate) && e.start.getHours() === hour,
          )
          return (
            <div
              key={hour}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDropEventAtHour(hour)}
              className="grid grid-cols-[70px,1fr] border-b last:border-b-0"
            >
              <div className="px-3 py-3 text-xs text-zinc-400">
                {String(hour).padStart(2, "0")}:00
              </div>
              <div className="min-h-14 p-2">
                <div className="space-y-1">
                  {slotEvents.map((event) => (
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
