export interface FurnitureItem {
  id: string
  type: "bed" | "chair" | "table" | "plant" | "rug" | "tv"
  x: number
  y: number
  emoji: string
}

export interface FriendData {
  address: string
  equippedSkin: string | null
  layout: FurnitureItem[]
}

// Mock on-chain/storage data for the MVP
const MOCK_FRIENDS: Record<string, FriendData> = {
  // Wallet A (Stellar address mock)
  "GA7Y2N4B6Z7K": {
    address: "GA7Y2N4B6Z7K",
    equippedSkin: "tophat",
    layout: [
      { id: "f1", type: "bed", x: 12, y: 5, emoji: "🛏️" },
      { id: "f2", type: "rug", x: 12, y: 7, emoji: "🟪" },
      { id: "f3", type: "plant", x: 6, y: 4, emoji: "🌿" },
      { id: "f4", type: "table", x: 18, y: 9, emoji: "🪑" },
      { id: "f5", type: "tv", x: 18, y: 8, emoji: "📺" },
    ],
  },
  // Wallet B
  "GB5M4X6R8T9V": {
    address: "GB5M4X6R8T9V",
    equippedSkin: "flower",
    layout: [
      { id: "f1", type: "bed", x: 8, y: 6, emoji: "🛏️" },
      { id: "f2", type: "plant", x: 10, y: 6, emoji: "🌱" },
      { id: "f3", type: "chair", x: 15, y: 10, emoji: "🛋️" },
    ],
  },
}

export async function fetchFriendData(address: string): Promise<FriendData | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600))
  
  // Return the friend if found, or a generic mock house if not
  if (MOCK_FRIENDS[address]) {
    return MOCK_FRIENDS[address]
  }

  // Default fallback for any other address to easily test
  return {
    address,
    equippedSkin: "cap",
    layout: [
      { id: "f1", type: "rug", x: 12, y: 8, emoji: "🟧" },
      { id: "f2", type: "chair", x: 11, y: 8, emoji: "🪑" },
      { id: "f3", type: "chair", x: 13, y: 8, emoji: "🪑" },
    ],
  }
}
