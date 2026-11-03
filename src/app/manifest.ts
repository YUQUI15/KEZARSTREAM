import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'KEZARSTREAM - Películas y Series',
    short_name: 'KEZARSTREAM',
    description: 'Mira películas y series completas en Español Latino y Subtitulado.',
    lang: 'es',
    dir: 'ltr',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#000814',
    theme_color: '#000814',
    categories: ['entertainment', 'video'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Películas', url: '/peliculas', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
      { name: 'Series', url: '/series', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
      { name: 'Tendencias', url: '/tendencias', icons: [{ src: '/icon-192.png', sizes: '192x192' }] },
    ],
  };
}
