"use client"

import { useState } from "react"
import { NeighborhoodMap } from "@/components/neighborhood-map"
import { HouseVisit } from "@/components/house-visit"

export default function Home() {
  const [visitingAddress, setVisitingAddress] = useState<string | null>(null)

  return (
    <>
      <NeighborhoodMap onVisitFriend={setVisitingAddress} />
      {visitingAddress && (
        <HouseVisit
          initialAddress={visitingAddress}
          onClose={() => setVisitingAddress(null)}
        />
      )}
    </>
  )
}
