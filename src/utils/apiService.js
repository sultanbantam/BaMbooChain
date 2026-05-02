// BSCScan API — gratis untuk BSC Mainnet
const API_KEY = import.meta.env.VITE_BSCSCAN_API_KEY;
const CONTRACT = import.meta.env.VITE_BMC_CONTRACT;
const BASE_URL = 'https://api.bscscan.com/api';

const apiCall = async (params) => {
  const url = new URL(BASE_URL);
  const allParams = { apikey: API_KEY, ...params };
  Object.entries(allParams).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.status === '1' || data.message === 'OK') return data.result;
  throw new Error(data.message || 'BSCScan API Error');
};

// Info token BMC (nama, symbol, totalSupply, dll)
export const getTokenInfo = () =>
  apiCall({ module: 'token', action: 'tokeninfo', contractaddress: CONTRACT });

// Total supply token
export const getTokenSupply = () =>
  apiCall({ module: 'stats', action: 'tokensupply', contractaddress: CONTRACT });

// Jumlah holder token BMC
export const getTokenHolders = () =>
  apiCall({ module: 'token', action: 'tokenholdercount', contractaddress: CONTRACT });

// Saldo BMC sebuah alamat
export const getTokenBalance = (address) =>
  apiCall({ module: 'account', action: 'tokenbalance', contractaddress: CONTRACT, address, tag: 'latest' });

// Riwayat transaksi BMC sebuah alamat
export const getTokenTransactions = (address, page = 1, offset = 10) =>
  apiCall({ module: 'account', action: 'tokentx', contractaddress: CONTRACT, address, page, offset, sort: 'desc' });

// Saldo BNB native
export const getBNBBalance = (address) =>
  apiCall({ module: 'account', action: 'balance', address, tag: 'latest' });

// Riwayat transaksi BNB biasa
export const getNormalTransactions = (address, page = 1, offset = 10) =>
  apiCall({ module: 'account', action: 'txlist', address, page, offset, sort: 'desc' });
