import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovie, getMovieImages, getSimilarMovies } from "../services/movie.service";
import { addToContinueWatching } from "../utils/continueWatching";
import type { MovieDetail, SimilarMovie, TmdbImages, TmdbLogo } from "../types/movie";
import { useRef } from "react";

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [error, setError] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (showPlayer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPlayer]);

  useEffect(() => {
    async function loadMovie() {
      setIsLoading(true);
      setError("");
      setLogoUrl(null);
      setSimilarMovies([]);

      try {
        const data = await getMovie(Number(id));
        setMovie(data);

        // Load similar movies
        try {
          const similar = await getSimilarMovies(Number(id));
          setSimilarMovies(similar.results || []);
        } catch (err) {
          console.error("Failed to load similar movies", err);
        }

        // Load movie logo
        try {
          const images: TmdbImages = await getMovieImages(Number(id));
          const logo =
            images.logos?.find((l: TmdbLogo) => l.iso_639_1 === "en") ||
            images.logos?.[0];

          if (logo) {
            setLogoUrl(`https://image.tmdb.org/t/p/w500${logo.file_path}`);
          }
        } catch (err) {
          console.error("Failed to load logo", err);
        }
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
    <div
    
    className="bg-black text-white min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/60 to-transparent px-10 py-5">
        <div className="flex items-center gap-8">
<div onClick={() => navigate("/")} className="cursor-pointer">
  <img
    src="/logo.png"
    alt="Cinefy Logo"
    className="h-12 w-auto"
  />
</div>

          <button
            onClick={() => navigate(-1)}
            className="text-zinc-400 hover:text-white transition text-sm flex items-center gap-1.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </nav>

      {/* Full-Screen Hero with Video Preview */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background: Trailer or Backdrop */}
        <img
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title}
          className="
  absolute inset-0
  w-full h-full
  object-cover
  object-[60%_center]
"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

        {/* Hero Content */}
        <div className="absolute bottom-12 left-12 right-12 md:left-16 md:right-auto max-w-xl z-10">
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

          {logoUrl ? (
            <img
              src={logoUrl}
              alt={movie.title}
              className="
  w-auto
  max-w-[220px]
  sm:max-w-[320px]
  md:max-w-[450px]
  lg:max-w-[600px]
  max-h-[100px]
  sm:max-h-[140px]
  md:max-h-[180px]
  lg:max-h-[220px]
  object-contain
  mb-5
"
            />
          ) : (
            <h1 className="text-7xl font-black mb-5 drop-shadow-xl leading-none">
              {movie.title}
            </h1>
          )}

          {movie.tagline && (
            <p className="italic text-zinc-400 text-base mb-5 border-l-3 border-red-600 pl-4">
              "{movie.tagline}"
            </p>
          )}

          <p className="text-zinc-300 text-md mb-8 leading-relaxed line-clamp-3 max-w-xl">
            {movie.overview || "No overview available."}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                addToContinueWatching({
                  id: movie.id,
                  title: movie.title,
                  poster_path: movie.poster_path,
                  backdrop_path: movie.backdrop_path,
                  overview: movie.overview,
                  vote_average: movie.vote_average,
                  release_date: movie.release_date,
                  media_type: "movie",
                });
                setShowPlayer(true);
              }}
              className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-zinc-200 transition flex items-center gap-2 text-lg shadow-lg"
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
              className="bg-zinc-700/80 backdrop-blur-sm px-8 py-3 rounded-md font-bold hover:bg-zinc-600 transition text-lg"
            >
              ⓘ More Info
            </button>
          </div>
        </div>
      </section>

      {/* Movie Details Section */}
      <section id="movie-details" className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20 bg-black">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Main Content Area (Left) */}
          <div className="flex-1 space-y-12">
            {/* Storyline */}
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white">
                Storyline
              </h2>
              <p className="text-zinc-300 text-lg md:text-xl leading-relaxed font-light">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="pt-8 border-t border-zinc-800/60">
                <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500 mb-5">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-3">
                  {movie.genres.map((g) => (
                    <span
                      key={g.id}
                      className="bg-zinc-800/40 text-zinc-200 px-5 py-2 rounded-full text-sm font-medium hover:bg-zinc-700 transition cursor-default"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Production Companies */}
            {movie.production_companies && movie.production_companies.length > 0 && (
              <div className="pt-8 border-t border-zinc-800/60">
                <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-500 mb-6">
                  Production
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {movie.production_companies.map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center justify-center p-5 bg-zinc-900/30 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition"
                    >
                      {company.logo_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                          alt={company.name}
                          className="max-h-8 object-contain filter invert opacity-60"
                        />
                      ) : (
                        <span className="text-zinc-400 font-medium text-sm text-center">
                          {company.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Details (Right) */}
          <div className="lg:w-1/3">
            <div>
              <h3 className="text-xl font-bold text-white mb-8">Movie Info</h3>

              <dl className="space-y-6">
                {/* Rating */}
                <div className="flex flex-col">
                  <dt className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-1">
                    Rating
                  </dt>
                  <dd className="flex items-baseline gap-2">
                    <span
                      className={`text-3xl font-black ${
                        movie.vote_average >= 8
                          ? "text-green-500"
                          : movie.vote_average >= 6
                            ? "text-yellow-500"
                            : "text-red-500"
                      }`}
                    >
                      {movie.vote_average?.toFixed(1)}
                    </span>
                    <span className="text-sm text-zinc-500 font-medium">
                      / 10 ({movie.vote_count?.toLocaleString()} votes)
                    </span>
                  </dd>
                </div>

                <hr className="border-zinc-800/60" />

                {/* Duration */}
                {movie.runtime > 0 && (
                  <>
                    <div className="flex flex-col">
                      <dt className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-1">
                        Duration
                      </dt>
                      <dd className="text-lg text-zinc-200 font-medium">
                        {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                      </dd>
                    </div>
                    <hr className="border-zinc-800/60" />
                  </>
                )}

                {/* Release Date */}
                <div className="flex flex-col">
                  <dt className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-1">
                    Release Date
                  </dt>
                  <dd className="text-lg text-zinc-200 font-medium">
                    {movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </dd>
                </div>

                {/* Budget & Revenue */}
                {(movie.budget > 0 || movie.revenue > 0) && (
                  <>
                    <hr className="border-zinc-800/60" />
                    <div className="grid grid-cols-2 gap-4">
                      {movie.budget > 0 && (
                        <div className="flex flex-col">
                          <dt className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-1">
                            Budget
                          </dt>
                          <dd className="text-lg text-zinc-200 font-medium">
                            ${(movie.budget / 1000000).toFixed(1)}M
                          </dd>
                        </div>
                      )}
                      {movie.revenue > 0 && (
                        <div className="flex flex-col">
                          <dt className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-1">
                            Box Office
                          </dt>
                          <dd className="text-lg text-emerald-400 font-medium">
                            ${(movie.revenue / 1000000).toFixed(1)}M
                          </dd>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Languages */}
                {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                  <>
                    <hr className="border-zinc-800/60" />
                    <div className="flex flex-col">
                      <dt className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-1">
                        Languages
                      </dt>
                      <dd className="text-sm text-zinc-300 leading-relaxed">
                        {movie.spoken_languages.map((l) => l.english_name).join(", ")}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pb-0">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white tracking-tight">
            Similar Movies
          </h2>

          <div className="relative group">
            {/* LEFT ARROW */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-6 md:left-0 top-1/2 -translate-y-1/2 z-20
                       opacity-0 group-hover:opacity-100 transition-opacity
                       bg-black/70 hover:bg-red-600 text-white
                       w-12 h-12 rounded-full flex items-center justify-center
                       backdrop-blur-md transition-colors"
              aria-label="Scroll left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* RIGHT ARROW */}
            <button
              onClick={() => scroll("right")}
              className="absolute -right-6 md:right-0 top-1/2 -translate-y-1/2 z-20
                       opacity-0 group-hover:opacity-100 transition-opacity
                       bg-black/70 hover:bg-red-600 text-white
                       w-12 h-12 rounded-full flex items-center justify-center
                       backdrop-blur-md transition-colors"
              aria-label="Scroll right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Scroll Container - NO SCROLLBAR, NO OVERLAP */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory
                       [&::-webkit-scrollbar]:hidden
                       [-ms-overflow-style:none]
                       [scrollbar-width:none]"
            >
              {similarMovies.map((m) => (
                <div
                  key={m.id}
                  onClick={() => navigate(`/movies/${m.id}`)}
                  className="flex-shrink-0 snap-start cursor-pointer group/card"
                  style={{ minWidth: "200px" }}
                >
                  {/* Poster Card */}
                  <div className="aspect-[2/3] w-[300px] rounded-lg overflow-hidden bg-zinc-900 shadow-lg transition-transform duration-300 group-hover/card:scale-105">
                    {m.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
                        alt={m.title}
                        className="w-full h-full object-cover transition-brightness duration-300 group-hover/card:brightness-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs text-center p-2 bg-zinc-800">
                        No Poster Available
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <p className="mt-3 text-sm text-zinc-300 line-clamp-2 group-hover/card:text-white transition w-[200px]">
                    {m.title}
                  </p>

                  {/* Release Year */}
                  {m.release_date && (
                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(m.release_date).getFullYear()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Player Modal */}
      {showPlayer && (
        <div className="fixed inset-0 z-50 bg-black/95">
          {/* Close button */}
          <button
            onClick={() => setShowPlayer(false)}
            className="absolute top-6 right-6 text-white text-4xl z-50 hover:text-red-600 transition"
            aria-label="Close player"
          >
            ✕
          </button>

          {/* Video Player */}
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