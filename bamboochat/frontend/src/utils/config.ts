const LOCAL_API_ORIGIN = 'http://localhost:3000';
const PRODUCTION_API_ORIGIN = 'https://api.bamboochat.click';

const env = (globalThis as any).process?.env || {};

const getWebHostname = () => {
  if (typeof window === 'undefined') return '';
  return window.location.hostname;
};

const getConfiguredApiOrigin = () => {
  const envUrl = env.EXPO_PUBLIC_API_URL || env.EXPO_PUBLIC_API_BASE_URL;
  if (envUrl) return envUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

  const hostname = getWebHostname();
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') {
    return LOCAL_API_ORIGIN;
  }

  return PRODUCTION_API_ORIGIN;
};

export const API_ORIGIN = getConfiguredApiOrigin();
export const API_URL = `${API_ORIGIN}/api`;
export const SOCKET_URL = env.EXPO_PUBLIC_SOCKET_URL?.replace(/\/$/, '') || API_ORIGIN;