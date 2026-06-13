const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// --- MOVIES ---

export async function getPopularMovies() {
  const response = await fetch(`${API_URL}/movies/popular`);
  return response.json();
}

export async function getTrendingMovies(timeWindow = "week") {
  const response = await fetch(`${API_URL}/movies/trending/${timeWindow}`);
  return response.json();
}

export async function getMovie(id: string | number) {
  const response = await fetch(`${API_URL}/movies/${id}`);
  return response.json();
}

export async function getMoviesByGenre(genreId: string | number, page = 1) {
  const response = await fetch(`${API_URL}/movies/genre/${genreId}?page=${page}`);
  return response.json();
}

export async function searchMovies(query: string) {
  const response = await fetch(
    `${API_URL}/movies/search?q=${encodeURIComponent(query)}`
  );
  return response.json();
}

// --- TV SHOWS ---

export async function getPopularTv() {
  const response = await fetch(`${API_URL}/tv/popular`);
  return response.json();
}

export async function getTrendingTv(timeWindow = "week") {
  const response = await fetch(`${API_URL}/tv/trending/${timeWindow}`);
  return response.json();
}

export async function getTvShow(id: string | number) {
  const response = await fetch(`${API_URL}/tv/${id}`);
  return response.json();
}

export async function getTvByGenre(genreId: string | number, page = 1) {
  const response = await fetch(`${API_URL}/tv/genre/${genreId}?page=${page}`);
  return response.json();
}

export async function getTvSeason(id: string | number, seasonNumber: number) {
  const response = await fetch(`${API_URL}/tv/${id}/season/${seasonNumber}`);
  return response.json();
}

export async function searchTv(query: string) {
  const response = await fetch(
    `${API_URL}/tv/search?q=${encodeURIComponent(query)}`
  );
  return response.json();
}