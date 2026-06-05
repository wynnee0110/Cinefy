import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPopularMovies } from "../services/movie.service";
import MovieRow from "../components/MovieRow";
import Header from "../components/Header";

export default function Home() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState<any[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);


  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // Handle Navbar Background on Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="bg-black min-h-screen text-white overflow-x-hidden selection:bg-red-600 selection:text-white">
      
      {/* Dynamic Navbar */}
      <Header
  isScrolled={isScrolled}
  navigate={navigate}
  onSearch={handleSearch}
/>


      {/* Hero Section */}
      {featuredMovie && (
        <section
          className="relative h-[85vh] md:h-[90vh] bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
          }}
        >
          {/* Enhanced Overlays for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-24 md:bottom-12 left-6 md:left-12 max-w-2xl z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 drop-shadow-2xl">
              {featuredMovie.title}
            </h1>

            <p className="text-gray-300 text-sm md:text-lg mb-6 md:mb-8 line-clamp-3 md:line-clamp-4 max-w-xl">
              {featuredMovie.overview}
            </p>

            <div className="flex flex-wrap gap-3 md:gap-4">
              <button 
                onClick={() => handleSelectMovie(featuredMovie.id)}
                className="bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded-full md:rounded-full font-bold hover:bg-gray-200 transition flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
                Play
              </button>

              <button 
                onClick={() => handleSelectMovie(featuredMovie.id)}
                className="bg-gray-500/70 text-white px-6 md:px-8 py-2 md:py-3 rounded md:rounded-md font-bold hover:bg-gray-500/90 transition flex items-center gap-2 backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                More Info
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Movie Rows */}
      <div className="relative z-20 pb-20 -mt-12 md:-mt-[-64px] space-y-10 md:space-y-14">
        <MovieRow
          title="Trending Now"
          movies={movies}
          onPlay={handleSelectMovie}
          onMoreInfo={handleSelectMovie}
        />

        <MovieRow
          title="Popular Movies"
          movies={[...movies].reverse()}
          onPlay={handleSelectMovie}
          onMoreInfo={handleSelectMovie}
        />

        <MovieRow
          title="Top Picks For You"
          movies={movies.slice(5, 15)}
          onPlay={handleSelectMovie}
          onMoreInfo={handleSelectMovie}
        />
      </div>
    </div>
  );
}