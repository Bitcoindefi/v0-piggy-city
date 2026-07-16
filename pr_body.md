**Description**
This PR evolves the current pet shop into a full-featured Pet Society style store, expanding beyond just accessories to support character skins, room furniture, and adoptable pets!

**Scope & Changes Included**
*   **Tabs & Categories**: Rebuilt the `components/shop.tsx` modal to include four tabs: `Accesorios`, `Skins`, `Muebles`, and `Adopción`. 
*   **Data Models**: Created dedicated libraries for the new item types (`lib/skins.ts`, `lib/furniture.ts`, `lib/pets.ts`) modeled after the existing accessories architecture.
*   **Live Preview**: Added a real-time character preview to the left of the shop modal. It visually updates to show the selected skin and pet before purchasing.
*   **NFT Badges**: Rendered visual "NFT" badges over the items in the shop as a step toward on-chain minting readiness (Issue 22).
*   **State Persistence**: Updated `GameSave` within `lib/game-storage.ts` to persistently track `equippedSkin` and `equippedPet` states without breaking backwards compatibility.
*   **Map Rendering**: Updated `components/neighborhood-map.tsx` to handle generic item purchases, dynamically apply CSS skin filters to Piggy, and render an equipped pet companion that follows Piggy around.

**Aceptación / QA**
*   [x] Open the shop and verify all 4 tabs load correctly.
*   [x] Purchase and equip a skin, and verify the live preview and in-game sprite change correctly.
*   [x] Purchase and equip a pet, and verify the pet sprite follows Piggy on the map.
*   [x] Purchase furniture and verify it says "En inventario".

🎬 **Demo Video Required**
*Reminder: A screen recording demonstrating the end-to-end feature must be attached to this PR before review.*
