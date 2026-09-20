import { TMDBResponse, Movie, TVShow, DetailedMovie, DetailedTVShow, Season, MediaItem } from '@/types/tmdb';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

type FetchOptions = {
  endpoint: string;
  params?: Record<string, string>;
  revalidate?: number;
};

async function fetchTMDB<T>({ endpoint, params = {}, revalidate = 3600 }: FetchOptions): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY || '');
  url.searchParams.append('language', 'es-MX');
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    next: { revalidate },
  });

  if (!response.ok) {
    console.error(`TMDB API Error: ${response.statusText} at ${endpoint}`);
    // fallback empty response instead of failing the build
    return { results: [] } as unknown as T;
  }

  return response.json();
}

export async function getTrendingDay(): Promise<(Movie | TVShow)[]> {
  const data = await fetchTMDB<TMDBResponse<MediaItem>>({ endpoint: '/trending/all/day' });
  return data.results as (Movie | TVShow)[];
}

export async function getNowPlayingMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>({ endpoint: '/movie/now_playing', params: { page: page.toString() } });
}

export async function getPopularTV(page = 1): Promise<TMDBResponse<TVShow>> {
  return fetchTMDB<TMDBResponse<TVShow>>({ endpoint: '/tv/popular', params: { page: page.toString() } });
}

export async function getTrending(type = 'all', time = 'day') {
  const data = await fetchTMDB<TMDBResponse<MediaItem>>({ endpoint: `/trending/${type}/${time}` });
  return data.results;
}

export async function getMovies(category = 'now_playing', page = 1) {
  const data = await fetchTMDB<TMDBResponse<Movie>>({ endpoint: `/movie/${category}`, params: { page: page.toString() } });
  return data.results;
}

export async function getTvShows(category = 'popular', page = 1) {
  const data = await fetchTMDB<TMDBResponse<TVShow>>({ endpoint: `/tv/${category}`, params: { page: page.toString() } });
  return data.results;
}

export async function searchMulti(query: string) {
  if (!query) return [];
  const data = await fetchTMDB<TMDBResponse<MediaItem>>({
    endpoint: '/search/multi',
    params: { query, include_adult: 'false' },
    revalidate: 60,
  });
  return data.results;
}

export async function getMovieDetails(id: string): Promise<DetailedMovie | null> {
  try {
    return await fetchTMDB<DetailedMovie>({
      endpoint: `/movie/${id}`,
      params: { append_to_response: 'credits,videos,similar' },
    });
  } catch {
    return null;
  }
}

export async function getTVDetails(id: string): Promise<DetailedTVShow | null> {
  try {
    return await fetchTMDB<DetailedTVShow>({
      endpoint: `/tv/${id}`,
      params: { append_to_response: 'credits,videos,similar' },
    });
  } catch {
    return null;
  }
}

export async function getSimilar(type: 'movie' | 'tv', id: string) {
  const data = await fetchTMDB<TMDBResponse<MediaItem>>({ endpoint: `/${type}/${id}/similar` });
  return data.results || [];
}

export async function getTVSeason(tvId: string, seasonNumber: string): Promise<Season> {
  return fetchTMDB<Season>({
    endpoint: `/tv/${tvId}/season/${seasonNumber}`,
  });
}

export function getImageUrl(path: string | null, size: 'w500' | 'original' | 'w92' = 'w500') {
  if (!path) return '/placeholder.jpg';
  return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_URL || 'https://image.tmdb.org/t/p'}/${size}${path}`;
}

export function getPlayerUrl(type: 'movie' | 'tv', id: string, season?: string, episode?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_PLAYER_URL || 'https://vidsrc.xyz/embed';
  if (type === 'movie') return `${baseUrl}/movie/${id}`;
  return `${baseUrl}/tv/${id}/${season}/${episode}`;
}
