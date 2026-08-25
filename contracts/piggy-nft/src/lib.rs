#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, symbol_short, Address,
    Env, Map, String, Symbol,
};
use stellar_tokens::non_fungible::{Base, NonFungibleToken};

#[contract]
pub struct PiggyNFT;

/// Per-item metadata required by issue #20: every game asset (skin,
/// furniture, breed companion) is an NFT whose payload names its catalog
/// entry and artwork.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ItemMeta {
    pub kind: Symbol,       // symbol_short!("skin") | ("furni") | ("breed")
    pub catalog_id: String, // item id from the shared shop catalog (#23)
    pub name: String,
    pub image: String, // ipfs://... or any URL the front end can render
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum Error {
    TokenNotFound = 2,
    InvalidKind = 3,
}

const ADMIN: Symbol = symbol_short!("ADMIN");
const ITEMS: Symbol = symbol_short!("ITEMS");

#[contractimpl]
impl PiggyNFT {
    pub fn __constructor(env: &Env, admin: Address, name: String, symbol: String, base_uri: String) {
        admin.require_auth();
        env.storage().instance().set(&ADMIN, &admin);
        // Collection level metadata: served through name()/symbol()/token_uri().
        Base::set_metadata(env, base_uri, name, symbol);
    }

    /// Authorized mint: only the admin may create items, and each item's
    /// metadata is written atomically with the mint itself.
    pub fn mint(
        env: &Env,
        to: Address,
        token_id: u32,
        kind: Symbol,
        catalog_id: String,
        name: String,
        image: String,
    ) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();
        if kind != symbol_short!("skin")
            && kind != symbol_short!("furni")
            && kind != symbol_short!("breed")
        {
            panic_with_error!(env, Error::InvalidKind);
        }
        Base::mint(env, &to, token_id);
        let mut items: Map<u32, ItemMeta> = env
            .storage()
            .instance()
            .get(&ITEMS)
            .unwrap_or_else(|| Map::new(env));
        items.set(token_id, ItemMeta { kind, catalog_id, name, image });
        env.storage().instance().set(&ITEMS, &items);
    }

    /// Read back the metadata of one item.
    pub fn item_meta(env: &Env, token_id: u32) -> ItemMeta {
        env.storage()
            .instance()
            .get::<Symbol, Map<u32, ItemMeta>>(&ITEMS)
            .and_then(|m| m.get(token_id))
            .unwrap_or_else(|| panic_with_error!(env, Error::TokenNotFound))
    }

    /// Every minted item, handy for front end indexing.
    pub fn items(env: &Env) -> Map<u32, ItemMeta> {
        env.storage()
            .instance()
            .get(&ITEMS)
            .unwrap_or_else(|| Map::new(env))
    }
}

// Auto-export the whole standard interface: transfer, transfer_from,
// owner_of, balance_of, approve, approve_for_all, get_approved,
// is_approved_for_all, name, symbol, token_uri.
#[contractimpl(contracttrait)]
impl NonFungibleToken for PiggyNFT {
    type ContractType = Base;
}

#[cfg(test)]
mod test;