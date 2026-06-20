const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function fetchJson(path: string) {
  const response = await fetch(`${API_URL}${path}`);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `Request failed with status ${response.status}`);
  }

  return data;
}

// --- MOVIES ---

export async function getPopularMovies() {
  return fetchJson("/movies/popular");
}

export async function getTrendingMovies(timeWindow = "week") {
  return fetchJson(`/movies/trending/${timeWindow}`);
}

export async function getMovie(id: string | number) {
  return fetchJson(`/movies/${id}`);
}

export async function getMoviesByGenre(genreId: string | number, page = 1) {
  return fetchJson(`/movies/genre/${genreId}?page=${page}`);
}

export async function searchMovies(query: string) {
  return fetchJson(`/movies/search?q=${encodeURIComponent(query)}`);
}

// --- TV SHOWS ---

export async function getPopularTv() {
  return fetchJson("/tv/popular");
}

export async function getTrendingTv(timeWindow = "week") {
  return fetchJson(`/tv/trending/${timeWindow}`);
}

export async function getTvShow(id: string | number) {
  return fetchJson(`/tv/${id}`);
}

export async function getTvByGenre(genreId: string | number, page = 1) {
  return fetchJson(`/tv/genre/${genreId}?page=${page}`);
}

export async function getTvSeason(id: string | number, seasonNumber: number) {
  return fetchJson(`/tv/${id}/season/${seasonNumber}`);
}

export async function searchTv(query: string) {
  return fetchJson(`/tv/search?q=${encodeURIComponent(query)}`);
}
