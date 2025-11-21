// generate.js
// Generates 2000 unique 12-word BIP39 mnemonics and saves to seeds_real.json
// Run locally: node generate.js
const fs = require("fs");
const bip39 = require("bip39");

const TARGET = 2000;
const set = new Set();

async function generateSeeds() {
  while (set.size < TARGET) {
    const mnemonic = bip39.generateMnemonic(128); // 12 words
    set.add(mnemonic);
  }

  const seeds = Array.from(set);
  const data = { seeds };

  fs.writeFileSync("seeds_real.json", JSON.stringify(data, null, 2), "utf8");
  console.log(`Wrote ${seeds.length} BIP39 mnemonics to seeds_real.json`);
}

generateSeeds();
