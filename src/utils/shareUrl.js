const DEFAULT_GITHUB_PAGES_BASE = '/BaMbooChain/';
export const PUBLIC_PRODUCTION_ORIGIN = 'https://www.bamboochain.id';

export const getPublicProductionOrigin = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    const origin = window.location.origin;
    const hostname = window.location.hostname || '';
    const isLocal = !origin || 
                    origin.includes('localhost') || 
                    origin.includes('127.0.0.1') || 
                    origin.startsWith('capacitor:') || 
                    origin.startsWith('file:') ||
                    origin.startsWith('ionic:') ||
                    hostname === 'localhost' ||
                    hostname === '127.0.0.1';

    if (!isLocal && !hostname.endsWith('github.io')) {
      return origin;
    }
  }
  return PUBLIC_PRODUCTION_ORIGIN;
};

export const getAppBasePath = () => {
  if (typeof window === 'undefined') return '/';

  const viteBase = import.meta.env.BASE_URL || '/';
  if (viteBase && viteBase !== './' && viteBase !== '/') {
    return viteBase.endsWith('/') ? viteBase : `${viteBase}/`;
  }

  if (window.location.hostname.endsWith('github.io')) {
    const firstPath = window.location.pathname.split('/').filter(Boolean)[0];
    return firstPath ? `/${firstPath}/` : DEFAULT_GITHUB_PAGES_BASE;
  }

  const pathParts = window.location.pathname.split('/').filter(Boolean);
  return pathParts[0] === 'BaMbooChain' ? '/BaMbooChain/' : '/';
};

export const buildShareUrl = (hashPath = '') => {
  const publicOrigin = getPublicProductionOrigin();
  const cleanHash = hashPath.startsWith('/') ? hashPath : `/${hashPath}`;
  return `${publicOrigin}${getAppBasePath()}#${cleanHash}`;
};

export const getCurrentShareUrl = () => {
  if (typeof window === 'undefined') return PUBLIC_PRODUCTION_ORIGIN;

  const hash = window.location.hash?.replace(/^#/, '');
  if (hash) return buildShareUrl(hash);

  const basePath = getAppBasePath();
  const currentPath = window.location.pathname.startsWith(basePath)
    ? window.location.pathname.slice(basePath.length - 1)
    : window.location.pathname;

  return buildShareUrl(currentPath || '/');
};

export const normalizeShareUrl = (url = '') => {
  const publicOrigin = getPublicProductionOrigin();
  if (!url) return publicOrigin;

  try {
    let cleanUrl = String(url).trim();

    // Replace any localhost, 127.0.0.1, or capacitor schemes with public production domain
    cleanUrl = cleanUrl
      .replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, publicOrigin)
      .replace(/^capacitor:\/\/[^/]+/i, publicOrigin)
      .replace(/^ionic:\/\/[^/]+/i, publicOrigin);

    if (cleanUrl.startsWith('/')) {
      cleanUrl = `${publicOrigin}${cleanUrl}`;
    }

    const parsedUrl = new URL(cleanUrl, publicOrigin);

    if (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1') {
      parsedUrl.protocol = 'https:';
      parsedUrl.host = 'www.bamboochain.id';
    }

    const basePath = getAppBasePath();
    const hashPath = parsedUrl.hash?.replace(/^#/, '');

    if (parsedUrl.hostname.endsWith('github.io') && !parsedUrl.pathname.startsWith(basePath)) {
      return `${parsedUrl.origin}${basePath}${parsedUrl.hash || ''}`;
    }

    if (hashPath) {
      return `${parsedUrl.origin}${basePath}#${hashPath.startsWith('/') ? hashPath : `/${hashPath}`}`;
    }

    return parsedUrl.toString();
  } catch {
    return String(url).replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, publicOrigin);
  }
};
