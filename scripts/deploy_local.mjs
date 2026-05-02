import { ethers } from "ethers";
import fs from "fs";

async function main() {
  console.log("Starting deployment to localhost...");

  // Connect to local hardhat node
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  
  // Use Account #1 from local hardhat node to avoid nonce issues
  const deployer = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider);
  console.log(`Deployer & Validator address: ${deployer.address}`);

  // Load dummy wallets
  const dummyWallets = JSON.parse(fs.readFileSync('dummy_wallets.json', 'utf8'));

  // Load compiled artifacts
  const mockUSDTArtifact = JSON.parse(fs.readFileSync('artifacts/contracts/MockUSDT.sol/MockUSDT.json', 'utf8'));
  const escrowArtifact = JSON.parse(fs.readFileSync('artifacts/contracts/BambooEscrow.sol/BambooEscrow.json', 'utf8'));

  // 1. Deploy Mock USDT
  console.log("\nDeploying MockUSDT...");
  const MockUSDTFactory = new ethers.ContractFactory(mockUSDTArtifact.abi, mockUSDTArtifact.bytecode, deployer);
  const tUSDT = await MockUSDTFactory.deploy();
  await tUSDT.waitForDeployment();
  const tUSDTAddress = await tUSDT.getAddress();
  console.log(`MockUSDT deployed to: ${tUSDTAddress}`);

  // 2. Deploy BambooEscrow using Account #2 to avoid nonce issues
  const deployer2 = new ethers.Wallet("0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", provider);
  console.log("\nDeploying BambooEscrow...");
  const BambooEscrowFactory = new ethers.ContractFactory(escrowArtifact.abi, escrowArtifact.bytecode, deployer2);
  const escrow = await BambooEscrowFactory.deploy(
    tUSDTAddress,
    deployer.address, // Validator (keep deployer 1 as validator)
    dummyWallets.Bibit,
    dummyWallets.Penanam,
    dummyWallets.Perawatan,
    dummyWallets.Risiko,
    dummyWallets.Lahan,
    dummyWallets.Royalti,
    dummyWallets.Pengelola
  );
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log(`BambooEscrow deployed to: ${escrowAddress}`);

  // Save addresses to a file for frontend to use
  const addresses = {
    MockUSDT: tUSDTAddress,
    BambooEscrow: escrowAddress,
    Validator: deployer.address
  };
  fs.writeFileSync('src/utils/contractAddresses.json', JSON.stringify(addresses, null, 2));
  console.log("\n✅ Deployment addresses saved to src/utils/contractAddresses.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
