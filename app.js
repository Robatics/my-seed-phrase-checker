require("dotenv").config()
const ethers = require("ethers");
const fs = require("fs");

// // 🔑 your provider (Infura, Alchemy, or local node)
const PROVIDER_URL = process.env.PROVIDER_URL;
const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

// ✅ Check multiple derived addresses from a seed
async function checkSeed(mnemonic, numAccounts = 8) {
  try {
    // Validate mnemonic
    const isValid = ethers.Mnemonic.isValidMnemonic(mnemonic);
    console.log(` - Valid BIP-39 mnemonic? ${isValid}`);
    if (!isValid) return;

    for (let i = 0; i < numAccounts; i++) {
      // derive path from root for each address

      // Mainnet
      // const path = `m/44'/60'/0'/0/${i}`;

      // Testnet
      const path = `m/44'/60'/0'/0/${i}`;
      const wallet = ethers.HDNodeWallet.fromPhrase(mnemonic, path);

      console.log(`\n📌 Path: ${path}`);
      console.log("   Address:", wallet.address);

      // Fetch ETH balance
      const balanceWei = await provider.getBalance(wallet.address);
      const balanceEth = ethers.formatEther(balanceWei);

      console.log("   Balance:", balanceEth, "ETH");
    }

  } catch (err) {
    console.error("❌ Error handling seed:", err);
  }
}

// 🔎 Example: read seed phrases from JSON array
const seedsFile = JSON.parse(fs.readFileSync("./db/seeds.json", "utf8"));
const seeds = seedsFile.seeds;

(async () => {
  for (const seed of seeds) {
    console.log("\n=================================");
    console.log("Checking seed:", seed);
    await checkSeed(seed, 10); // first 5 addresses
  }
})();




// require("dotenv").config()
// const ethers = require("ethers");
// const fs = require("fs");

// // 🔑 your provider (Infura, Alchemy, or local node)
// const PROVIDER_URL = process.env.PROVIDER_URL;
// const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

// // ✅ Function to check a 12-word seed phrase
// async function checkSeed(mnemonic) {
//   try {
//     // Validate mnemonic
//     const isValid = ethers.Mnemonic.isValidMnemonic(mnemonic);
//     console.log(` - Valid BIP-39 mnemonic? ${isValid}`);
//     if (!isValid) return null;

//     // Derive root wallet from phrase
//     const rootWallet = ethers.HDNodeWallet.fromPhrase(mnemonic);

//     // Derive first account (Ethereum path m/44'/60'/0'/0/0)
//     const childWallet = rootWallet.derivePath("m/44'/60'/0'/0/0");

//     console.log("   Derived address:", childWallet.address);

//     // Fetch ETH balance
//     const balanceWei = await provider.getBalance(childWallet.address);
//     const balanceEth = ethers.formatEther(balanceWei);

//     console.log("   Balance:", balanceEth, "ETH");
//     return { address: childWallet.address, balance: balanceEth };

//   } catch (err) {
//     console.error("❌ Error handling seed:", err);
//     return null;
//   }
// }

// // 🔎 Example: read seed phrases from a JSON file
// // JSON format: ["word1 word2 ... word12", "another seed phrase", ...]
// const seedsFile = JSON.parse(fs.readFileSync("./db/seeds.json", "utf8"));
// const seeds = seedsFile.seeds;

// (async () => {
//   for (const seed of seeds) {
//     console.log("\nChecking seed:", seed);
//     await checkSeed(seed);
//   }
// })();
