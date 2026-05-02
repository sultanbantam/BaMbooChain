import hre from "hardhat";
import fs from "fs";

async function main() {
  console.log("Starting deployment...");

  // Load dummy wallets
  const dummyWallets = JSON.parse(fs.readFileSync('dummy_wallets.json', 'utf8'));

  // 1. Deploy Mock USDT
  console.log("\nDeploying MockUSDT...");
  const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
  const tUSDT = await MockUSDT.deploy();
  await tUSDT.waitForDeployment();
  const tUSDTAddress = await tUSDT.getAddress();
  console.log(`MockUSDT deployed to: ${tUSDTAddress}`);

  // Get deployer (also will be validator)
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer & Validator address: ${deployer.address}`);

  // 2. Deploy BambooEscrow
  console.log("\nDeploying BambooEscrow...");
  const BambooEscrow = await hre.ethers.getContractFactory("BambooEscrow");
  const escrow = await BambooEscrow.deploy(
    tUSDTAddress,
    deployer.address, // Validator
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
    BambooEscrow: escrowAddress
  };
  fs.writeFileSync('src/utils/contractAddresses.json', JSON.stringify(addresses, null, 2));
  console.log("\n✅ Deployment addresses saved to src/utils/contractAddresses.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
