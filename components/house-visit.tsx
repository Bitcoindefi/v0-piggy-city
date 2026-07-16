"use client"

import { useEffect, useState } from "react"
import { X, Search } from "lucide-react"
import { type FriendData, fetchFriendData } from "@/lib/social"
import { findAccessory } from "@/lib/accessories"

const GRID_COLS = 24
const GRID_ROWS = 18
const SPRITE_SIZE = 100

// We use the same walk sheets for the character
const WALK_SHEETS = {
  down: "/piggy-walk-front.png",
} as const

interface HouseVisitProps {
  initialAddress: string
  onClose: () => void
}

export function HouseVisit({ initialAddress, onClose }: HouseVisitProps) {
  const [address, setAddress] = useState(initialAddress)
  const [searchInput, setSearchInput] = useState(initialAddress)
  const [friendData, setFriendData] = useState<FriendData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchFriendData(address).then((data) => {
      if (mounted) {
        setFriendData(data)
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [address])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setAddress(searchInput.trim())
    }
  }

  const cellW = 100 / GRID_COLS
  const cellH = 100 / GRID_ROWS

  // Fixed position for the friend's piggy in their house
  const piggyX = 12
  const piggyY = 9
  const piggyScreenX = piggyX * cellW + cellW / 2
  const piggyScreenY = piggyY * cellH + cellH / 2

  const equippedAccessory = findAccessory(friendData?.equippedSkin ?? null)

  return (
    <div className="fixed inset-0 overflow-hidden bg-black flex items-center justify-center touch-none z-[100]">
      {/* Inner map container (16:9 ratio) */}
      <div
        className="relative"
        style={{
          width: "min(100vw, calc(100vh * (24/18)))",
          height: "min(100vh, calc(100vw * (18/24)))",
          flexShrink: 0,
        }}
      >
        {/* Room Background (wooden floor style) */}
        <div
          className="absolute inset-0"
          style={{
            background: "#d4a373", // Base wood color
            backgroundImage: "linear-gradient(90deg, #c49563 50%, transparent 50%), linear-gradient(rgba(255,255,255,.1) 50%, transparent 50%)",
            backgroundSize: "60px 20px", // Planks
          }}
        />

        {/* Walls */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: "25%",
            background: "#faedcd",
            borderBottom: "8px solid #ccd5ae",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
          }}
        />

        {/* Furniture rendering */}
        {friendData?.layout.map((item) => (
          <div
            key={item.id}
            className="absolute flex items-center justify-center"
            style={{
              left: `${item.x * cellW}%`,
              top: `${item.y * cellH}%`,
              width: `${cellW * 2}%`,
              height: `${cellH * 2}%`,
              transform: "translate(-50%, -50%)",
              fontSize: "clamp(24px, 4vw, 48px)",
              zIndex: item.y, // Basic depth sorting
              filter: "drop-shadow(0 8px 4px rgba(0,0,0,0.25))",
            }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Friend's Piggy Sprite */}
        {!loading && friendData && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${piggyScreenX}%`,
              top: `${piggyScreenY}%`,
              width: `${cellW * 2}%`,
              height: `${cellH * 2}%`,
              transform: "translate(-50%, -62%)",
              zIndex: piggyY,
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "8%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "46%",
                height: "12%",
                background: "rgba(0,0,0,0.28)",
                borderRadius: "50%",
                filter: "blur(2px)",
              }}
            />
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
              <img
                src={WALK_SHEETS.down}
                alt="Friend Piggy"
                draggable={false}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: "400%",
                  maxWidth: "none",
                  imageRendering: "pixelated",
                  userSelect: "none",
                  transform: "translateX(-50%)", // Standing frame
                }}
              />
            </div>
            {equippedAccessory && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: `${-2 + (equippedAccessory.offsetY ?? 0)}%`,
                  width: "60%",
                  height: "45%",
                  transform: "translateX(-50%)",
                  pointerEvents: "none",
                }}
              >
                <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: "block", overflow: "visible" }}>
                  <text x="50" y="74" textAnchor="middle" fontSize="74">{equippedAccessory.emoji}</text>
                </svg>
              </div>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-[110]">
            <div className="bg-white px-6 py-4 rounded-lg border-4 border-[#4e342e] shadow-[0_4px_0_#4e342e] font-bold text-[#4e342e]">
              Cargando casa...
            </div>
          </div>
        )}

        {/* Top HUD: Search & Close */}
        <div
          className="absolute z-[120] pointer-events-none"
          style={{
            top: "clamp(10px, 2.5vw, 14px)",
            left: "clamp(10px, 2.5vw, 14px)",
            right: "clamp(10px, 2.5vw, 14px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* Search form */}
          <form
            onSubmit={handleSearch}
            className="pointer-events-auto flex gap-2"
            style={{
              background: "#fffdf6",
              border: "3px solid #4e342e",
              borderRadius: "4px",
              padding: "4px 8px",
              boxShadow: "0 3px 0 #3e2723",
            }}
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Address Stellar..."
              className="bg-transparent outline-none text-[12px] font-bold text-[#4e342e] w-[140px] sm:w-[200px]"
            />
            <button type="submit" className="text-[#b45309] hover:scale-110 transition-transform">
              <Search size={16} strokeWidth={3} />
            </button>
          </form>

          {/* Close button */}
          <button
            onClick={onClose}
            className="pointer-events-auto flex items-center justify-center"
            style={{
              background: "#c62828",
              border: "3px solid #4e342e",
              borderRadius: "4px",
              width: "32px",
              height: "32px",
              boxShadow: "inset -2px -2px 0 #b71c1c, inset 2px 2px 0 #ef5350, 0 3px 0 #3e2723",
              cursor: "pointer",
            }}
            aria-label="Volver al vecindario"
          >
            <X style={{ width: 16, height: 16, color: "#fff8e1" }} strokeWidth={3} />
          </button>
        </div>

        {/* Bottom indicator */}
        {!loading && friendData && (
          <div
            className="absolute bottom-[20px] left-[50%] -translate-x-[10%] bg-[#fffdf6] border-[3px] border-[#4e342e] rounded text-[12px] font-bold text-[#b45309] px-4 py-2 shadow-[0_3px_0_#3e2723]"
          >
            Visitando la casa de: {friendData.address.slice(0, 4)}...{friendData.address.slice(-4)}
          </div>
        )}
      </div>
    </div>
  )
}
