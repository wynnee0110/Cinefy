import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovie } from "../services/movie.service";
import type { MovieDetail, VideoResult } from "../types/movie";

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
  if (showPlayer) {
    // lock scroll
    document.body.style.overflow = "hidden";
  } else {
    // restore scroll
    document.body.style.overflow = "auto";
  }

  // cleanup in case component unmounts while open
  return () => {
    document.body.style.overflow = "auto";
  };
}, [showPlayer]);

  useEffect(() => {
    async function loadMovie() {
      setIsLoading(true);
      setError("");
      try {
        const data = await getMovie(Number(id));
        setMovie(data);
      } catch (error) {
        console.error("Failed to load movie:", error);
        setMovie(null);
        setError(error instanceof Error ? error.message : "Failed to load movie.");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) loadMovie();
  }, [id]);

  // Extract YouTube trailer key
  const getTrailerKey = (movieDetail: MovieDetail | null) => {
    if (!movieDetail?.videos?.results) return null;
    const videos = movieDetail.videos.results;

    const trailer = videos.find(
      (vid: VideoResult) => vid.site === "YouTube" && vid.type === "Trailer"
    );
    if (trailer) return trailer.key;

    const clip = videos.find((vid: VideoResult) => vid.site === "YouTube");
    if (clip) return clip.key;

    return null;
  };

  const trailerKey = movie ? getTrailerKey(movie) : null;

  if (isLoading || !movie) {
    if (error) {
      return (
        <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white px-6 text-center">
          <h1 className="text-3xl font-bold mb-3">Movie unavailable</h1>
          <p className="text-zinc-400 max-w-md">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-zinc-200 transition"
          >
            Go Back
          </button>
        </div>
      );
    }

    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/60 to-transparent px-10 py-5">
        <div className="flex items-center gap-8">
          <h1
            className="text-red-600 text-4xl font-black tracking-tight cursor-pointer"
            onClick={() => navigate("/")}
          >
            CINEFY
          </h1>

          <button
            onClick={() => navigate(-1)}
            className="text-zinc-400 hover:text-white transition text-sm flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </nav>

      {/* Full-Screen Hero with Video Preview */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background: Trailer or Backdrop */}
        {trailerKey ? (
<img
  src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
  className="absolute inset-0 w-full h-full object-cover"
/>
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path}`}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

        {/* Hero Content */}
        <div className="absolute bottom-24 left-12 right-12 md:left-16 md:right-auto max-w-2xl z-10">
          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold mb-4">
            {movie.vote_average > 0 && (
              <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md">
                {(movie.vote_average * 10).toFixed(0)}% Match
              </span>
            )}
            <span className="text-zinc-300">
              {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
            </span>
            {movie.runtime > 0 && (
              <span className="text-zinc-300">
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            )}
            <span className="text-zinc-400 border border-zinc-600 px-2 py-0.5 text-xs rounded font-bold">
              HD
            </span>
          </div>

          <h1 className="text-7xl font-black mb-5 drop-shadow-xl leading-none">
            {movie.title}
          </h1>

          {movie.tagline && (
            <p className="italic text-zinc-400 text-base mb-5 border-l-3 border-red-600 pl-4">
              "{movie.tagline}"
            </p>
          )}

          <p className="text-zinc-300 text-lg mb-8 leading-relaxed line-clamp-3 max-w-xl">
            {movie.overview || "No overview available."}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
<button
  onClick={() => setShowPlayer(true)}
  className="bg-white text-black px-5 py-0.5 rounded-full font-bold hover:bg-zinc-200 transition flex items-center gap-2 text-lg shadow-lg"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
  Play
</button>

            <button
              onClick={() => {
                document.getElementById("movie-details")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-zinc-700/80 backdrop-blur-sm px-8 py-3.5 rounded-md font-bold hover:bg-zinc-600 transition text-lg"
            >
              ⓘ More Info
            </button>
          </div>
        </div>

        {/* Big Centered Play Button Overlay */}

      </section>

      {/* Movie Details Section */}
      <section id="movie-details" className="max-w-7xl mx-auto px-10 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left: Overview & Description */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">About {movie.title}</h2>
              <p className="text-zinc-300 text-lg leading-relaxed">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <span
                      key={g.id}
                      className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-1.5 rounded-full text-sm hover:border-zinc-600 transition"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Production Companies */}
            {movie.production_companies && movie.production_companies.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-3">Production</h3>
                <div className="flex flex-wrap gap-4">
                  {movie.production_companies.map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2"
                    >
                      {company.logo_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                          alt={company.name}
                          className="h-6 object-contain invert opacity-70"
                        />
                      ) : (
                        <span className="text-zinc-400 text-sm">{company.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Metadata sidebar */}
          <div className="space-y-6">
            {/* Rating */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">Rating</h3>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-white">
                  {movie.vote_average?.toFixed(1)}
                </span>
                <div className="text-zinc-400 text-sm">
                  <div>out of 10</div>
                  <div>{movie.vote_count?.toLocaleString()} votes</div>
                </div>
              </div>
            </div>

            {/* Runtime */}
            {movie.runtime > 0 && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">Runtime</h3>
                <span className="text-xl font-bold text-white">
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
                <span className="text-zinc-500 text-sm ml-2">({movie.runtime} min)</span>
              </div>
            )}

            {/* Release Date */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">Release Date</h3>
              <span className="text-lg font-semibold text-white">
                {movie.release_date
                  ? new Date(movie.release_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>

            {/* Budget & Revenue */}
            {(movie.budget > 0 || movie.revenue > 0) && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-3">
                {movie.budget > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1">Budget</h3>
                    <span className="text-lg font-semibold text-white">
                      ${movie.budget.toLocaleString()}
                    </span>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1">Revenue</h3>
                    <span className="text-lg font-semibold text-emerald-400">
                      ${movie.revenue.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Countries */}
            {movie.production_countries && movie.production_countries.length > 0 && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">Country</h3>
                <span className="text-white">
                  {movie.production_countries.map((c) => c.name).join(", ")}
                </span>
              </div>
            )}

            {/* Languages */}
            {movie.spoken_languages && movie.spoken_languages.length > 0 && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">Languages</h3>
                <span className="text-white">
                  {movie.spoken_languages.map((l) => l.english_name).join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {showPlayer && (
  <div className="fixed inset-0 z-50 bg-black">
    
    {/* Close button */}
    <button
      onClick={() => setShowPlayer(false)}
      className="absolute top-5 right-5 text-white text-3xl z-50"
    >
      ✕
    </button>

    {/* VidKing FULL VIDEO */}
    <iframe
      src={`https://www.vidking.net/embed/movie/${movie.id}`}
      className="w-full h-full"
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  </div>
)}
    </div>
  );
}
