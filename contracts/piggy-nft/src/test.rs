#![cfg(test)]
extern crate std;

use crate::{ItemMeta, PiggyNFT, PiggyNFTClient};
use soroban_sdk::{symbol_short, testutils::Address as _, Address, Env, String};

fn setup() -> (Env, Address, Address, Address, PiggyNFTClient<'static>) {
    let env = Env::default();
    env.mock_all_auths(); // every require_auth() succeeds
    let admin = Address::generate(&env);
    let alice = Address::generate(&env);
    let bob = Address::generate(&env);
    let contract_id = env.register(
        PiggyNFT,
        (
            admin.clone(),
            String::from_str(&env, "Piggy City Items"),
            String::from_str(&env, "PIGGY"),
            String::from_str(&env, "ipfs://piggy-base/"),
        ),
    );
    let client = PiggyNFTClient::new(&env, &contract_id);
    (env, admin, alice, bob, client)
}

// --- Acceptance criterion #20: mint one item of each kind ---
#[test]
fn mint_one_of_each_kind() {
    let (env, _admin, alice, _bob, c) = setup();
    for (id, kind, cat) in [
        (1u32, symbol_short!("skin"), "skin_001"),
        (2u32, symbol_short!("furni"), "sofa_001"),
        (3u32, symbol_short!("breed"), "cat_breed"),
    ] {
        c.mint(
            &alice,
            &id,
            &kind,
            &String::from_str(&env, cat),
            &String::from_str(&env, "item"),
            &String::from_str(&env, "ipfs://x"),
        );
    }
    assert_eq!(c.balance(&alice), 3);
    assert_eq!(c.owner_of(&1), alice);
    assert_eq!(c.owner_of(&3), alice);
    let meta = c.item_meta(&2);
    assert_eq!(
        meta,
        ItemMeta {
            kind: symbol_short!("furni"),
            catalog_id: String::from_str(&env, "sofa_001"),
            name: String::from_str(&env, "item"),
            image: String::from_str(&env, "ipfs://x"),
        }
    );
    assert_eq!(c.items().len(), 3);
    // Collection metadata flows through the trait: token_uri is base + id.
    assert_eq!(
        c.token_uri(&1),
        String::from_str(&env, "ipfs://piggy-base/1")
    );
}

// --- Acceptance criterion #20: transfer between two accounts ---
#[test]
fn transfer_between_two_accounts() {
    let (env, _admin, alice, bob, c) = setup();
    c.mint(
        &alice,
        &1,
        &symbol_short!("skin"),
        &String::from_str(&env, "skin_001"),
        &String::from_str(&env, "Captain Pig"),
        &String::from_str(&env, "ipfs://s.png"),
    );
    c.transfer(&alice, &bob, &1); // signed by alice
    assert_eq!(c.owner_of(&1), bob);
    assert_eq!(c.balance(&alice), 0);
    assert_eq!(c.balance(&bob), 1);
}

// --- Negative cases ---
#[test]
#[should_panic(expected = "Error(Contract, #200)")] // OZ NonFungibleToken::TokenNotFound
fn owner_of_unknown_token_panics() {
    let (_env, _a, _al, _b, c) = setup();
    c.owner_of(&999);
}

#[test]
#[should_panic(expected = "Error(Contract, #2)")] // our Error::TokenNotFound
fn item_meta_of_unknown_token_panics() {
    let (_env, _a, _al, _b, c) = setup();
    c.item_meta(&999);
}

#[test]
#[should_panic(expected = "Error(Contract, #3)")] // InvalidKind
fn mint_rejects_unknown_kind() {
    let (env, _admin, alice, _bob, c) = setup();
    c.mint(
        &alice,
        &1,
        &symbol_short!("hat"),
        &String::from_str(&env, "x"),
        &String::from_str(&env, "x"),
        &String::from_str(&env, "ipfs://x"),
    );
}

#[test]
#[should_panic(expected = "Auth")]
fn mint_without_auth_fails() {
    // IMPORTANT: no mock_all_auths here.
    let env = Env::default();
    let admin = Address::generate(&env);
    let cid = env.register(
        PiggyNFT,
        (
            admin,
            String::from_str(&env, "n"),
            String::from_str(&env, "s"),
            String::from_str(&env, "ipfs://b/"),
        ),
    );
    let c = PiggyNFTClient::new(&env, &cid);
    c.mint(
        &Address::generate(&env),
        &1,
        &symbol_short!("skin"),
        &String::from_str(&env, "k"),
        &String::from_str(&env, "n"),
        &String::from_str(&env, "i"),
    );
}