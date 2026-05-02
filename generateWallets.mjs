import { ethers } from 'ethers';
import fs from 'fs';

console.log('--- Generating Test Wallets ---');

// Generate Deployer Wallet
const deployer = ethers.Wallet.createRandom();
console.log('\n[DEPLOYER WALLET]');
console.log('Address:', deployer.address);
console.log('Private Key:', deployer.privateKey);
console.log('(PENTING: Jangan gunakan wallet ini untuk dana asli!)');

// Append to .env
const envPath = '.env';
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}
if (!envContent.includes('TESTNET_PRIVATE_KEY=')) {
  fs.appendFileSync(envPath, `\nTESTNET_PRIVATE_KEY=${deployer.privateKey}\n`);
  console.log('\n✅ Private Key Deployer telah disimpan ke dalam file .env');
}

// Generate 7 Dummy Wallets
const roles = ['Bibit', 'Penanam', 'Perawatan', 'Risiko', 'Lahan', 'Royalti', 'Pengelola'];
const dummyWallets = {};

console.log('\n[DUMMY WALLET ADDRESSES (Penerima)]');
roles.forEach(role => {
  const wallet = ethers.Wallet.createRandom();
  dummyWallets[role] = wallet.address;
  console.log(`${role.padEnd(10)}: ${wallet.address}`);
});

// Save dummy wallets to a JSON file for easy access during deployment
fs.writeFileSync('dummy_wallets.json', JSON.stringify(dummyWallets, null, 2));
console.log('\n✅ Alamat Dummy Wallet telah disimpan ke dummy_wallets.json');
