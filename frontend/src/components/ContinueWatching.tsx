import { useEffect, useState } from "react";
import MovieRow from "./MovieRow";
import type { Movie } from "../types/movie";

interface Props {
  onPlay: (id: number, mediaType: "movie" | "tv") => void;
  onMoreInfo: (id: number, mediaType: "movie" | "tv") => void;
}

export default function ContinueWatching({
  onPlay,
  onMoreInfo,
}: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cinefy_continue_movies");

    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setMovies(parsed);
    } catch {
      console.error("Failed to load continue watching");
    }
  }, []);

  if (movies.length === 0) return null;

  return (
    <MovieRow
      title="Continue Watching"
      movies={movies}
      onPlay={onPlay}
      onMoreInfo={onMoreInfo}
    />
  );
}