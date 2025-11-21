const ethers = require("ethers");

const mnemonic = "bird love have turkey wheat favorite observe fox curtain defy lecture figure";

// Try MetaMask default
const w1 = ethers.HDNodeWallet.fromPhrase(mnemonic, "m/44'/60'/0'/0/0");
console.log("MetaMask-style:", w1.address);

// Try alternative
const w2 = ethers.HDNodeWallet.fromPhrase(mnemonic, "m/44'/60'/0'/0");
console.log("Alt path:", w2.address);

// Try Ledger style
const w3 = ethers.HDNodeWallet.fromPhrase(mnemonic, "m/44'/60'/0'/0/0"); // for account 0
console.log("Ledger-style:", w3.address);

// Try account-level
const w4 = ethers.HDNodeWallet.fromPhrase(mnemonic, "m/44'/60'/0'/0/0");
console.log("Another variant:", w4.address);

let n = 20
for (let i = 0; i < n; i++) {
  const path = `m/44'/60'/0'/0/${i}`;
  const wallet = ethers.HDNodeWallet.fromPhrase(mnemonic, path);
  if (wallet.address == "0xc22636704a8996ba6FF63d3B5531e4baE5468410") {
    
    
    console.log("=========");
    console.log("found it.");
    console.log(i, path, wallet.address);
    console.log("=========");
    
    return
  }
  console.log(i, path, wallet.address);
}


