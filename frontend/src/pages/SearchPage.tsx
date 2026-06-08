import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchMovies } from "../services/movie.service";
import Header from "../components/Header";
import type { Movie } from "../types/movie";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setMovies([]);
        return;
      }

      setIsLoading(true);

      try {
        const data = await searchMovies(query);
        setMovies(data.results || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [query]);

  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };

  const handleSelectMovie = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const featuredMovie = movies[0];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header
        isScrolled={true}
        navigate={navigate}
        onSearch={handleSearch}
      />

      <main className="pt-20">
        {/* Search Title */}
        <section className="px-4 sm:px-6 md:px-12 py-6">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold">
            {query ? (
              <>
                Results for{" "}
                <span className="text-red-500">"{query}"</span>
              </>
            ) : (
              "Search Movies"
            )}
          </h1>

          {query && !isLoading && (
            <p className="mt-2 text-zinc-400">
              {movies.length} result{movies.length !== 1 ? "s" : ""}
            </p>
          )}
        </section>

        {/* Loading */}
        {isLoading ? (
          <section className="px-4 sm:px-6 md:px-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-xl bg-zinc-900 animate-pulse"
                />
              ))}
            </div>
          </section>
        ) : movies.length > 0 ? (
          <>
            {/* Featured Movie */}
            {featuredMovie && (
              <section className="px-4 sm:px-6 md:px-12 mb-12">
                <div
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => handleSelectMovie(featuredMovie.id)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
                    alt={featuredMovie.title}
                    className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-2xl px-6 md:px-12">
                      <h2 className="text-3xl md:text-6xl font-black mb-3">
                        {featuredMovie.title}
                      </h2>

                      <div className="flex gap-4 mb-4 text-sm md:text-base">
                        <span className="text-green-500 font-bold">
                          ★ {featuredMovie.vote_average.toFixed(1)}
                        </span>

                        <span className="text-zinc-300">
                          {featuredMovie.release_date?.split("-")[0]}
                        </span>
                      </div>

                      <p className="text-zinc-300 line-clamp-3 md:text-lg">
                        {featuredMovie.overview}
                      </p>

                      <button
                        className="
                          mt-6
                          bg-white
                          text-black
                          px-6
                          py-3
                          rounded-lg
                          font-bold
                          hover:bg-zinc-200
                          transition
                        "
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Movie Grid */}
            <section className="px-4 sm:px-6 md:px-12 pb-20">
              <h3 className="text-xl font-semibold mb-6">
                More Results
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {movies.slice(1).map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => handleSelectMovie(movie.id)}
                    className="group text-left"
                  >
                    <div className="overflow-hidden rounded-xl bg-zinc-900">
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "/placeholder.jpg"
                        }
                        alt={movie.title}
                        className="
                          w-full
                          aspect-[2/3]
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-110
                        "
                      />
                    </div>

                    <div className="mt-3">
                      <h4
                        className="
                          text-white
                          font-semibold
                          line-clamp-1
                          group-hover:text-red-500
                          transition
                        "
                      >
                        {movie.title}
                      </h4>

                      <div className="flex justify-between items-center mt-1">
                        <span className="text-zinc-500 text-sm">
                          {movie.release_date?.split("-")[0] || "N/A"}
                        </span>

                        <span className="text-yellow-400 text-sm">
                          ★ {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : query ? (
          <section className="flex flex-col items-center justify-center py-32 text-center px-4">
            <div className="text-7xl mb-6">🎬</div>

            <h2 className="text-2xl font-semibold mb-2">
              No results found
            </h2>

            <p className="text-zinc-400 max-w-md">
              We couldn't find anything matching "{query}".
            </p>
          </section>
        ) : (
          <section className="flex flex-col items-center justify-center py-32 text-center px-4">
            <div className="text-7xl mb-6">🔍</div>

            <h2 className="text-2xl font-semibold mb-2">
              Search Movies
            </h2>

            <p className="text-zinc-400">
              Type a movie title in the search bar above.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}