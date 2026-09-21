import { TMDBResponse, Movie, TVShow, DetailedMovie, DetailedTVShow, Season, MediaItem } from '@/types/tmdb';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY || '982fb6b40e028e8fdd07a9116b40bcd6';

type FetchOptions = {
  endpoint: string;
  params?: Record<string, string>;
  revalidate?: number;
};

async function fetchTMDB<T>({ endpoint, params = {}, revalidate = 3600 }: FetchOptions): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  if (!params.language) {
    url.searchParams.append('language', 'es-MX');
  }
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate },
    });

    if (!response.ok) {
      console.error(`TMDB API Error: ${response.status} ${response.statusText} at ${endpoint}`);
      return { results: [] } as unknown as T;
    }

    return await response.json();
  } catch (err) {
    console.error(`TMDB fetch failure at ${endpoint}:`, err);
    return { results: [] } as unknown as T;
  }
}

export async function getTrendingDay(): Promise<(Movie | TVShow)[]> {
  const data = await fetchTMDB<TMDBResponse<MediaItem>>({ endpoint: '/trending/all/day' });
  return (data.results || []) as (Movie | TVShow)[];
}

export async function getNowPlayingMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return fetchTMDB<TMDBResponse<Movie>>({ endpoint: '/movie/now_playing', params: { page: page.toString() } });
}

export async function getPopularTV(page = 1): Promise<TMDBResponse<TVShow>> {
  return fetchTMDB<TMDBResponse<TVShow>>({ endpoint: '/tv/popular', params: { page: page.toString() } });
}

export async function getTrending(type = 'all', time = 'day') {
  const data = await fetchTMDB<TMDBResponse<MediaItem>>({ endpoint: `/trending/${type}/${time}` });
  return data.results || [];
}

export async function getMovies(category = 'now_playing', page = 1) {
  const data = await fetchTMDB<TMDBResponse<Movie>>({ endpoint: `/movie/${category}`, params: { page: page.toString() } });
  return data.results || [];
}

export async function getTvShows(category = 'popular', page = 1) {
  const data = await fetchTMDB<TMDBResponse<TVShow>>({ endpoint: `/tv/${category}`, params: { page: page.toString() } });
  return data.results || [];
}

export async function getMoviesByGenre(genreId: number, page = 1) {
  const data = await fetchTMDB<TMDBResponse<Movie>>({
    endpoint: '/discover/movie',
    params: {
      with_genres: genreId.toString(),
      sort_by: 'popularity.desc',
      page: page.toString(),
      include_adult: 'false',
    },
  });
  return data.results || [];
}

export async function getTvByGenre(genreId: number, page = 1) {
  const data = await fetchTMDB<TMDBResponse<TVShow>>({
    endpoint: '/discover/tv',
    params: {
      with_genres: genreId.toString(),
      sort_by: 'popularity.desc',
      page: page.toString(),
      include_adult: 'false',
    },
  });
  return data.results || [];
}

export async function getKoreanMovies(page = 1) {
  const data = await fetchTMDB<TMDBResponse<Movie>>({
    endpoint: '/discover/movie',
    params: {
      with_original_language: 'ko',
      sort_by: 'popularity.desc',
      page: page.toString(),
      include_adult: 'false',
    },
  });
  return data.results || [];
}

export async function getNetflixSeries(page = 1) {
  const data = await fetchTMDB<TMDBResponse<TVShow>>({
    endpoint: '/discover/tv',
    params: {
      with_networks: '213', // Netflix Network ID on TMDB
      sort_by: 'popularity.desc',
      page: page.toString(),
      include_adult: 'false',
    },
  });
  return data.results || [];
}

export async function searchMulti(query: string) {
  if (!query || query.trim().length < 2) return [];
  const data = await fetchTMDB<TMDBResponse<MediaItem>>({
    endpoint: '/search/multi',
    params: { query: query.trim(), include_adult: 'false' },
    revalidate: 60,
  });
  return (data.results || []).filter((item) => item.media_type === 'movie' || item.media_type === 'tv');
}

export async function getMovieDetails(id: string): Promise<DetailedMovie | null> {
  try {
    const data = await fetchTMDB<DetailedMovie>({
      endpoint: `/movie/${id}`,
      params: { append_to_response: 'credits,videos,similar' },
    });
    if (!data || !data.id) return null;

    if (!data.overview || data.overview.trim().length === 0) {
      // Fallback 1: Español España (es-ES)
      const esFallback = await fetchTMDB<DetailedMovie>({
        endpoint: `/movie/${id}`,
        params: { language: 'es-ES' },
      });
      if (esFallback && esFallback.overview && esFallback.overview.trim().length > 0) {
        data.overview = esFallback.overview;
      } else {
        // Fallback 2: Inglés (en-US)
        const enFallback = await fetchTMDB<DetailedMovie>({
          endpoint: `/movie/${id}`,
          params: { language: 'en-US' },
        });
        if (enFallback && enFallback.overview && enFallback.overview.trim().length > 0) {
          data.overview = enFallback.overview;
        }
      }
    }

    return data;
  } catch {
    return null;
  }
}

export async function getTVDetails(id: string): Promise<DetailedTVShow | null> {
  try {
    const data = await fetchTMDB<DetailedTVShow>({
      endpoint: `/tv/${id}`,
      params: { append_to_response: 'credits,videos,similar' },
    });
    if (!data || !data.id) return null;

    if (!data.overview || data.overview.trim().length === 0) {
      // Fallback 1: Español España (es-ES)
      const esFallback = await fetchTMDB<DetailedTVShow>({
        endpoint: `/tv/${id}`,
        params: { language: 'es-ES' },
      });
      if (esFallback && esFallback.overview && esFallback.overview.trim().length > 0) {
        data.overview = esFallback.overview;
      } else {
        // Fallback 2: Inglés (en-US)
        const enFallback = await fetchTMDB<DetailedTVShow>({
          endpoint: `/tv/${id}`,
          params: { language: 'en-US' },
        });
        if (enFallback && enFallback.overview && enFallback.overview.trim().length > 0) {
          data.overview = enFallback.overview;
        }
      }
    }

    return data;
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
