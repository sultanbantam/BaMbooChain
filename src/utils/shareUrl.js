const DEFAULT_GITHUB_PAGES_BASE = '/BaMbooChain/';

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
  if (typeof window === 'undefined') return hashPath;

  const cleanHash = hashPath.startsWith('/') ? hashPath : `/${hashPath}`;
  return `${window.location.origin}${getAppBasePath()}#${cleanHash}`;
};

export const getCurrentShareUrl = () => {
  if (typeof window === 'undefined') return '';

  const hash = window.location.hash?.replace(/^#/, '');
  if (hash) return buildShareUrl(hash);

  const basePath = getAppBasePath();
  const currentPath = window.location.pathname.startsWith(basePath)
    ? window.location.pathname.slice(basePath.length - 1)
    : window.location.pathname;

  return buildShareUrl(currentPath || '/');
};

export const normalizeShareUrl = (url = '') => {
  if (typeof window === 'undefined' || !url) return url;

  try {
    const parsedUrl = new URL(url, window.location.origin);
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
    return url;
  }
};
