import { useEffect, useState } from "react";
import MovieRow from "./MovieRow";
import type { Movie } from "../types/movie";
import { getContinueWatching } from "../utils/continueWatching";

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
    setMovies(getContinueWatching());
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