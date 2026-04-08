"use client"

import { cn } from "@/lib/utils"
import { 
  CalendarDay, 
  DateRange, 
  DAY_NAMES, 
  isSameDay, 
  isDateInRange 
} from "@/lib/calendar-utils"

interface CalendarGridProps {
  days: CalendarDay[]
  selectedRange: DateRange
  onDateClick: (date: Date) => void
  hoveredDate: Date | null
  onDateHover: (date: Date | null) => void
}

export function CalendarGrid({ 
  days, 
  selectedRange, 
  onDateClick,
  hoveredDate,
  onDateHover 
}: CalendarGridProps) {
  const getDateState = (day: CalendarDay) => {
    const isStart = isSameDay(day.date, selectedRange.start)
    const isEnd = isSameDay(day.date, selectedRange.end)
    const isInRange = isDateInRange(day.date, selectedRange)
    
    // Preview range while hovering
    let isInPreviewRange = false
    if (selectedRange.start && !selectedRange.end && hoveredDate) {
      const previewStart = selectedRange.start.getTime() < hoveredDate.getTime() 
        ? selectedRange.start 
        : hoveredDate
      const previewEnd = selectedRange.start.getTime() < hoveredDate.getTime() 
        ? hoveredDate 
        : selectedRange.start
      const time = day.date.getTime()
      isInPreviewRange = time >= previewStart.getTime() && time <= previewEnd.getTime()
    }
    
    return { isStart, isEnd, isInRange, isInPreviewRange }
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map((day, index) => (
          <div 
            key={day} 
            className={cn(
              "text-center text-xs sm:text-sm font-semibold py-2",
              index >= 5 ? "text-primary" : "text-muted-foreground"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day, index) => {
          const { isStart, isEnd, isInRange, isInPreviewRange } = getDateState(day)
          const showRangeBackground = isInRange || isInPreviewRange
          
          return (
            <div
              key={index}
              className="relative flex items-center justify-center"
            >
              {/* Range background */}
              {showRangeBackground && (
                <div 
                  className={cn(
                    "absolute inset-y-1 inset-x-0",
                    isInRange ? "bg-primary/15" : "bg-primary/10",
                    isStart && "rounded-l-full ml-1",
                    isEnd && "rounded-r-full mr-1",
                    isStart && isEnd && "rounded-full mx-1"
                  )}
                />
              )}
              
              <button
                onClick={() => onDateClick(day.date)}
                onMouseEnter={() => onDateHover(day.date)}
                onMouseLeave={() => onDateHover(null)}
                className={cn(
                  "relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center",
                  "text-sm sm:text-base font-medium transition-all duration-150",
                  "hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  // Current month vs other months
                  day.isCurrentMonth 
                    ? "text-foreground" 
                    : "text-muted-foreground/50",
                  // Weekend styling
                  day.isWeekend && day.isCurrentMonth && "text-primary font-semibold",
                  // Today indicator
                  day.isToday && "ring-2 ring-primary ring-offset-2",
                  // Start/End date styling
                  (isStart || isEnd) && "bg-primary text-white hover:bg-primary/90",
                )}
                aria-label={`${day.date.toLocaleDateString()}`}
                aria-pressed={isStart || isEnd}
              >
                {day.date.getDate()}
              </button>
            </div>
          )
        })}
      </div>
      
      {/* Selection indicator */}
      {(selectedRange.start || selectedRange.end) && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {selectedRange.start && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-primary" />
                Start: <span className="font-medium text-foreground">
                  {selectedRange.start.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </span>
            )}
            {selectedRange.start && selectedRange.end && (
              <span className="text-muted-foreground">→</span>
            )}
            {selectedRange.end && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-primary" />
                End: <span className="font-medium text-foreground">
                  {selectedRange.end.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
