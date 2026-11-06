import { useState, useEffect } from 'react';

/**
 * BAMBOOCHAIN CURRENCY & TOKEN ENGINE
 * Kurs acuan standar:
 * 1 USDT = Rp 18.099 (kurs saat ini, dinamis mengikuti pasar real-time)
 * 1 BMC = 1 USDT = Rp 18.099 (kurs pasar dinamis)
 */
export const DEFAULT_USDT_IDR_RATE = 18099;

let cachedRate = DEFAULT_USDT_IDR_RATE;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 60 * 1000; // Cache 1 menit

/**
 * Fetch real-time dynamic market exchange rate for USDT & USD to IDR
 */
export async function fetchLiveUsdtRate() {
  const now = Date.now();
  if (cachedRate && now - lastFetchTime < CACHE_DURATION_MS) {
    return cachedRate;
  }

  // 1. Coba Binance API (USDT/IDR jika tersedia atau USDT/BIDR)
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=idr');
    if (res.ok) {
      const data = await res.json();
      if (data?.tether?.idr && Number(data.tether.idr) > 1000) {
        cachedRate = Math.round(data.tether.idr);
        lastFetchTime = now;
        return cachedRate;
      }
    }
  } catch (err) {
    // Lanjut ke fallback
  }

  // 2. Fallback ke ExchangeRate-API (USD/IDR)
  try {
    const fallbackRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      if (fallbackData?.rates?.IDR && Number(fallbackData.rates.IDR) > 1000) {
        cachedRate = Math.round(fallbackData.rates.IDR);
        lastFetchTime = now;
        return cachedRate;
      }
    }
  } catch (err) {
    // Lanjut ke fallback bawaan
  }

  return cachedRate || DEFAULT_USDT_IDR_RATE;
}

/**
 * Custom React Hook untuk mendapatkan kurs USDT & BMC secara real-time dan dinamis
 */
export function useLiveUsdtRate(initialRate = DEFAULT_USDT_IDR_RATE) {
  const [rate, setRate] = useState(cachedRate || initialRate);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const updateRate = async () => {
      try {
        const liveRate = await fetchLiveUsdtRate();
        if (isMounted && liveRate) {
          setRate(liveRate);
          setIsLive(true);
          setLastUpdated(new Date());
        }
      } catch (err) {
        if (isMounted) {
          setRate(DEFAULT_USDT_IDR_RATE);
        }
      }
    };

    updateRate();
    // Refresh otomatis setiap 5 menit
    const interval = setInterval(updateRate, 5 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return {
    usdtRate: rate,
    bmcRate: rate, // 1 BMC = 1 USDT
    isLive,
    lastUpdated
  };
}

export function idrToUsdt(idrAmount, rate = DEFAULT_USDT_IDR_RATE) {
  const r = Number(rate) > 0 ? Number(rate) : DEFAULT_USDT_IDR_RATE;
  return Number((Number(idrAmount || 0) / r).toFixed(4));
}

export function idrToBmc(idrAmount, rate = DEFAULT_USDT_IDR_RATE) {
  return idrToUsdt(idrAmount, rate); // 1 BMC = 1 USDT
}

