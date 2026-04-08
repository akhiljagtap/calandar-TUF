"use client"

import { DAY_NAMES, startOfDay } from "./date-utils"
import { CalendarEvent, Range } from "./types"
import { DayCell } from "./day-cell"

type MonthViewProps = {
  monthGrid: Date[]
  currentDate: Date
  selectedRange: Range
  hoveredDate: Date | null
  monthEvents: Map<string, CalendarEvent[]>
  onDateClick: (date: Date) => void
  onDateHover: (date: Date | null) => void
  onAddEvent: (date: Date) => void
  onEditEvent: (event: CalendarEvent) => void
  onDragStartEvent: (eventId: string) => void
  onDropEvent: (date: Date) => void
  holidays?: Record<string, string>
}

export function MonthView({
  monthGrid,
  currentDate,
  selectedRange,
  hoveredDate,
  monthEvents,
  onDateClick,
  onDateHover,
  onAddEvent,
  onEditEvent,
  onDragStartEvent,
  onDropEvent,
  holidays = {},
}: MonthViewProps) {
  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold tracking-wide text-zinc-500">
        {DAY_NAMES.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {monthGrid.map((date) => (
          <DayCell
            key={date.toISOString()}
            date={date}
            currentMonth={currentDate.getMonth()}
            selectedRange={selectedRange}
            hoveredDate={hoveredDate}
            events={monthEvents.get(startOfDay(date).toISOString()) ?? []}
            onDateClick={onDateClick}
            onDateHover={onDateHover}
            onAddEvent={onAddEvent}
            onEditEvent={onEditEvent}
            onDragStartEvent={onDragStartEvent}
            onDropEvent={onDropEvent}
            holidayLabel={holidays[startOfDay(date).toISOString().slice(0, 10)]}
          />
        ))}
      </div>
    </div>
  )
}
