import { BrowserProvider, parseEther } from 'ethers';

// Helper to connect to MetaMask or other injected Web3 wallet
export const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Try to switch to BSC network (Mainnet or Testnet)
      // Here we assume BSC Mainnet (chain ID 56 / 0x38)
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }],
        });
      } catch (switchError) {
        // If the network is not added, you could prompt to add it here
        console.warn("Please add Binance Smart Chain manually if not found", switchError);
      }
      
      return accounts[0];
    } catch (error) {
      console.error("User denied account access or error occurred:", error);
      return null;
    }
  } else {
    alert("Silakan instal dompet Web3 seperti MetaMask atau Trust Wallet.");
    return null;
  }
};

// Simple placeholder transaction function
export const donateCrypto = async (amountInBnb) => {
  if (!window.ethereum) return false;
  
  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Address yayasan (placeholder)
    const foundationAddress = "0x000000000000000000000000000000000000dEaD";
    
    const tx = await signer.sendTransaction({
      to: foundationAddress,
      value: parseEther(amountInBnb.toString())
    });
    
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Donation failed:", error);
    return false;
  }
};
