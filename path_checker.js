require("dotenv").config()
const ethers = require("ethers");
const fs = require("fs");

const PROVIDER_URL = process.env.PROVIDER_URL;
const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

const seedPhrase = "bird love have turkey wheat favorite observe fox curtain defy lecture figure";
const maxIndex = 100; // number of addresses per path to check


// Create root wallet from mnemonic
const root = ethers.HDNodeWallet.fromPhrase(seedPhrase);

// Derivation paths (without leading "m/")
const derivationPaths = [
  "44'/60'/0'/0/", // standard
  "44'/60'/0'/",   // Ledger
  "44'/60'/",      // MetaMask alternative
];

async function checkWallets() {
  for (const base of derivationPaths) {
    console.log(`\nChecking base path: ${base}*`);
    for (let i = 0; i < maxIndex; i++) {
      const path = base + i; // relative path
      try {
        const wallet = root.derivePath(path); 
        const address = wallet.address;
        const balance = await provider.getBalance(address);
        console.log(`${path} -> ${address} | ETH: ${ethers.formatEther(balance)}`);
      } catch (err) {
        console.log(`❌ Error deriving ${path}: ${err.message}`);
      }
    }
  }
}

checkWallets();

