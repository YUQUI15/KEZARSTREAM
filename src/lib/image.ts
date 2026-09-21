/**
 * Utilidades para carga y resiliencia de imágenes en KezarStream.
 * Utiliza el CDN directo de BunnyCDN de TMDB (tmdb-image-prod.b-cdn.net)
 * que no sufre bloqueos por DNS de AdGuard, Pi-hole o ISPs.
 */

export const CDN_IMAGE_BASE = 'https://tmdb-image-prod.b-cdn.net/t/p';

export function getPosterUrl(
  path?: string | null,
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w342'
): string {
  if (!path) return '/placeholder-poster.svg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${CDN_IMAGE_BASE}/${size}${cleanPath}`;
}

export function getBackdropUrl(
  path?: string | null,
  size: 'w300' | 'w780' | 'w1280' | 'original' = 'original'
): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${CDN_IMAGE_BASE}/${size}${cleanPath}`;
}

export function getImageProxyUrl(path: string, size: string = 'w342'): string {
  if (!path) return '/placeholder-poster.svg';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/api/img?path=${encodeURIComponent(cleanPath)}&size=${size}`;
}
