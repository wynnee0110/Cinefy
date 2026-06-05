import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPopularMovies } from "../services/movie.service";
import MoviePreviewCard from "../components/MoviePreviewCard";

export default function Home() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState<any[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await getPopularMovies();

        setMovies(data.results);

        if (data.results.length > 0) {
          const randomMovie =
            data.results[Math.floor(Math.random() * data.results.length)];

          setFeaturedMovie(randomMovie);
        }
      } catch (error) {
        console.error("Failed to load movies:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMovies();
  }, []);

  const handleSelectMovie = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black via-black/80 to-transparent px-10 py-5">
        <div className="flex items-center">
          <h1 className="text-red-600 text-4xl font-black tracking-tight cursor-pointer" onClick={() => navigate("/")}>
            CINEFY
          </h1>
        </div>
      </nav>

      {/* Hero Section */}
      {featuredMovie && (
        <section
          className="relative h-[90vh] bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute bottom-32 left-12 max-w-2xl z-10">
            <h1 className="text-7xl font-black mb-6 drop-shadow-xl">
              {featuredMovie.title}
            </h1>

            <p className="text-zinc-300 text-lg mb-8 line-clamp-3 max-w-xl">
              {featuredMovie.overview}
            </p>

            <div className="flex gap-4">
              <button 
                onClick={() => handleSelectMovie(featuredMovie.id)}
                className="bg-white text-black px-8 py-3 rounded-md font-bold hover:bg-zinc-200 transition flex items-center gap-2"
              >
                ▶ Play
              </button>

              <button 
                onClick={() => handleSelectMovie(featuredMovie.id)}
                className="bg-zinc-700/80 px-8 py-3 rounded-md font-bold hover:bg-zinc-600 transition"
              >
                More Info
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Trending Row */}
      <section className="-mt-32 relative z-20 px-12 pb-16">
        <h2 className="text-3xl font-bold mb-6">
          Trending Now
        </h2>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide py-12">
          {movies.map((movie) => (
            <MoviePreviewCard
              key={movie.id}
              movie={movie}
              onPlay={handleSelectMovie}
              onMoreInfo={handleSelectMovie}
            />
          ))}
        </div>
      </section>

      {/* Popular Row */}
      <section className="px-12 pb-16">
        <h2 className="text-3xl font-bold mb-6">
          Popular Movies
        </h2>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide py-12">
          {movies.map((movie) => (
            <MoviePreviewCard
              key={`popular-${movie.id}`}
              movie={movie}
              onPlay={handleSelectMovie}
              onMoreInfo={handleSelectMovie}
            />
          ))}
        </div>
      </section>

      {/* Top Rated Row */}
      <section className="px-12 pb-24">
        <h2 className="text-3xl font-bold mb-6">
          Top Picks For You
        </h2>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide py-12">
          {movies.map((movie) => (
            <MoviePreviewCard
              key={`top-${movie.id}`}
              movie={movie}
              onPlay={handleSelectMovie}
              onMoreInfo={handleSelectMovie}
            />
          ))}
        </div>
      </section>
    </div>
  );
}