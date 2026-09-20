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
    next: { revalidate }, // Next.js cache config
  });

  if (!response.ok) {
    console.error(`TMDB API Error: ${response.statusText} at ${endpoint}`);
    throw new Error('Failed to fetch data from TMDB');
  }

  return response.json();
}

export async function getTrendingDay(): Promise<(Movie | TVShow)[]> {
  const data = await fetchTMDB<TMDBResponse<MediaItem>>({ endpoint: '/trending/all/day' });
  return data.results as (Movie | TVShow)[];
}

export async function getNowPlayingMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>({ 
    endpoint: '/movie/now_playing', 
    params: { page: page.toString() } 
  });
}

export async function getPopularTV(page = 1): Promise<TMDBResponse<TVShow>> {
  return fetchTMDB<TMDBResponse<TVShow>>({ 
    endpoint: '/tv/popular', 
    params: { page: page.toString() } 
  });
}

export async function searchMulti(query: string): Promise<TMDBResponse<MediaItem>> {
  if (!query) return { page: 1, results: [], total_pages: 0, total_results: 0 };
  
  return fetchTMDB<TMDBResponse<MediaItem>>({
    endpoint: '/search/multi',
    params: { query, include_adult: 'false' },
    revalidate: 60, // Shorter cache for search
  });
}

export async function getMovieDetails(id: string): Promise<DetailedMovie> {
  return fetchTMDB<DetailedMovie>({
    endpoint: `/movie/${id}`,
    params: { append_to_response: 'credits,videos,similar' },
  });
}

export async function getTVDetails(id: string): Promise<DetailedTVShow> {
  return fetchTMDB<DetailedTVShow>({
    endpoint: `/tv/${id}`,
    params: { append_to_response: 'credits,videos,similar' },
  });
}

export async function getTVSeason(tvId: string, seasonNumber: string): Promise<Season> {
  return fetchTMDB<Season>({
    endpoint: `/tv/${tvId}/season/${seasonNumber}`,
  });
}

export function getImageUrl(path: string | null, size: 'w500' | 'original' | 'w92' = 'w500') {
  if (!path) return '/placeholder-image.jpg'; // We'll add a placeholder later
  return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_URL}/${size}${path}`;
}

export function getPlayerUrl(type: 'movie' | 'tv', id: string, season?: string, episode?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_PLAYER_URL;
  if (type === 'movie') return `${baseUrl}/movie/${id}`;
  return `${baseUrl}/tv/${id}/${season}/${episode}`;
}
