import { Capacitor } from '@capacitor/core';

export const getAssetUrl = (path) => {
  if (!path) return '';
  // If it's an absolute URL or data URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // On Native Android, stream media and documents from high-speed production server (https://bamboochain.id/)
  // This keeps the native App Bundle under 20 MB (far below Google Play's 200MB limit)
  if (Capacitor.isNativePlatform()) {
    // Keep UI logos local if present, stream documents and heavy media
    if (!cleanPath.startsWith('logos/')) {
      return `https://bamboochain.id/${cleanPath}`;
    }
  }

  // Get base URL from Vite or fallback to detection
  let base = import.meta.env.BASE_URL || '/';
  
  // Fallback for GitHub Pages detection if base is just '/'
  if (base === '/' && window.location.hostname.includes('github.io')) {
    const pathParts = window.location.pathname.split('/');
    if (pathParts[1]) {
      base = `/${pathParts[1]}/`;
    }
  }
  
  // Ensure base ends with a slash and path does NOT start with a slash
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  
  return `${cleanBase}${cleanPath}`;
};
