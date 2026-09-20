import { NextResponse } from 'next/server';
import { getTrendingDay } from '@/lib/tmdb';

export async function GET() {
  try {
    const items = await getTrendingDay();
    if (!items || items.length === 0) {
      return NextResponse.json({ url: '/' });
    }

    const randomIndex = Math.floor(Math.random() * items.length);
    const pick = items[randomIndex];
    const isMovie = pick.media_type === 'movie' || !('name' in pick);
    const url = `/ver/${isMovie ? 'pelicula' : 'serie'}/${pick.id}`;

    return NextResponse.json({ url, title: ('title' in pick ? pick.title : (pick as any).name) });
  } catch (error) {
    console.error('Random API error:', error);
    return NextResponse.json({ url: '/' });
  }
}
