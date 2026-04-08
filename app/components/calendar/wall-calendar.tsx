"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CalendarToolbar } from "./calendar-toolbar"
import { DayView } from "./day-view"
import { EventEditorModal } from "./event-editor-modal"
import { LightDarkToggle } from "./light-dark-toggle"
import { MonthView } from "./month-view"
import { NotesPanel } from "./notes-panel"
import { WeekView } from "./week-view"
import { CalendarEvent, CalendarNote, Range, ViewMode } from "./types"
import {
  DAY_NAMES,
  getMonthGrid,
  getWeekDays,
  inRange,
  sameDay,
  startOfDay,
  toDateKey,
} from "./date-utils"

const NOTES_STORAGE_KEY = "wall-calendar-notes-v1"
const EVENTS_STORAGE_KEY = "wall-calendar-events-v1"
const RANGE_STORAGE_KEY = "wall-calendar-range-v1"
const THEME_STORAGE_KEY = "wall-calendar-theme-v1"

const MONTH_THEMES = [
  {
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80",
    panelGradient:
      "from-sky-400/15 via-indigo-400/10 to-white dark:from-sky-900/20 dark:to-zinc-900",
  },
  {
    image:
      "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?auto=format&fit=crop&w=1200&q=80",
    panelGradient:
      "from-rose-400/15 via-orange-300/10 to-white dark:from-rose-900/20 dark:to-zinc-900",
  },
  {
    image:
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=1200&q=80",
    panelGradient:
      "from-emerald-400/15 via-lime-300/10 to-white dark:from-emerald-900/20 dark:to-zinc-900",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    panelGradient:
      "from-violet-400/15 via-fuchsia-300/10 to-white dark:from-violet-900/20 dark:to-zinc-900",
  },
  {
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    panelGradient:
      "from-cyan-400/15 via-blue-300/10 to-white dark:from-cyan-900/20 dark:to-zinc-900",
  },
  {
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
    panelGradient:
      "from-amber-400/15 via-orange-300/10 to-white dark:from-amber-900/20 dark:to-zinc-900",
  },
  {
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    panelGradient:
      "from-blue-400/15 via-cyan-300/10 to-white dark:from-blue-900/20 dark:to-zinc-900",
  },
  {
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    panelGradient:
      "from-orange-400/15 via-amber-300/10 to-white dark:from-orange-900/20 dark:to-zinc-900",
  },
  {
    image:
      "https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=1200&q=80",
    panelGradient:
      "from-indigo-400/15 via-blue-300/10 to-white dark:from-indigo-900/20 dark:to-zinc-900",
  },
  {
    image:
      "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1200&q=80",
    panelGradient:
      "from-rose-400/15 via-violet-300/10 to-white dark:from-rose-900/20 dark:to-zinc-900",
  },
  {
    image:
      "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80",
    panelGradient:
      "from-teal-400/15 via-emerald-300/10 to-white dark:from-teal-900/20 dark:to-zinc-900",
  },
  {
    image:
      "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1200&q=80",
    panelGradient:
      "from-blue-500/15 via-indigo-300/10 to-white dark:from-blue-900/20 dark:to-zinc-900",
  },
]

const MONTH_BLENDS = [
  ["rgba(56,189,248,0.28)", "rgba(99,102,241,0.24)", "rgba(14,165,233,0.18)"],
  ["rgba(251,113,133,0.26)", "rgba(251,146,60,0.22)", "rgba(244,114,182,0.18)"],
  ["rgba(52,211,153,0.24)", "rgba(163,230,53,0.2)", "rgba(16,185,129,0.18)"],
  ["rgba(168,85,247,0.26)", "rgba(217,70,239,0.22)", "rgba(99,102,241,0.18)"],
  ["rgba(34,211,238,0.24)", "rgba(59,130,246,0.22)", "rgba(14,165,233,0.18)"],
  ["rgba(251,191,36,0.24)", "rgba(249,115,22,0.22)", "rgba(245,158,11,0.18)"],
  ["rgba(59,130,246,0.24)", "rgba(34,211,238,0.2)", "rgba(99,102,241,0.18)"],
  ["rgba(251,146,60,0.24)", "rgba(252,211,77,0.2)", "rgba(249,115,22,0.18)"],
  ["rgba(129,140,248,0.24)", "rgba(59,130,246,0.22)", "rgba(14,165,233,0.18)"],
  ["rgba(244,114,182,0.24)", "rgba(168,85,247,0.22)", "rgba(251,113,133,0.18)"],
  ["rgba(45,212,191,0.24)", "rgba(52,211,153,0.2)", "rgba(20,184,166,0.18)"],
  ["rgba(59,130,246,0.24)", "rgba(129,140,248,0.22)", "rgba(14,165,233,0.18)"],
]

function moveEventToDate(event: CalendarEvent, targetDate: Date) {
  const duration = event.end.getTime() - event.start.getTime()
  const nextStart = new Date(targetDate)
  nextStart.setHours(event.start.getHours(), event.start.getMinutes(), 0, 0)
  const nextEnd = new Date(nextStart.getTime() + duration)
  return { ...event, start: nextStart, end: nextEnd }
}

const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Product Design Review",
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    color: "violet",
  },
  {
    id: "2",
    title: "Lunch with Team",
    start: new Date(new Date().setHours(13, 30, 0, 0)),
    end: new Date(new Date().setHours(14, 30, 0, 0)),
    color: "emerald",
  },
]

export function WallCalendar() {
  const now = new Date()
  const [isDark, setIsDark] = useState(true)
  const [view, setView] = useState<ViewMode>("month")
  const [showMiniMonth, setShowMiniMonth] = useState(true)
  const [currentDate, setCurrentDate] = useState(startOfDay(now))
  const [selectedRange, setSelectedRange] = useState<Range>({ start: null, end: null })
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null)
  const [editorOpen, setEditorOpen] = useState<boolean>(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [notes, setNotes] = useState<CalendarNote[]>([])
  const [navDirection, setNavDirection] = useState<1 | -1>(1)

  const monthGrid = useMemo(() => getMonthGrid(currentDate), [currentDate])
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate])
  const monthTheme = MONTH_THEMES[currentDate.getMonth()]
  const monthBlend = MONTH_BLENDS[currentDate.getMonth()]

  const monthEvents = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    events.forEach((event) => {
      const key = startOfDay(event.start).toISOString()
      const existing = map.get(key) ?? []
      existing.push(event)
      map.set(key, existing)
    })
    return map
  }, [events])

  const selectedDate = selectedRange.end ?? selectedRange.start

  const holidays = useMemo(() => {
    const y = currentDate.getFullYear()
    const key = (month: number, day: number) => toDateKey(new Date(y, month - 1, day))
    return {
      [key(1, 1)]: "New Year",
      [key(2, 14)]: "Valentine",
      [key(7, 4)]: "Holiday",
      [key(12, 25)]: "Christmas",
    } as Record<string, string>
  }, [currentDate])

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = window.localStorage.getItem(NOTES_STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as CalendarNote[]
      if (Array.isArray(parsed)) setNotes(parsed)
    } catch {
      setNotes([])
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = window.localStorage.getItem(EVENTS_STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as CalendarEvent[]
      if (!Array.isArray(parsed)) return
      setEvents(
        parsed.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        })),
      )
    } catch {
      setEvents(initialEvents)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events))
  }, [events])

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = window.localStorage.getItem(RANGE_STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as { start: string | null; end: string | null }
      setSelectedRange({
        start: parsed.start ? new Date(parsed.start) : null,
        end: parsed.end ? new Date(parsed.end) : null,
      })
    } catch {
      setSelectedRange({ start: null, end: null })
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(
      RANGE_STORAGE_KEY,
      JSON.stringify({
        start: selectedRange.start ? selectedRange.start.toISOString() : null,
        end: selectedRange.end ? selectedRange.end.toISOString() : null,
      }),
    )
  }, [selectedRange])

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (!saved) return
    setIsDark(saved === "dark")
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light")
  }, [isDark])

  const goToday = () => setCurrentDate(startOfDay(new Date()))
  const shiftDate = (delta: number) => {
    setNavDirection(delta >= 0 ? 1 : -1)
    const next = new Date(currentDate)
    if (view === "month") next.setMonth(next.getMonth() + delta)
    else if (view === "week") next.setDate(next.getDate() + delta * 7)
    else next.setDate(next.getDate() + delta)
    setCurrentDate(startOfDay(next))
  }

  const onDateClick = (date: Date) => {
    setCurrentDate(startOfDay(date))
    setSelectedRange((prev) => {
      if (!prev.start || (prev.start && prev.end)) return { start: date, end: null }
      if (sameDay(prev.start, date)) return { start: null, end: null }
      if (date < prev.start) return { start: date, end: prev.start }
      return { start: prev.start, end: date }
    })
  }

  const openCreateModal = (date: Date) => {
    const start = new Date(date)
    start.setHours(9, 0, 0, 0)
    const end = new Date(date)
    end.setHours(10, 0, 0, 0)
    setEditingEvent({
      id: "",
      title: "",
      start,
      end,
      color: "blue",
    })
    setEditorOpen(true)
  }

  const upsertEvent = () => {
    if (!editingEvent || !editingEvent.title.trim()) return
    if (!editingEvent.id) {
      setEvents((prev) => [{ ...editingEvent, id: crypto.randomUUID() }, ...prev])
    } else {
      setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? editingEvent : e)))
    }
    setEditorOpen(false)
    setEditingEvent(null)
  }

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
    setEditorOpen(false)
    setEditingEvent(null)
  }

  const containerTheme = isDark
    ? "bg-zinc-950 text-zinc-100"
    : "bg-white text-zinc-900"

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event)
    setEditorOpen(true)
  }

  const handleDropToDate = (date: Date) => {
    if (!draggedEventId) return
    setEvents((prev) =>
      prev.map((ev) => (ev.id === draggedEventId ? moveEventToDate(ev, date) : ev)),
    )
    setDraggedEventId(null)
  }

  const handleDropToHour = (hour: number) => {
    if (!draggedEventId) return
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id !== draggedEventId) return ev
        const duration = ev.end.getTime() - ev.start.getTime()
        const start = new Date(currentDate)
        start.setHours(hour, 0, 0, 0)
        return { ...ev, start, end: new Date(start.getTime() + duration) }
      }),
    )
    setDraggedEventId(null)
  }

  const addNote = (dateKey: string, text: string) => {
    setNotes((prev) => [
      { id: crypto.randomUUID(), dateKey, text, createdAt: Date.now() },
      ...prev,
    ])
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className={`relative min-h-screen overflow-hidden p-4 sm:p-6 ${containerTheme}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`page-bg-${currentDate.getFullYear()}-${currentDate.getMonth()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none fixed inset-0 -z-10"
          style={{ mixBlendMode: "soft-light" }}
        >
          <svg viewBox="0 0 1600 1200" className="h-full w-full opacity-90">
            <defs>
              <radialGradient id="pageCurveA" cx="18%" cy="14%" r="62%">
                <stop offset="0%" stopColor={monthBlend[0]} />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
              <radialGradient id="pageCurveB" cx="86%" cy="20%" r="58%">
                <stop offset="0%" stopColor={monthBlend[1]} />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
              <radialGradient id="pageCurveC" cx="62%" cy="88%" r="70%">
                <stop offset="0%" stopColor={monthBlend[2]} />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>
            <path d="M-200,320 C160,40 520,40 860,250 C1120,410 1360,380 1760,160 L1760,1280 L-200,1280 Z" fill="url(#pageCurveA)" />
            <path d="M-40,760 C260,560 600,560 920,730 C1180,860 1420,860 1700,740 L1700,1280 L-40,1280 Z" fill="url(#pageCurveB)" />
            <path d="M-120,980 C220,760 620,800 980,980 C1260,1120 1480,1120 1760,1020 L1760,1280 L-120,1280 Z" fill="url(#pageCurveC)" />
          </svg>
        </motion.div>
      </AnimatePresence>
      <div className="mx-auto max-w-7xl rounded-[28px] border border-zinc-200/90 bg-white p-4 shadow-2xl shadow-black/10 dark:border-zinc-800 dark:bg-zinc-900/80 sm:p-6">
        <CalendarToolbar
          view={view}
          currentDate={currentDate}
          onChangeView={setView}
          onShiftDate={shiftDate}
          onToday={goToday}
          onToggleMiniMonth={() => setShowMiniMonth((s) => !s)}
        />
        <div className="mb-4 flex justify-end">
          <LightDarkToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:gap-5 xl:grid-cols-[300px,1fr,320px]">
          <aside className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/20 shadow-lg shadow-black/10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={monthTheme.image}
                  src={monthTheme.image}
                  alt="Scenic hero"
                  className="h-48 w-full object-cover sm:h-56 xl:h-64"
                  initial={{ opacity: 0.3, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.3, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent backdrop-blur-[1px]" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-white/80">Wall Calendar</p>
                <h2 className="text-xl font-semibold">Plan Beautifully</h2>
              </div>
            </div>
            {showMiniMonth && (
              <aside className="rounded-2xl border border-zinc-200/80 bg-white/85 p-3 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/55">
              <p className="mb-2 text-sm font-medium text-zinc-500">Mini Month</p>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="py-1 text-zinc-400">{d[0]}</div>
                ))}
                {monthGrid.map((d) => (
                  <button
                    key={d.toISOString()}
                    onClick={() => {
                      setNavDirection(d >= currentDate ? 1 : -1)
                      onDateClick(startOfDay(d))
                    }}
                    className={`rounded-md py-1 transition-all ${
                      (selectedRange.start && sameDay(d, selectedRange.start)) ||
                      (selectedRange.end && sameDay(d, selectedRange.end))
                        ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/35"
                        : inRange(d, selectedRange, hoveredDate)
                          ? "bg-gradient-to-r from-sky-300/60 via-cyan-200/55 to-blue-200/60 text-sky-900 shadow-[inset_0_0_0_1px_rgba(125,211,252,0.35)] dark:from-sky-800/40 dark:via-cyan-800/30 dark:to-blue-800/30 dark:text-sky-100"
                          : "hover:-translate-y-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {d.getDate()}
                  </button>
                ))}
              </div>
              </aside>
            )}
          </aside>

          <section className="relative overflow-hidden rounded-2xl border border-zinc-200/80 p-3 shadow-lg shadow-zinc-900/5 sm:p-4 dark:border-zinc-700">
            <AnimatePresence mode="wait">
              <motion.div
                key={`panel-${currentDate.getFullYear()}-${currentDate.getMonth()}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className={`absolute inset-0 bg-gradient-to-br ${monthTheme.panelGradient}`}
              />
            </AnimatePresence>
            <div className={`absolute inset-0 ${isDark ? "bg-zinc-900/48" : "bg-white/86"} backdrop-blur-[1px]`} />
            <AnimatePresence mode="wait">
              <motion.div
                key={`curve-${currentDate.getFullYear()}-${currentDate.getMonth()}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="pointer-events-none absolute inset-0 z-[1]"
                style={{ mixBlendMode: "soft-light" }}
              >
                <svg viewBox="0 0 1200 800" className="h-full w-full opacity-80">
                  <defs>
                    <radialGradient id="curveA" cx="18%" cy="20%" r="62%">
                      <stop offset="0%" stopColor={monthBlend[0]} />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>
                    <radialGradient id="curveB" cx="88%" cy="12%" r="58%">
                      <stop offset="0%" stopColor={monthBlend[1]} />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>
                    <radialGradient id="curveC" cx="62%" cy="88%" r="64%">
                      <stop offset="0%" stopColor={monthBlend[2]} />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>
                  </defs>
                  <path d="M-120,220 C140,10 420,30 680,180 C900,310 1120,280 1360,120 L1360,860 L-120,860 Z" fill="url(#curveA)" />
                  <path d="M20,520 C250,360 520,360 760,490 C980,610 1160,620 1320,520 L1320,860 L20,860 Z" fill="url(#curveB)" />
                  <path d="M-80,680 C180,520 450,560 760,680 C960,760 1110,760 1280,700 L1280,860 L-80,860 Z" fill="url(#curveC)" />
                </svg>
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={view + currentDate.toDateString()}
                initial={{ opacity: 0, y: 8, rotateX: navDirection > 0 ? -10 : 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -8, rotateX: navDirection > 0 ? 10 : -10 }}
                transition={{ duration: 0.24 }}
                style={{ transformPerspective: 1200 }}
                className="relative z-10"
              >
                {view === "month" && (
                  <MonthView
                    monthGrid={monthGrid}
                    currentDate={currentDate}
                    selectedRange={selectedRange}
                    hoveredDate={hoveredDate}
                    monthEvents={monthEvents}
                    onDateClick={onDateClick}
                    onDateHover={setHoveredDate}
                    onAddEvent={openCreateModal}
                    onEditEvent={openEditModal}
                    onDragStartEvent={setDraggedEventId}
                    onDropEvent={handleDropToDate}
                    holidays={holidays}
                  />
                )}

                {view === "week" && (
                  <WeekView
                    weekDays={weekDays}
                    events={events}
                    holidays={holidays}
                    onDateClick={onDateClick}
                    onEditEvent={openEditModal}
                    onDragStartEvent={setDraggedEventId}
                    onDropEvent={handleDropToDate}
                  />
                )}

                {view === "day" && (
                  <DayView
                    currentDate={currentDate}
                    events={events}
                    holidays={holidays}
                    onEditEvent={openEditModal}
                    onDragStartEvent={setDraggedEventId}
                    onDropEventAtHour={handleDropToHour}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </section>

          <NotesPanel
            notes={notes}
            currentDate={currentDate}
            selectedDate={selectedDate}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
          />
        </div>
      </div>

      <EventEditorModal
        open={editorOpen}
        editingEvent={editingEvent}
        onClose={() => {
          setEditorOpen(false)
          setEditingEvent(null)
        }}
        onChange={setEditingEvent}
        onSave={upsertEvent}
        onDelete={deleteEvent}
      />
    </div>
  )
}
