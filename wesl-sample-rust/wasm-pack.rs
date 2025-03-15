#!/usr/bin/env cargo
---cargo
[package]
edition = "2024"
[dependencies]
wasm-pack = "0.13.1"
env_logger = "0.11.7"
clap = { version = "4.5.32", default-features = false }
---

// Copied from https://github.com/rustwasm/wasm-pack/blob/master/src/main.rs
use wasm_pack::{Cli, PBAR, command::run_wasm_pack};
use clap::Parser;

/// Can be executed on nightly Rust with
/// `cargo +nightly -Zscript wasm-pack.rs`
fn main() {
    env_logger::init();

    let args = Cli::parse();

    PBAR.set_log_level(args.log_level);

    if args.quiet {
        PBAR.set_quiet(true);
    }

    run_wasm_pack(args.cmd).unwrap();
}
