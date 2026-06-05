import type { Movie } from "../types/movie";

interface Props {
  movie: Movie;
}

export default function MovieCard({
    movie,
}: Props) {
    return (
        <div>
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={200}
            />

      <h3>{movie.title}</h3>
    </div>
  );
}