import { useState } from "react";

interface MoviePreviewCardProps {
  movie: any;
  onPlay?: (id: number) => void;
  onMoreInfo?: (id: number) => void;
}

export default function MoviePreviewCard({
  movie,
  onPlay,
  onMoreInfo,
}: MoviePreviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex-shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster */}
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className={`
          w-[220px] h-[330px] object-cover rounded-md
          transition-all duration-300 cursor-pointer
          ${isHovered ? "opacity-0" : "opacity-100"}
        `}
      />

      {/* Floating Preview */}
      {isHovered && (
        <div
          className="
            absolute top-0 left-0
            w-[420px]
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
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />

            {/* Movie Title */}
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-3xl font-black text-white drop-shadow-lg truncate">
                {movie.title}
              </h2>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onPlay?.(movie.id)}
                  className="
                    bg-white
                    text-black
                    px-5
                    py-1.5
                    rounded-md
                    font-bold
                    flex items-center gap-1.5
                    hover:bg-zinc-200
                    text-sm
                    transition
                  "
                >
                  ▶ Play
                </button>
                <button
                  onClick={() => onMoreInfo?.(movie.id)}
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
                  ⓘ Info
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex gap-3 items-center mb-3">
              <span className="text-green-500 font-semibold">
                {Math.round(movie.vote_average * 10)}% Match
              </span>

              <span className="text-zinc-400">
                {movie.release_date?.split("-")[0]}
              </span>
            </div>

            <p className="text-zinc-300 text-sm line-clamp-3">
              {movie.overview}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
