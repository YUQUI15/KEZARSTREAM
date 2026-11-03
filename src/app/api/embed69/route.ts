import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TMDB_API_KEY = process.env.TMDB_API_KEY || '982fb6b40e028e8fdd07a9116b40bcd6';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') === 'tv' ? 'tv' : 'movie';
  const id = searchParams.get('id') || '';
  let imdbId = searchParams.get('imdb') || '';
  const s = searchParams.get('s') || '1';
  const e = searchParams.get('e') || '1';

  if (!imdbId && id) {
    try {
      const tmdbRes = await fetch(
        `https://api.themoviedb.org/3/${type}/${encodeURIComponent(id)}/external_ids?api_key=${TMDB_API_KEY}`,
        { cache: 'force-cache' }
      );
      if (tmdbRes.ok) {
        const data = await tmdbRes.json();
        if (data?.imdb_id) {
          imdbId = data.imdb_id;
        }
      }
    } catch {
      // Fallback below if TMDB lookup fails
    }
  }

  if (imdbId && imdbId.startsWith('tt')) {
    const epPadded = String(e).padStart(2, '0');
    const targetUrl =
      type === 'movie'
        ? `https://embed69.org/f/${imdbId}`
        : `https://embed69.org/f/${imdbId}-${s}x${epPadded}`;
    return NextResponse.redirect(targetUrl, 302);
  }

  // Fallback to MultiEmbed Clean Latino if no IMDb ID exists for this title
  const fallbackUrl =
    type === 'movie'
      ? `https://multiembed-clean.wptheme.site/embed/movie/${encodeURIComponent(id)}`
      : `https://multiembed-clean.wptheme.site/embed/tv/${encodeURIComponent(id)}/${encodeURIComponent(s)}/${encodeURIComponent(e)}`;

  return NextResponse.redirect(fallbackUrl, 302);
}
