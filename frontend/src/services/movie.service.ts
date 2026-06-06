
const API_URL = import.meta.env.VITE_API_URL;

export async function getPopularMovies() {
  const response = await fetch(
    `${API_URL}/movies/popular`
  );

  return response.json();
}

export async function getMovie(id: string | number) {
  const response = await fetch(
    `${API_URL}/movies/${id}`
  );

  return response.json();
}



export async function searchMovies(query: string) {
  const response = await fetch(
  `${API_URL}/movies/search?q=${encodeURIComponent(query)}`
);
  return response.json();
}