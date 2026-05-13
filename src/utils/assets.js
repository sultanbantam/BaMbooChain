export const getAssetUrl = (path) => {
  // If it's an absolute URL, return as is
  if (path.startsWith('http')) return path;
  
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
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${cleanBase}${cleanPath}`;
};
