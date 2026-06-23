import { useState } from "react";
import type { Movie } from "../types/movie";

interface MoviePreviewCardProps {
  movie: Movie;
  onPlay?: (id: number, mediaType: "movie" | "tv") => void;
  onMoreInfo?: (id: number, mediaType: "movie" | "tv") => void;
}

export default function MoviePreviewCard({
  movie,
  onPlay,
  onMoreInfo,
}: MoviePreviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isTv = !movie.title && !!(movie as any).name;
  const title = movie.title || (movie as any).name || "Untitled";
  const releaseDate = movie.release_date || (movie as any).first_air_date || "";
  const mediaType = isTv ? "tv" : "movie";

  return (
    <div
      className="relative flex-shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster */}
      <img
        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
        alt={title}
        loading="lazy"
        decoding="async"
        className={`
          w-[320px] h-[400px] object-cover rounded-md
          transition-all duration-300 cursor-pointer rounded-xl
          ${isHovered ? "opacity-0" : "opacity-100"}
        `}
      />

      {/* Floating Preview */}
      {isHovered && (
        <div  
          className="
            absolute top-0 left-0
            w-[320px]
            h-[400px]
            bg-zinc-900
            rounded-xl
            overflow-hidden
            shadow-2xl
            z-50
            animate-in fade-in zoom-in-95
          "
        >
          {/* Backdrop */}
          <div className="relative h-[240px]">
            <img
              src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path || movie.poster_path}`}
              alt={title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />

            {/* Movie Title */}
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-3xl font-black text-white drop-shadow-lg truncate">
                {title}
              </h2>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onPlay?.(movie.id, mediaType)}
                  className="
                    bg-white
                    text-black
                    px-5
                    py-1.5
                    rounded-full
                    font-bold
                    flex items-center gap-1.5

                    hover:bg-zinc-200
                    text-sm
                    transition
                  "
                  
                >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
                   Play
                </button>
                <button
                  onClick={() => onMoreInfo?.(movie.id, mediaType)}
                  className="
                    bg-zinc-700/80
                    text-white
                    px-5
                    py-1.5
                    rounded-md
                    font-bold
                    flex items-center gap-1.5
                    hover:bg-zinc-600
                    text-sm
                    transition
                  "
                >
                  Info
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex gap-3 items-center mb-3">
              <span className="text-green-500 font-semibold">
                {Math.round(movie.vote_average * 10)}% Rating
              </span>

              <span className="text-zinc-400">
                {releaseDate?.split("-")[0]}
              </span>
            </div>

            <p className="text-zinc-300 text-sm line-clamp-3">
              {movie.overview?.trim() || "No overview available."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
