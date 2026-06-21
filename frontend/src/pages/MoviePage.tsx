import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovie } from "../services/movie.service";
import type { MovieDetail, VideoResult } from "../types/movie";


interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
}

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [error, setError] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);


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
        try {
  const res = await fetch(`http://localhost:5000/movies/${id}/similar`);
  const data = await res.json();

  setSimilarMovies(data.results || []);
} catch (err) {
  console.error("Failed to load similar movies", err);
}
        
          try {
  const res = await fetch(
    `http://localhost:5000/movies/${id}/images`
  );

  const images = await res.json();

  const logo =
    images.logos?.find((l: any) => l.iso_639_1 === "en") ||
    images.logos?.[0];

  if (logo) {
    setLogoUrl(
      `https://image.tmdb.org/t/p/w500${logo.file_path}`
    );
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
    className="max-w-[600px] max-h-[220px] object-contain mb-5"
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
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-8 sticky top-28">
              <h3 className="text-xl font-bold text-white mb-8">Movie Info</h3>
              
              <dl className="space-y-6">
                {/* Rating */}
                <div className="flex flex-col">
                  <dt className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-1">
                    Rating
                  </dt>
                  <dd className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">
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
                {((movie.budget > 0) || (movie.revenue > 0)) && (
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
                        {movie.spoken_languages.map(l => l.english_name).join(", ")}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>
          
        </div>
  </section> {/* End Movie Details Section */}

{/* Similar Movies Section */}
{similarMovies.length > 0 && (
  <section className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pb-20">
    <h2 className="text-3xl md:text-4xl font-black mb-8 text-white">
      Similar Movies
    </h2>

    <div className="flex gap-5 overflow-x-auto pb-4">
      {similarMovies.map((m) => (
        <div
          key={m.id}
          onClick={() => navigate(`/movie/${m.id}`)}
          className="min-w-[160px] md:min-w-[180px] cursor-pointer group"
        >
          <div className="relative rounded-xl overflow-hidden bg-zinc-900">
            <img
              src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
              alt={m.title}
              className="w-full h-[260px] object-cover group-hover:scale-105 transition duration-300"
            />

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="font-bold">View</span>
            </div>
          </div>

          <p className="mt-2 text-sm text-zinc-300 truncate">
            {m.title}
          </p>
        </div>
      ))}
    </div>
  </section>
)}

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
