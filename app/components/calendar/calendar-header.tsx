"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MONTH_NAMES, MONTH_IMAGES } from "@/lib/calendar-utils"
import { useState } from "react"

interface CalendarHeaderProps {
  year: number
  month: number
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}

export function CalendarHeader({ 
  year, 
  month, 
  onPrevMonth, 
  onNextMonth,
  onToday 
}: CalendarHeaderProps) {
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next')

  const handlePrevMonth = () => {
    setFlipDirection('prev')
    setIsFlipping(true)
    setTimeout(() => {
      onPrevMonth()
      setIsFlipping(false)
    }, 300)
  }

  const handleNextMonth = () => {
    setFlipDirection('next')
    setIsFlipping(true)
    setTimeout(() => {
      onNextMonth()
      setIsFlipping(false)
    }, 300)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Hero Image with curved bottom */}
      <div 
        className={`relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden transition-transform duration-300 ease-out ${
          isFlipping 
            ? flipDirection === 'next' 
              ? '-translate-y-4 opacity-80' 
              : 'translate-y-4 opacity-80'
            : ''
        }`}
      >
        <img
          src={MONTH_IMAGES[month]}
          alt={`${MONTH_NAMES[month]} scenery`}
          className="w-full h-full object-cover"
        />
        
        {/* Curved overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none" 
            className="w-full h-16 sm:h-20"
          >
            <path 
              d="M0,120 L0,60 Q600,0 1200,60 L1200,120 Z" 
              fill="white"
            />
          </svg>
        </div>
        
        {/* Month/Year overlay */}
        <div className="absolute bottom-8 right-4 sm:right-8 text-right z-10">
          <div className="text-primary font-bold text-2xl sm:text-3xl md:text-4xl tracking-wide">
            {year}
          </div>
          <div className="text-primary font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight uppercase">
            {MONTH_NAMES[month]}
          </div>
        </div>
      </div>
      
      {/* Navigation Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
        <Button
          variant="secondary"
          size="icon"
          onClick={handlePrevMonth}
          className="bg-white/90 hover:bg-white shadow-md backdrop-blur-sm"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={onToday}
          className="bg-white/90 hover:bg-white shadow-md backdrop-blur-sm font-medium"
        >
          Today
        </Button>
        
        <Button
          variant="secondary"
          size="icon"
          onClick={handleNextMonth}
          className="bg-white/90 hover:bg-white shadow-md backdrop-blur-sm"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
