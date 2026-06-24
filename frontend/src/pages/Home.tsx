import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getPopularMovies,
  getTrendingMovies,
  getMoviesByGenre,
  getPopularTv,
  getTrendingTv,
  getTvByGenre,
} from "../services/movie.service";
import MovieRow from "../components/MovieRow";
import Header from "../components/Header";
import ContinueWatching from "../components/ContinueWatching";

import type { Movie } from "../types/movie";

const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL parameters
  const contentType = searchParams.get("type") || "all"; // "all" | "movies" | "tv"
  const genreIdStr = searchParams.get("genre");
  const selectedGenreId = genreIdStr ? Number(genreIdStr) : undefined;
 

  // State
  const [moviesRow1, setMoviesRow1] = useState<Movie[]>([]);
  const [moviesRow2, setMoviesRow2] = useState<Movie[]>([]);
  const [moviesRow3, setMoviesRow3] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Genre infinite scroll state
  const [allGenreMovies, setAllGenreMovies] = useState<Movie[]>([]);
  const [genrePage, setGenrePage] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreGenrePages, setHasMoreGenrePages] = useState(true);
  
  // Refs for preventing race conditions
  const isLoadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scroll handler for navbar transparent/solid transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch data dynamically based on contentType and selectedGenreId
  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      setGenrePage(3);
      setHasMoreGenrePages(true);
      setAllGenreMovies([]);

      try {
        if (selectedGenreId) {
          // Fetch pages 1 and 2 in parallel
          const [page1, page2] = await Promise.all([
            contentType === "tv"
              ? getTvByGenre(selectedGenreId, 1)
              : getMoviesByGenre(selectedGenreId, 1),
            contentType === "tv"
              ? getTvByGenre(selectedGenreId, 2)
              : getMoviesByGenre(selectedGenreId, 2),
          ]);

          const p1Results = page1.results || [];
          const p2Results = page2.results || [];
          const allResults = [...p1Results, ...p2Results];

          setAllGenreMovies(allResults);

          // Check if there are more pages
          const totalPages = page1.total_pages || 1;
          setHasMoreGenrePages(totalPages > 2);

          if (allResults.length > 0) {
            setMoviesRow1(p1Results);

            const topRated = allResults
              .slice()
              .sort((a, b) => b.vote_average - a.vote_average)
              .slice(0, 20);
            setMoviesRow2(topRated);

            setFeaturedMovie(p1Results[Math.floor(Math.random() * p1Results.length)]);
          } else {
            setMoviesRow1([]);
            setMoviesRow2([]);
            setMoviesRow3([]);
            setFeaturedMovie(null);
          }
        } else if (contentType === "tv") {
          const [popularData, trendingData] = await Promise.all([
            getPopularTv(),
            getTrendingTv(),
          ]);

          const popular = popularData.results || [];
          const trending = trendingData.results || [];

          setMoviesRow1(trending);
          setMoviesRow2(popular);
          setMoviesRow3(popular.slice().reverse());

          if (trending.length > 0) {
            setFeaturedMovie(trending[Math.floor(Math.random() * trending.length)]);
          }
        } else if (contentType === "movies") {
          const [popularData, trendingData] = await Promise.all([
            getPopularMovies(),
            getTrendingMovies(),
          ]);

          const popular = popularData.results || [];
          const trending = trendingData.results || [];

          setMoviesRow1(trending);
          setMoviesRow2(popular);
          setMoviesRow3(popular.slice(5, 15));

          if (trending.length > 0) {
            setFeaturedMovie(trending[Math.floor(Math.random() * trending.length)]);
          }
        } else {
          const [popularMoviesData, trendingMoviesData, popularTvData] = await Promise.all([
            getPopularMovies(),
            getTrendingMovies(),
            getPopularTv(),
          ]);

          const popularMovies = popularMoviesData.results || [];
          const trendingMovies = trendingMoviesData.results || [];
          const popularTv = popularTvData.results || [];

          setMoviesRow1(trendingMovies);
          setMoviesRow2(popularTv);
          setMoviesRow3(popularMovies.slice(5, 15));

          if (trendingMovies.length > 0) {
            setFeaturedMovie(trendingMovies[Math.floor(Math.random() * trendingMovies.length)]);
          }
        }
      } catch (error) {
        console.error("Failed to load catalog content:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [contentType, selectedGenreId]);

  // Load more genre movies - use genrePage from closure, calculate nextPage correctly
  const loadMoreGenreMovies = useCallback(async () => {
    // Prevent simultaneous requests
    if (isLoadingRef.current || !selectedGenreId || !hasMoreGenrePages) return;

    isLoadingRef.current = true;
    setIsLoadingMore(true);

    try {
      const data = contentType === "tv"
        ? await getTvByGenre(selectedGenreId, genrePage)
        : await getMoviesByGenre(selectedGenreId, genrePage);

      const newResults = data.results || [];

      if (newResults.length === 0) {
        setHasMoreGenrePages(false);
      } else {
        // Add new movies with deduplication
        setAllGenreMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const unique = newResults.filter((m: Movie) => !existingIds.has(m.id));
          return [...prev, ...unique];
        });

        // Calculate next page and check if we've reached the end
        const totalPages = data.total_pages || 1;
        const nextPage = genrePage + 1;

        // Update page number
        setGenrePage(nextPage);

        // Stop if we've reached the last page
        if (nextPage >= totalPages) {
          setHasMoreGenrePages(false);
        }
      }
    } catch (error) {
      console.error("Failed to load more genre movies:", error);
      setHasMoreGenrePages(false);
    } finally {
      isLoadingRef.current = false;
      setIsLoadingMore(false);
    }
  }, [selectedGenreId, genrePage, hasMoreGenrePages, contentType]);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect();

      if (!node || !selectedGenreId || !hasMoreGenrePages) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isLoadingRef.current) {
            loadMoreGenreMovies();
          }
        },
        {
          root: null,
          rootMargin: "800px 0px",
          threshold: 0,
        }
      );

      observerRef.current.observe(node);
    },
    [selectedGenreId, hasMoreGenrePages, loadMoreGenreMovies]
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  // Actions
  const handleSelectMovie = (id: number, mediaType: "movie" | "tv") => {
    navigate(`/${mediaType === "tv" ? "tv" : "movies"}/${id}`);
  };

  const handleGenreItemClick = (movie: Movie) => {
    const mediaType = contentType === "tv" ? "tv" : "movie";
    handleSelectMovie(movie.id, mediaType as "movie" | "tv");
  };

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleMovieClick = () => {
    setSearchParams({ type: "movies" });
  };

  const handleTvClick = () => {
    setSearchParams({ type: "tv" });
  };

  const handleGenreSelect = (genreId: number) => {
    const newType = contentType !== "all" ? contentType : "movies";
    setSearchParams({ type: newType, genre: String(genreId) });
  };

  // Find genre name
  const currentGenreName = GENRES.find((g) => g.id === selectedGenreId)?.name || "";

  // Featured movie details
  const featuredTitle = featuredMovie ? (featuredMovie.title || (featuredMovie as any).name) : "";
  const featuredOverview = featuredMovie?.overview?.trim() || "No overview available.";

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen text-white overflow-x-hidden">
        <Header
          isScrolled={isScrolled}
          navigate={navigate}
          onSearch={handleSearch}
          
          onMovieClick={handleMovieClick}
          onTvClick={handleTvClick}
          onGenreSelect={handleGenreSelect}
          selectedGenreId={selectedGenreId}
        />

        <div className="relative h-[85vh] md:h-[90vh] bg-zinc-900 animate-pulse">
          <div className="absolute bottom-24 md:bottom-14 left-6 md:left-12 max-w-2xl z-10 space-y-4">
            <div className="h-12 w-96 bg-zinc-800 rounded-lg" />
            <div className="h-4 w-80 bg-zinc-800 rounded" />
            <div className="h-4 w-64 bg-zinc-800 rounded" />
            <div className="flex gap-4 mt-6">
              <div className="h-12 w-32 bg-zinc-800 rounded-full" />
              <div className="h-12 w-36 bg-zinc-800 rounded-md" />
            </div>
          </div>
        </div>

        <div className="space-y-10 md:space-y-14 px-6 md:px-12 py-10">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-7 w-48 bg-zinc-800 rounded mb-4 animate-pulse" />
              <div className="flex gap-3 overflow-hidden">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="w-[320px] h-[400px] bg-zinc-900 rounded-md shrink-0 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden selection:bg-red-600 selection:text-white">
<Header
  isScrolled={isScrolled}
  navigate={navigate}
  onSearch={handleSearch}
  onMovieClick={handleMovieClick}
  onTvClick={handleTvClick}
  onGenreSelect={handleGenreSelect}
  selectedGenreId={selectedGenreId}
/>

      {featuredMovie && (
        <section
          className="relative h-[85vh] md:h-[90vh] bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w1280${featuredMovie.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          <div className="absolute bottom-24 md:bottom-14 left-6 md:left-12 max-w-2xl z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 drop-shadow-2xl line-clamp-2">
              {featuredTitle}
            </h1>

            <p className="text-gray-300 text-sm md:text-lg mb-6 md:mb-8 line-clamp-3 md:line-clamp-4 max-w-xl">
              {featuredOverview}
            </p>

            <div className="flex flex-wrap gap-3 md:gap-4">
              <button
                onClick={() =>
                  handleSelectMovie(
                    featuredMovie.id,
                    !featuredMovie.title && (featuredMovie as any).name ? "tv" : "movie"
                  )
                }
                className="bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded-full font-bold hover:bg-gray-200 transition flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 md:w-6 md:h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clipRule="evenodd"
                  />
                </svg>
                Play
              </button>

              <button
                onClick={() =>
                  handleSelectMovie(
                    featuredMovie.id,
                    !featuredMovie.title && (featuredMovie as any).name ? "tv" : "movie"
                  )
                }
                className="bg-gray-500/70 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold hover:bg-gray-500/90 transition flex items-center gap-2 backdrop-blur-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 md:w-6 md:h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                More Info
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="relative z-20 pb-20 -mt-18 md:mt-18 space-y-4 md:space-y-6">
        {selectedGenreId ? (
          <>
            {allGenreMovies.length > 0 ? (
              <>
                <MovieRow
                  title={`Popular ${currentGenreName} ${contentType === "tv" ? "TV Shows" : "Movies"}`}
                  movies={moviesRow1}
                  onPlay={handleSelectMovie}
                  onMoreInfo={handleSelectMovie}
                />
                <MovieRow
                  title="Critically Acclaimed"
                  movies={moviesRow2}
                  onPlay={handleSelectMovie}
                  onMoreInfo={handleSelectMovie}
                />

                <div className="px-6 md:px-12 mt-10">
                  <h2 className="text-xl md:text-2xl font-bold mb-6 tracking-wide">
                    All {currentGenreName} {contentType === "tv" ? "TV Shows" : "Movies"}
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
                    {allGenreMovies.map((movie) => (
                      <div
                        key={movie.id}
                        onClick={() => handleGenreItemClick(movie)}
                        className="cursor-pointer group"
                      >
                        <div className="overflow-hidden rounded-xl bg-zinc-900">
                          <img
                            src={
                              movie.poster_path
                                ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                                : "/placeholder.jpg"
                            }
                            alt={movie.title || (movie as any).name}
                            loading="lazy"
                            decoding="async"
                            className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        <div className="mt-3">
                          <h4 className="text-white font-semibold line-clamp-1 group-hover:text-red-500 transition">
                            {movie.title || (movie as any).name}
                          </h4>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-zinc-500 text-sm">
                              {(movie.release_date || (movie as any).first_air_date || "")?.split("-")[0] || "N/A"}
                            </span>
                            <span className="text-yellow-400 text-sm">
                              ★ {movie.vote_average?.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div ref={loadMoreRef} className="h-32 flex justify-center items-center">
                    {isLoadingMore && (
                      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    {!isLoadingMore && hasMoreGenrePages && (
                      <button
                        onClick={loadMoreGenreMovies}
                        className="bg-zinc-800 text-white px-5 py-2 rounded-full font-semibold hover:bg-zinc-700 transition"
                      >
                        Load more
                      </button>
                    )}
                    {!hasMoreGenrePages && allGenreMovies.length > 0 && (
                      <p className="text-zinc-600 text-sm">No more results</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-zinc-500 text-lg">
                No items found for this genre.
              </div>
            )}
          </>
        ) : contentType === "tv" ? (
          <>
            <MovieRow
              title="Trending TV Shows"
              movies={moviesRow1}
              onPlay={handleSelectMovie}
              onMoreInfo={handleSelectMovie}
            />
            <MovieRow
              title="Popular TV Shows"
              movies={moviesRow2}
              onPlay={handleSelectMovie}
              onMoreInfo={handleSelectMovie}
            />
            <MovieRow
              title="Airing Today"
              movies={moviesRow3}
              onPlay={handleSelectMovie}
              onMoreInfo={handleSelectMovie}
            />
          </>
        ) : contentType === "movies" ? (
          <>
            <MovieRow
              title="Trending Movies"
              movies={moviesRow1}
              onPlay={handleSelectMovie}
              onMoreInfo={handleSelectMovie}
            />

            <ContinueWatching
  onPlay={handleSelectMovie}
  onMoreInfo={handleSelectMovie}
/>
            <MovieRow
              title="Popular Movies"
              movies={moviesRow2}
              onPlay={handleSelectMovie}
              onMoreInfo={handleSelectMovie}
            />


            <MovieRow
              title="Upcoming Blockbusters"
              movies={moviesRow3}
              onPlay={handleSelectMovie}
              onMoreInfo={handleSelectMovie}
            />
          </>
        ) : (
          <>
            <MovieRow
              title="Trending Now"
              movies={moviesRow1}
              onPlay={handleSelectMovie}
              onMoreInfo={handleSelectMovie}
            />
            <ContinueWatching
              onPlay={handleSelectMovie}
              onMoreInfo={handleSelectMovie}
            />
            <MovieRow
              title="Popular TV Shows"
              movies={moviesRow2}
              onPlay={handleSelectMovie}
              onMoreInfo={handleSelectMovie}
            />
            <MovieRow
              title="Blockbuster Movies"
              movies={moviesRow3}
              onPlay={handleSelectMovie}
              onMoreInfo={handleSelectMovie}
            />
          </>
        )}
      </div>
    </div>
  );
}
