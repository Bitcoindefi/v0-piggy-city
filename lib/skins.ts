export interface Skin {
  id: string
  name: string
  cost: number
  // Since sprites are fixed in code, a skin could be a CSS filter or just an id we match in the character component
  filter: string
  isNft?: boolean
}

export const SKINS: Skin[] = [
  { id: "skin_default", name: "Original", cost: 0, filter: "none" },
  { id: "skin_gold", name: "Dorado", cost: 50, filter: "sepia(1) saturate(5) hue-rotate(5deg) brightness(1.2)", isNft: true },
  { id: "skin_ghost", name: "Fantasma", cost: 30, filter: "grayscale(1) opacity(0.7) brightness(1.5)", isNft: true },
  { id: "skin_alien", name: "Alien", cost: 40, filter: "hue-rotate(90deg) saturate(2)", isNft: true },
  { id: "skin_shadow", name: "Sombra", cost: 60, filter: "brightness(0.2) contrast(2)", isNft: true },
]

export const findSkin = (id: string | null): Skin | null =>
  id ? SKINS.find((s) => s.id === id) ?? null : null
