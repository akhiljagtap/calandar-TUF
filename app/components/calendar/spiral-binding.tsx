"use client"

export function SpiralBinding() {
  const spirals = Array.from({ length: 15 }, (_, i) => i)
  
  return (
    <div className="relative w-full h-8 bg-gradient-to-b from-zinc-300 to-zinc-200 flex items-center justify-center overflow-hidden shadow-md">
      {/* Main bar */}
      <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-zinc-400 via-zinc-300 to-zinc-400" />
      
      {/* Spiral rings */}
      <div className="relative z-10 flex items-center justify-around w-full px-4">
        {spirals.map((i) => (
          <div 
            key={i} 
            className="relative"
          >
            {/* Ring outer */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-700 shadow-lg flex items-center justify-center">
              {/* Ring inner hole */}
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
            </div>
            {/* Ring shadow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-sm" />
          </div>
        ))}
      </div>
      
      {/* Top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/50" />
      
      {/* Bottom edge shadow */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/20" />
    </div>
  )
}
