const API_URL = "http://localhost:5000";

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