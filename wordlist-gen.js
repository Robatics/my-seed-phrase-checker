const fs = require('fs');
const https = require('https');

// URL of the official BIP-39 English wordlist
const url = 'https://raw.githubusercontent.com/bitcoin/bips/master/bip-0039/english.txt';

// Download the wordlist
https.get(url, (res) => {
  let data = '';

  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    // Split by new lines and remove empty entries
    const words = data.split('\n').map(word => word.trim()).filter(Boolean);

    // Wrap in JSON structure
    const jsonData = { wordlist: words };

    // Save to JSON file
    fs.writeFileSync('bip39_english_wordlist.json', JSON.stringify(jsonData, null, 2));
    console.log('bip39_english_wordlist.json has been created!');
  });

}).on('error', err => {
  console.error('Error downloading the wordlist:', err);
});
