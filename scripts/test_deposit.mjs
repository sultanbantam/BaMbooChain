import { ethers } from "ethers";
import fs from "fs";

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  // Account #1
  const deployer = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider);
  
  const addrs = JSON.parse(fs.readFileSync('src/utils/contractAddresses.json', 'utf8'));
  const escrowAbi = JSON.parse(fs.readFileSync('artifacts/contracts/BambooEscrow.sol/BambooEscrow.json', 'utf8')).abi;
  const usdtAbi = JSON.parse(fs.readFileSync('artifacts/contracts/MockUSDT.sol/MockUSDT.json', 'utf8')).abi;

  const escrowContract = new ethers.Contract(addrs.BambooEscrow, escrowAbi, deployer);
  const usdtContract = new ethers.Contract(addrs.MockUSDT, usdtAbi, deployer);

  const amount = ethers.parseUnits("5000", 18);

  console.log("Approving...");
  const tx1 = await usdtContract.approve(addrs.BambooEscrow, amount);
  await tx1.wait();
  console.log("Approved");

  console.log("Depositing...");
  const tx2 = await escrowContract.deposit(amount);
  await tx2.wait();
  console.log("Deposited");
}

main().catch(console.error);
