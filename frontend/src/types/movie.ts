export interface Movie {
  id: number;
  title?: string;           // ✅ For movies
  name?: string;            // ✅ For TV shows
  poster_path: string | null;
  backdrop_path?: string | null;
  overview: string;
  release_date?: string;    // ✅ For movies
  first_air_date?: string;  // ✅ For TV shows
  vote_average: number;
  media_type?: "movie" | "tv";
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface VideoResult {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface MovieDetail extends Movie {
  tagline?: string;
  runtime: number;
  genres?: Genre[];
  production_companies?: ProductionCompany[];
  vote_count?: number;
  budget: number;
  revenue: number;
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
  videos?: {
    results: VideoResult[];
  };
}

export interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
}

export interface SimilarTvShow {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  first_air_date?: string;
}

export interface TmdbLogo {
  file_path: string;
  iso_639_1: string | null;
}

export interface TmdbImages {
  logos?: TmdbLogo[];
}

