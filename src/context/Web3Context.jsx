import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { BrowserProvider, JsonRpcProvider, Contract, formatUnits } from 'ethers';

const BMC_CONTRACT_ADDRESS = '0x812d9709f0A53982606b823Ee61d5CA216F7F9c0';

// Minimal ABI untuk membaca data token BEP-20
const BMC_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function totalSupply() view returns (uint256)',
];

const BSC_RPCS = [
  'https://bsc-rpc.publicnode.com',
  'https://bsc-dataseed.binance.org/',
  'https://binance.llamarpc.com',
  'https://1rpc.io/bsc'
];

const BSC_CHAIN = {
  chainId: '0x38',
  chainName: 'BNB Smart Chain',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: BSC_RPCS,
  blockExplorerUrls: ['https://bscscan.com'],
};

const getReadOnlyProvider = async () => {
  for (const rpcUrl of BSC_RPCS) {
    try {
      const provider = new JsonRpcProvider(rpcUrl, 56);
      await provider.getBlockNumber();
      return provider;
    } catch (err) {
      console.warn(`Fallback RPC failed: ${rpcUrl}. Trying next...`, err.message);
    }
  }
  throw new Error('All fallback RPCs failed.');
};

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [bmcBalance, setBmcBalance] = useState(null);
  const [rawBmcBalance, setRawBmcBalance] = useState(0);
  const [bnbBalance, setBnbBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null); // nama, symbol, totalSupply
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const openWalletModal = () => setIsWalletModalOpen(true);
  const closeWalletModal = () => setIsWalletModalOpen(false);

  // Baca saldo BMC dari smart contract
  const fetchBMCBalance = useCallback(async (address) => {
    if (!address) return;
    try {
      let provider;
      if (window.ethereum) {
        provider = new BrowserProvider(window.ethereum);
      } else {
        provider = await getReadOnlyProvider();
      }
      const contract = new Contract(BMC_CONTRACT_ADDRESS, BMC_ABI, provider);
      const [balance, decimals] = await Promise.all([
        contract.balanceOf(address),
        contract.decimals(),
      ]);
      const numericBalance = parseFloat(formatUnits(balance, decimals));
      setRawBmcBalance(numericBalance);
      setBmcBalance(numericBalance.toLocaleString('id-ID'));
    } catch (err) {
      console.error('Error fetching BMC balance:', err);
      setBmcBalance('0');
    }
  }, []);

  // Baca info token (nama, symbol, total supply)
  const fetchTokenInfo = useCallback(async () => {
    try {
      let provider;
      if (window.ethereum) {
        provider = new BrowserProvider(window.ethereum);
      } else {
        provider = await getReadOnlyProvider();
      }
      const contract = new Contract(BMC_CONTRACT_ADDRESS, BMC_ABI, provider);
      const [name, symbol, totalSupply, decimals] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.totalSupply(),
        contract.decimals(),
      ]);
      setTokenInfo({
        name,
        symbol,
        totalSupply: parseFloat(formatUnits(totalSupply, decimals)).toLocaleString('id-ID'),
        contractAddress: BMC_CONTRACT_ADDRESS,
      });
    } catch (err) {
      console.error('Error fetching token info:', err);
    }
  }, []);

  // Baca saldo BNB (native)
  const fetchBNBBalance = useCallback(async (address) => {
    if (!address) return;
    try {
      let provider;
      if (window.ethereum) {
        provider = new BrowserProvider(window.ethereum);
      } else {
        provider = await getReadOnlyProvider();
      }
      const balance = await provider.getBalance(address);
      setBnbBalance(parseFloat(formatUnits(balance, 18)).toFixed(4));
    } catch (err) {
      console.error('Error fetching BNB balance:', err);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      // Kita biarkan Navbar menangani UI pemilihan/instruksi instalasi
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // Pastikan di jaringan BSC
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BSC_CHAIN.chainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          // Tambahkan jaringan BSC jika belum ada
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BSC_CHAIN],
          });
        }
      }
      const address = accounts[0];
      setWalletAddress(address);
      setIsConnected(true);
      await Promise.all([
        fetchBMCBalance(address),
        fetchBNBBalance(address),
        fetchTokenInfo(),
      ]);
    } catch (err) {
      console.error('Wallet connection failed:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [fetchBMCBalance, fetchBNBBalance, fetchTokenInfo]);

  const disconnectWallet = useCallback(() => {
    setWalletAddress('');
    setBmcBalance(null);
    setBnbBalance(null);
    setIsConnected(false);
  }, []);

  // Auto-reconnect + event listener
  useEffect(() => {
    if (!window.ethereum) {
      fetchTokenInfo();
      return;
    }

    // Cek jika sebelumnya sudah terkoneksi
    window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        setIsConnected(true);
        fetchBMCBalance(address);
        fetchBNBBalance(address);
        fetchTokenInfo();
      } else {
        fetchTokenInfo();
      }
    }).catch((err) => {
      console.warn("Failed to check eth_accounts:", err);
      fetchTokenInfo();
    });

    // Dengarkan perubahan akun
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        fetchBMCBalance(accounts[0]);
        fetchBNBBalance(accounts[0]);
      } else {
        disconnectWallet();
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', () => window.location.reload());

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [fetchBMCBalance, fetchBNBBalance, fetchTokenInfo, disconnectWallet]);

  return (
    <Web3Context.Provider value={{
      walletAddress,
      bmcBalance,
      rawBmcBalance,
      bnbBalance,
      isConnecting,
      isConnected,
      tokenInfo,
      connectWallet,
      disconnectWallet,
      isWalletModalOpen,
      openWalletModal,
      closeWalletModal,
      BMC_CONTRACT_ADDRESS,
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
