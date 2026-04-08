export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface Note {
  id: string
  date: string
  text: string
  createdAt: number
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
}

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export const MONTH_IMAGES = [
  "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1600&q=80",
]

const NOTES_STORAGE_KEY = "wall-calendar-notes"

export function formatDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return formatDateKey(a) === formatDateKey(b)
}

export function isDateInRange(date: Date, range: DateRange): boolean {
  if (!range.start || !range.end) return false
  const dateMs = new Date(formatDateKey(date)).getTime()
  const startMs = new Date(formatDateKey(range.start)).getTime()
  const endMs = new Date(formatDateKey(range.end)).getTime()
  return dateMs >= startMs && dateMs <= endMs
}

export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDayOfMonth = new Date(year, month, 1)
  const startOfGrid = new Date(firstDayOfMonth)
  startOfGrid.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay())

  const todayKey = formatDateKey(new Date())
  const days: CalendarDay[] = []

  for (let i = 0; i < 42; i += 1) {
    const date = new Date(startOfGrid)
    date.setDate(startOfGrid.getDate() + i)
    days.push({
      date,
      isCurrentMonth: date.getMonth() === month,
      isToday: formatDateKey(date) === todayKey,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    })
  }

  return days
}

export function getNotesFromStorage(): Note[] {
  if (typeof window === "undefined") return []
  const raw = window.localStorage.getItem(NOTES_STORAGE_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is Note =>
        item &&
        typeof item.id === "string" &&
        typeof item.date === "string" &&
        typeof item.text === "string" &&
        typeof item.createdAt === "number",
    )
  } catch {
    return []
  }
}

export function saveNotesToStorage(notes: Note[]): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
}
