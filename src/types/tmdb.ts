export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MediaItem {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  popularity: number;
  genre_ids: number[];
  media_type?: 'movie' | 'tv' | 'person';
}

export interface Movie extends MediaItem {
  title: string;
  original_title: string;
  release_date: string;
  media_type?: 'movie';
}

export interface TVShow extends MediaItem {
  name: string;
  original_name: string;
  first_air_date: string;
  media_type?: 'tv';
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface DetailedMovie extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  videos: { results: Video[] };
  credits: { cast: CastMember[] };
  similar: TMDBResponse<Movie>;
}

export interface DetailedTVShow extends TVShow {
  number_of_seasons: number;
  number_of_episodes: number;
  genres: { id: number; name: string }[];
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
  }[];
  videos: { results: Video[] };
  credits: { cast: CastMember[] };
  similar: TMDBResponse<TVShow>;
}

export interface Episode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  vote_average: number;
}

export interface Season {
  _id: string;
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
}
