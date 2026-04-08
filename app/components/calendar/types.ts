export type ViewMode = "month" | "week" | "day"
export type EventColor = "violet" | "blue" | "emerald" | "rose" | "amber"

export type Range = {
  start: Date | null
  end: Date | null
}

export type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  color: EventColor
}

export type CalendarNote = {
  id: string
  dateKey: string
  text: string
  createdAt: number
}
