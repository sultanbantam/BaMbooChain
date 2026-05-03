export const getAssetUrl = (path) => {
  // If it's an absolute URL, return as is
  if (path.startsWith('http')) return path;
  
  // Get base URL from Vite
  const base = import.meta.env.BASE_URL || '/';
  
  // Ensure base ends with a slash and path does NOT start with a slash
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${cleanBase}${cleanPath}`;
};
