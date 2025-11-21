require("dotenv").config()
const { Wallet, HDNodeWallet, ethers } = require("ethers");
const fs = require("fs");


const PROVIDER_URL = process.env.PROVIDER_URL;
const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

const seedsFile = JSON.parse(fs.readFileSync("./db/seeds.json", "utf8"));
const seeds = seedsFile.seeds;
const RESULTS_FILE = "./results/seed-check-results.json";

const ADDRESSES_PER_SEED = 3; // derive this many addresses per seed
const TOKENS = [
  { symbol: "USDT", address: "0x8d9cb8f3191fd685e2c14d2ac3fb2b16d44eafc3"},
  { symbol: "USDC", address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"},
];

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

async function checkSeed(seed) {
  const seedResult = { seed, addresses: [] };

  let hdNode;
  try {
    hdNode = HDNodeWallet.fromMnemonic(seed);
  } catch {
    seedResult.error = "Invalid mnemonic";
    return seedResult;
  }

  for (let i = 0; i < ADDRESSES_PER_SEED; i++) {
    const path = `m/44'/60'/0'/0/${i}`;
    let wallet;
    try {
      wallet = hdNode.derivePath(path);
    } catch (err) {
      seedResult.addresses.push({ path, error: `Could not derive: ${err.message}` });
      continue;
    }

    const addrResult = { path, address: wallet.address };

    // ETH balance
    try {
      const balance = await provider.getBalance(wallet.address);
      addrResult.ethBalance = Number(ethers.formatEther(balance));
    } catch {
      addrResult.ethBalance = "❌ Error fetching balance";
    }

    // ERC-20 balances
    addrResult.tokens = {};
    for (const token of TOKENS) {
      try {
        const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
        const rawBalance = await contract.balanceOf(wallet.address);
        const decimals = await contract.decimals();
        addrResult.tokens[token.symbol] = Number(ethers.formatUnits(rawBalance, decimals));
      } catch {
        addrResult.tokens[token.symbol] = "❌ Error (maybe wrong network)";
      }
    }

    seedResult.addresses.push(addrResult);
  }

  return seedResult;
}

async function main() {
  const results = [];

  for (const seed of seeds) {
    console.log(`🔹 Checking the seed: ${seed}`);
    const result = await checkSeed(seed);
    results.push(result);
  }

  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to ${RESULTS_FILE}`);
}

main().catch(console.error);
