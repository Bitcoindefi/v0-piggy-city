"use client"

import { useState } from "react"
import { X, Coins, Check, Sparkles } from "lucide-react"
import { ACCESSORIES, findAccessory } from "@/lib/accessories"
import { SKINS, findSkin } from "@/lib/skins"
import { FURNITURE } from "@/lib/furniture"
import { PETS, findPet } from "@/lib/pets"

type Tab = "accessories" | "skins" | "furniture" | "pets"

interface ShopProps {
  wallet: number
  owned: string[]
  equippedAccessory: string | null
  equippedSkin: string | null
  equippedPet: string | null
  onBuy: (id: string) => void
  onEquipAccessory: (id: string) => void
  onUnequipAccessory: () => void
  onEquipSkin: (id: string) => void
  onUnequipSkin: () => void
  onEquipPet: (id: string) => void
  onEquipPet: (id: string) => void
  onUnequipPet: () => void
  onClose: () => void
  walletAddress: string | null
  onMint: (id: string, cost: number) => void
  isMinting: boolean
}

export function Shop({
  wallet,
  owned,
  equippedAccessory,
  equippedSkin,
  equippedPet,
  onBuy,
  onEquipAccessory,
  onUnequipAccessory,
  onEquipSkin,
  onUnequipSkin,
  onEquipPet,
  onUnequipPet,
  onClose,
  walletAddress,
  onMint,
  isMinting,
}: ShopProps) {
  const [activeTab, setActiveTab] = useState<Tab>("accessories")

  const tabs: { id: Tab; label: string }[] = [
    { id: "accessories", label: "Accesorios" },
    { id: "skins", label: "Skins" },
    { id: "furniture", label: "Muebles" },
    { id: "pets", label: "Adopción" },
  ]

  const renderItems = () => {
    let items: any[] = []
    let onEquip: (id: string) => void = () => {}
    let onUnequip: () => void = () => {}
    let equippedState: string | null = null

    if (activeTab === "accessories") {
      items = ACCESSORIES
      equippedState = equippedAccessory
      onEquip = onEquipAccessory
      onUnequip = onUnequipAccessory
    } else if (activeTab === "skins") {
      items = SKINS
      equippedState = equippedSkin
      onEquip = onEquipSkin
      onUnequip = onUnequipSkin
    } else if (activeTab === "furniture") {
      items = FURNITURE
      equippedState = null // Furniture is just owned for now in this view
      onEquip = () => {}
      onUnequip = () => {}
    } else if (activeTab === "pets") {
      items = PETS
      equippedState = equippedPet
      onEquip = onEquipPet
      onUnequip = onUnequipPet
    }

    return (
      <div style={{ padding: 10, overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {items.map((item) => {
          const isOwned = owned.includes(item.id)
          const isEquipped = equippedState === item.id
          const canAfford = wallet >= item.cost
          const isFurniture = activeTab === "furniture"
          // Muebles: just owned. Others: equipped.
          const isSelected = isFurniture ? isOwned : isEquipped

          return (
            <div
              key={item.id}
              style={{
                background: isSelected ? "#fff3d6" : "#fbf6ea",
                border: `3px solid ${isSelected ? "#b45309" : "#8d6e63"}`,
                borderRadius: 6,
                padding: "8px 8px 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                boxShadow: "0 3px 0 #3e2723",
                position: "relative",
              }}
            >
              {/* NFT Badge - visually present as requested */}
              {item.isNft && (
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    background: "#7b3fbe",
                    color: "white",
                    fontSize: 7,
                    fontWeight: 900,
                    padding: "2px 4px",
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Sparkles style={{ width: 8, height: 8 }} />
                  NFT
                </div>
              )}

              <div style={{ fontSize: 30, lineHeight: 1 }}>
                {activeTab === "skins" ? (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#e0d6c4",
                      overflow: "hidden",
                      position: "relative",
                      filter: item.filter !== "none" ? item.filter : "none",
                    }}
                  >
                    <img
                      src="/sprites/front-1.png"
                      alt="Skin Preview"
                      style={{ width: "200%", position: "absolute", top: -10, left: -20, imageRendering: "pixelated" }}
                    />
                  </div>
                ) : (
                  item.emoji
                )}
              </div>
              <div style={{ fontWeight: 800, fontSize: 11, color: "#4e342e", textAlign: "center" }}>{item.name}</div>

              {!isOwned ? (
                item.isNft && !walletAddress ? (
                  <button
                    disabled
                    style={{
                      marginTop: 2,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                      background: "#c62828", color: "#fff8e1",
                      border: "2px solid #4e342e", borderRadius: 4,
                      padding: "3px 10px", fontSize: 10, fontWeight: 800,
                      cursor: "not-allowed", opacity: 0.8,
                      boxShadow: "0 2px 0 #3e2723",
                    }}
                  >
                    🔒 Wallet
                  </button>
                ) : item.isNft && walletAddress ? (
                  <button
                    onClick={() => canAfford && !isMinting && onMint(item.id, item.cost)}
                    disabled={!canAfford || isMinting}
                    style={{
                      marginTop: 2,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                      background: (canAfford && !isMinting) ? "#7b3fbe" : "#e0d6c4",
                      color: (canAfford && !isMinting) ? "white" : "#4e342e",
                      border: "2px solid #4e342e", borderRadius: 4,
                      padding: "3px 10px", fontSize: 10, fontWeight: 800,
                      cursor: (canAfford && !isMinting) ? "pointer" : "not-allowed",
                      opacity: (canAfford && !isMinting) ? 1 : 0.6,
                      boxShadow: "0 2px 0 #3e2723",
                    }}
                  >
                    <Sparkles style={{ width: 10, height: 10 }} />
                    Mint
                  </button>
                ) : (
                  <button
                    onClick={() => canAfford && onBuy(item.id)}
                    disabled={!canAfford}
                    style={{
                      marginTop: 2,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                      background: canAfford ? "#ffcc02" : "#e0d6c4",
                      color: "#4e342e",
                      border: "2px solid #4e342e",
                      borderRadius: 4,
                      padding: "3px 10px",
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: canAfford ? "pointer" : "not-allowed",
                      opacity: canAfford ? 1 : 0.6,
                      boxShadow: "0 2px 0 #3e2723",
                    }}
                  >
                    <Coins style={{ width: 12, height: 12 }} strokeWidth={2.5} />
                    {item.cost}
                  </button>
                )
              ) : isFurniture ? (
                <div
                  style={{
                    marginTop: 2,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
                    background: "#e0d6c4", color: "#4e342e",
                    border: "2px solid #8d6e63", borderRadius: 4,
                    padding: "3px 10px", fontSize: 10, fontWeight: 800,
                    opacity: 0.8,
                  }}
                >
                  <Check style={{ width: 12, height: 12 }} strokeWidth={3} />
                  En inventario
                </div>
              ) : isEquipped ? (
                <button
                  onClick={onUnequip}
                  style={{
                    marginTop: 2,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
                    background: "#b45309", color: "#fff8e1",
                    border: "2px solid #4e342e", borderRadius: 4,
                    padding: "3px 10px", fontSize: 10, fontWeight: 800, cursor: "pointer",
                    boxShadow: "0 2px 0 #3e2723",
                  }}
                >
                  <Check style={{ width: 12, height: 12 }} strokeWidth={3} />
                  Quitar
                </button>
              ) : (
                <button
                  onClick={() => onEquip(item.id)}
                  style={{
                    marginTop: 2,
                    background: "#2d8a4e", color: "#fff8e1",
                    border: "2px solid #4e342e", borderRadius: 4,
                    padding: "3px 12px", fontSize: 10, fontWeight: 800, cursor: "pointer",
                    boxShadow: "0 2px 0 #3e2723",
                  }}
                >
                  Equipar
                </button>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Previews
  const currentAccessory = findAccessory(equippedAccessory)
  const currentSkin = findSkin(equippedSkin)
  const currentPet = findPet(equippedPet)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(20,12,6,0.82)" }}
      onClick={onClose}
    >
      <div
        className="relative flex"
        style={{
          width: "min(96vw, 600px)",
          height: "min(85vh, 480px)",
          border: "5px solid #4e342e",
          borderRadius: "6px",
          background: "#fffdf6",
          boxShadow: "inset -4px -4px 0 #3e2723, inset 4px 4px 0 #8d6e63, 0 12px 48px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Preview */}
        <div
          style={{
            width: "35%",
            background: "#8fc09a",
            borderRight: "4px solid #4e342e",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ position: "absolute", top: 12, left: 12, color: "#fff8e1", fontWeight: 900, textShadow: "1px 1px 0 #3e2723", fontSize: 16 }}>
            Preview
          </div>
          
          <div style={{ position: "relative", width: 120, height: 120, marginTop: 20 }}>
            <img
              src="/sprites/front-1.png"
              alt="Piggy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                imageRendering: "pixelated",
                filter: currentSkin && currentSkin.filter !== "none" ? currentSkin.filter : "none",
              }}
            />
            {currentAccessory && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: `${-10 + (currentAccessory.offsetY ?? 0)}%`,
                  width: "70%",
                  height: "50%",
                  transform: "translateX(-50%)",
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 48 }}>{currentAccessory.emoji}</span>
              </div>
            )}
            {currentPet && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: -30,
                  fontSize: 32,
                  animation: "walk-bounce 0.8s ease-in-out infinite",
                }}
              >
                {currentPet.emoji}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Shop Tabs & Items */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Title bar */}
          <div
            style={{
              background: "#5d4037",
              borderBottom: "4px solid #4e342e",
              boxShadow: "inset 0 -2px 0 #3e2723, inset 0 2px 0 #8d6e63",
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ color: "#fff8e1", fontWeight: 800, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase" }}>
              Tienda de Piggy
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "#fffdf6", border: "2px solid #4e342e", borderRadius: 3,
                  padding: "2px 8px", fontWeight: 900, color: "#b45309", fontSize: 12,
                }}
              >
                <Coins style={{ width: 13, height: 13 }} strokeWidth={2.5} />
                {wallet}
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar tienda"
                style={{
                  background: "#c62828", border: "3px solid #4e342e", borderRadius: 3,
                  width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", boxShadow: "inset -2px -2px 0 #b71c1c, inset 2px 2px 0 #ef5350", flexShrink: 0,
                }}
              >
                <X style={{ width: 13, height: 13, color: "#fff8e1" }} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              background: "#e0d6c4",
              borderBottom: "3px solid #4e342e",
              overflowX: "auto",
              flexShrink: 0,
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "8px 12px",
                  fontWeight: 900,
                  fontSize: 11,
                  textTransform: "uppercase",
                  color: activeTab === tab.id ? "#4e342e" : "#8d6e63",
                  background: activeTab === tab.id ? "#fffdf6" : "transparent",
                  borderBottom: activeTab === tab.id ? "3px solid #b45309" : "3px solid transparent",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Items */}
          {renderItems()}
        </div>
      </div>
    </div>
  )
}
