import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_SIZES = new Set(['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'w1280', 'original']);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let path = searchParams.get('path');
  let size = searchParams.get('size') || 'w342';

  if (!path) {
    return NextResponse.redirect(new URL('/placeholder-poster.svg', request.url));
  }

  if (!ALLOWED_SIZES.has(size)) {
    size = 'w342';
  }

  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  // Validar formato básico de archivo de imagen
  const isValidFilename = /^\/[a-zA-Z0-9_\-.]+\.(jpg|jpeg|png|webp|svg)$/i.test(path);
  if (!isValidFilename) {
    return NextResponse.redirect(new URL('/placeholder-poster.svg', request.url));
  }

  // Fuentes prioritarias: BunnyCDN primero, TMDB oficial como respaldo
  const sources = [
    `https://tmdb-image-prod.b-cdn.net/t/p/${size}${path}`,
    `https://image.tmdb.org/t/p/${size}${path}`
  ];

  for (const url of sources) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
        next: { revalidate: 86400 * 30 }, // Caché Vercel de 30 días
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'X-Kezar-Image-Source': url.includes('b-cdn') ? 'bunny-cdn' : 'tmdb-direct',
          },
        });
      }
    } catch {
      // Continuar al siguiente intento
    }
  }

  // Fallback si ninguna fuente externa respondió
  return NextResponse.redirect(new URL('/placeholder-poster.svg', request.url));
}
