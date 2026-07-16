export interface Furniture {
  id: string
  name: string
  emoji: string
  cost: number
  isNft?: boolean
}

export const FURNITURE: Furniture[] = [
  { id: "furn_bed", name: "Cama", emoji: "🛏️", cost: 15, isNft: true },
  { id: "furn_lamp", name: "Lámpara", emoji: "🛋️", cost: 10, isNft: true },
  { id: "furn_plant", name: "Planta", emoji: "🪴", cost: 8, isNft: true },
  { id: "furn_tv", name: "Televisor", emoji: "📺", cost: 25, isNft: true },
  { id: "furn_rug", name: "Alfombra", emoji: "🧶", cost: 5, isNft: true },
]

export const findFurniture = (id: string | null): Furniture | null =>
  id ? FURNITURE.find((f) => f.id === id) ?? null : null
