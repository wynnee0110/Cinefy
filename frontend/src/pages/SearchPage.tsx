import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchMovies } from "../services/movie.service";
import MoviePreviewCard from "../components/MoviePreviewCard";
import Header from "../components/Header";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [movies, setMovies] = useState<any[]>([]);
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
        console.error("Failed to fetch search results:", error);
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

  return (
    <div className="bg-black min-h-screen text-white selection:bg-red-600 selection:text-white">
      {/* Header */}
      <Header
        isScrolled={true}
        navigate={navigate}
        onSearch={handleSearch}
      />

      <div className="pt-28 px-6 md:px-12 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          {query ? (
            <>
              Search results for <span className="text-red-500">"{query}"</span>
            </>
          ) : (
            "Search Movies"
          )}
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="flex justify-center">
                <MoviePreviewCard
                  movie={movie}
                  onPlay={handleSelectMovie}
                  onMoreInfo={handleSelectMovie}
                />
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg">No movies found matching your search.</p>
            <p className="text-sm mt-1 text-zinc-500">Try checking for typos or searching another title.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
            <p className="text-lg">Type in the search bar above to look for movies.</p>
          </div>
        )}
      </div>
    </div>
  );
}