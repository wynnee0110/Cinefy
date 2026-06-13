import { useEffect, useState } from "react";
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
import MoviePreviewCard from "../components/MoviePreviewCard";
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
  const selectedGenreId = genreIdStr ? Number(genreIdStr) : null;

  // State
  const [moviesRow1, setMoviesRow1] = useState<Movie[]>([]);
  const [moviesRow2, setMoviesRow2] = useState<Movie[]>([]);
  const [moviesRow3, setMoviesRow3] = useState<Movie[]>([]);
  const [genreGridItems, setGenreGridItems] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

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
      try {
        if (selectedGenreId) {
          // Genre-specific grid view
          let data;
          if (contentType === "tv") {
            data = await getTvByGenre(selectedGenreId);
          } else {
            data = await getMoviesByGenre(selectedGenreId);
          }
          const results = data.results || [];
          setGenreGridItems(results);

          if (results.length > 0) {
            // Select a random result from this genre for the featured hero banner
            setFeaturedMovie(results[Math.floor(Math.random() * results.length)]);
          } else {
            setFeaturedMovie(null);
          }
        } else if (contentType === "tv") {
          // TV Shows view
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
          // Movies view
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
          // Default Home view (Mixed)
          const [popularMoviesData, trendingMoviesData, popularTvData] = await Promise.all([
            getPopularMovies(),
            getTrendingMovies(),
            getPopularTv(),
          ]);

          const popularMovies = popularMoviesData.results || [];
          const trendingMovies = trendingMoviesData.results || [];
          const popularTv = popularTvData.results || [];

          setMoviesRow1(trendingMovies);
          setMoviesRow2(popularTv); // Showcase TV shows on homepage row 2
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

  // Actions
  const handleSelectMovie = (id: number, mediaType: "movie" | "tv") => {
    navigate(`/${mediaType === "tv" ? "tv" : "movies"}/${id}`);
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
    // Keep current type if active, otherwise filter general movies by genre
    const newType = contentType !== "all" ? contentType : "movies";
    setSearchParams({ type: newType, genre: String(genreId) });
  };

  // Find human-readable genre name
  const currentGenreName = GENRES.find((g) => g.id === selectedGenreId)?.name || "";

  // Helper values for background details mapping
  const featuredTitle = featuredMovie ? (featuredMovie.title || (featuredMovie as any).name) : "";
  const featuredOverview = featuredMovie ? featuredMovie.overview : "";

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* Header */}
      <Header
        isScrolled={isScrolled}
        navigate={navigate}
        onSearch={handleSearch}
        onMovieClick={handleMovieClick}
        onTvClick={handleTvClick}
        onGenreSelect={handleGenreSelect}
      />

      {/* Hero Section */}
      {featuredMovie && (
        <section
          className="relative h-[85vh] md:h-[90vh] bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-24 md:bottom-14 left-6 md:left-12 max-w-2xl z-10">
            {/* Show Category Chip */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 drop-shadow-2xl">
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

      {/* Main Browse Catalog */}
      <div className="relative z-20 pb-20 -mt-18 md:mt-18 space-y-10 md:space-y-14">
        {selectedGenreId ? (
          /* Genre Grid View */
          <section className="px-6 md:px-12 pt-8">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-wide">
              {currentGenreName} {contentType === "tv" ? "TV Shows" : "Movies"}
            </h2>

            {genreGridItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {genreGridItems.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="relative group">
                    <MoviePreviewCard
                      movie={item}
                      onPlay={handleSelectMovie}
                      onMoreInfo={handleSelectMovie}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-zinc-500 text-lg">
                No items found for this genre.
              </div>
            )}
          </section>
        ) : contentType === "tv" ? (
          /* TV Shows Rows */
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
          /* Movies Rows */
          <>
            <MovieRow
              title="Trending Movies"
              movies={moviesRow1}
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
          /* Default Mixed View */
          <>
            <MovieRow
              title="Trending Now"
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