export interface Pet {
  id: string
  name: string
  emoji: string
  cost: number
  isNft?: boolean
}

export const PETS: Pet[] = [
  { id: "pet_dog", name: "Perrito", emoji: "🐶", cost: 20, isNft: true },
  { id: "pet_cat", name: "Gatito", emoji: "🐱", cost: 20, isNft: true },
  { id: "pet_bird", name: "Pajarito", emoji: "🐦", cost: 15, isNft: true },
  { id: "pet_turtle", name: "Tortuga", emoji: "🐢", cost: 25, isNft: true },
]

export const findPet = (id: string | null): Pet | null =>
  id ? PETS.find((p) => p.id === id) ?? null : null
