"use client"

import { ViewMode } from "./types"
import { formatMonthYear } from "./date-utils"

type CalendarToolbarProps = {
  view: ViewMode
  currentDate: Date
  onChangeView: (view: ViewMode) => void
  onShiftDate: (delta: number) => void
  onToday: () => void
  onToggleMiniMonth: () => void
}

export function CalendarToolbar({
  view,
  currentDate,
  onChangeView,
  onShiftDate,
  onToday,
  onToggleMiniMonth,
}: CalendarToolbarProps) {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Calendar</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Premium scheduling experience
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(["month", "week", "day"] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onChangeView(m)}
              className={`rounded-full px-4 py-2 text-sm capitalize transition-all ${
                view === m
                  ? "bg-zinc-900 text-white shadow-lg hover:scale-[1.03] dark:bg-white dark:text-zinc-900 dark:hover:bg-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {m}
            </button>
          ))}
          <button
            onClick={onToggleMiniMonth}
            className="rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Mini
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onShiftDate(-1)}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Prev
          </button>
          <button
            onClick={onToday}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm text-white shadow-lg shadow-indigo-500/25"
          >
            Today
          </button>
          <button
            onClick={() => onShiftDate(1)}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Next
          </button>
        </div>
        <div className="text-lg font-medium">{formatMonthYear(currentDate)}</div>
      </div>
    </>
  )
}
