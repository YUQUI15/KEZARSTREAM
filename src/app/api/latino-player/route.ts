import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const PROVIDER_FALLBACK_ORDER = [
  'vimeos',
  'goodstream',
  'voe',
  'filemoon',
  'earnvids',
  'streamhg',
  'videoapp',
  'streamwish',
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') === 'tv' ? 'tv' : 'movie';
  const id = searchParams.get('id') || '';
  const s = searchParams.get('s') || '1';
  const e = searchParams.get('e') || '1';
  const provider = (searchParams.get('provider') || 'vimeos').toLowerCase();
  const langPref = (searchParams.get('lang') || 'latino').toLowerCase();

  const baseEmbedUrl =
    type === 'movie'
      ? `https://multiembed-clean.wptheme.site/embed/movie/${encodeURIComponent(id)}`
      : `https://multiembed-clean.wptheme.site/embed/tv/${encodeURIComponent(id)}/${encodeURIComponent(s)}/${encodeURIComponent(e)}`;

  if (!id) {
    return NextResponse.redirect(baseEmbedUrl, 302);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(baseEmbedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      cache: 'no-store',
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.redirect(baseEmbedUrl, 302);
    }

    const html = await response.text();
    const match = html.match(/window\.PELIX_CONFIG\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
    if (!match || !match[1]) {
      return NextResponse.redirect(baseEmbedUrl, 302);
    }

    const cfg = JSON.parse(match[1]);
    const langs = cfg?.langs || {};

    // Priority order of languages based on preference
    const langOrder =
      langPref === 'sub'
        ? ['sub', 'subtitulado', 'latino', 'castellano']
        : ['latino', 'castellano', 'sub', 'subtitulado'];

    let allPlayableServers: Array<{ server: string; play: string }> = [];

    for (const key of langOrder) {
      const list = langs[key]?.servers;
      if (Array.isArray(list)) {
        const playable = list.filter(
          (item: any) => item && typeof item.play === 'string' && item.play.startsWith('http')
        );
        if (playable.length > 0) {
          allPlayableServers = playable;
          break;
        }
      }
    }

    if (allPlayableServers.length === 0) {
      // Fallback: look across any key in langs
      for (const key of Object.keys(langs)) {
        const list = langs[key]?.servers;
        if (Array.isArray(list)) {
          const playable = list.filter(
            (item: any) => item && typeof item.play === 'string' && item.play.startsWith('http')
          );
          if (playable.length > 0) {
            allPlayableServers = playable;
            break;
          }
        }
      }
    }

    if (allPlayableServers.length > 0) {
      // 1. Exact provider match
      const exactMatch = allPlayableServers.find((item) =>
        String(item.server || '').toLowerCase().includes(provider)
      );
      if (exactMatch) {
        return NextResponse.redirect(exactMatch.play, 302);
      }

      // 2. Deterministic index fallback so different server buttons select different active streams
      const providerIdx = Math.max(0, PROVIDER_FALLBACK_ORDER.indexOf(provider));
      const fallbackServer = allPlayableServers[providerIdx % allPlayableServers.length];
      if (fallbackServer && fallbackServer.play) {
        return NextResponse.redirect(fallbackServer.play, 302);
      }
    }

    return NextResponse.redirect(baseEmbedUrl, 302);
  } catch {
    return NextResponse.redirect(baseEmbedUrl, 302);
  }
}
