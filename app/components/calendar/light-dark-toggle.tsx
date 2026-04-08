"use client"

type LightDarkToggleProps = {
  isDark: boolean
  onToggle: () => void
}

export function LightDarkToggle({ isDark, onToggle }: LightDarkToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:scale-[1.02] hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  )
}
