import * as dotenv from 'dotenv';
import "@nomicfoundation/hardhat-ethers";

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: "0.8.20",
  // networks: {
  //   bscTestnet: {
  //     url: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
  //     chainId: 97,
  //     accounts: process.env.TESTNET_PRIVATE_KEY ? [process.env.TESTNET_PRIVATE_KEY] : []
  //   }
  // }
};
