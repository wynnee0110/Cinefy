import { useState } from "react";
import type { NavigateFunction } from "react-router-dom";

interface HeaderProps {
  isScrolled: boolean;
  navigate: NavigateFunction;
  onSearch: (query: string) => void;
  onMovieClick?: () => void;
  onTvClick?: () => void;
  onGenreSelect?: (genreId: number) => void;
  selectedGenreId?: number;
  
}

export default function Header({
  isScrolled,
  navigate,
  onSearch,
  onMovieClick,
  onTvClick,
  onGenreSelect,
  selectedGenreId, // 👈 ADD THIS
}: HeaderProps) {
  const [query, setQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGenreOpen, setIsGenreOpen] = useState(false);

  const genres = [
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-12 py-4 transition-all duration-500 ${
        isScrolled
          ? "bg-black shadow-lg"
          : "bg-gradient-to-b from-black/90 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between relative">
        {/* Left Side: Logo & Desktop Navigation */}
        <div className="flex-1 md:flex-none flex items-center justify-start">
<div onClick={() => navigate("/")} className="cursor-pointer">
  <img
    src="/logo.png"
    alt="Cinefy Logo"
    className="h-12 w-auto"
  />
</div>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 ml-8">
            <button
              onClick={onMovieClick || (() => navigate("/?type=movies"))}
              className="text-white hover:text-red-500 transition"
            >
              Movies
            </button>

            <button
              onClick={onTvClick || (() => navigate("/?type=tv"))}
              className="text-white hover:text-red-500 transition"
            >
              TV Shows
            </button>

        <div className="relative">
<button
  onClick={() => setIsGenreOpen(!isGenreOpen)}
  className="flex items-center gap-2 text-white hover:text-red-500 transition"
>
  {selectedGenreId
    ? genres.find((g) => g.id === selectedGenreId)?.name
    : "Genres"}

  <span
    className={`inline-block transition-transform duration-300 ${
      isGenreOpen ? "rotate-180" : "rotate-0"
    }`}
  >
<svg
  className="w-4 h-4"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M18 15L12 9L6 15"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
  </span>
  
</button>

  {isGenreOpen && (
    <div
      className="
        absolute
        top-full
        left-0
        mt-3
        bg-zinc-900
        rounded-lg
        shadow-2xl
        w-[500px]
        border
        border-zinc-800
        p-4
        z-50
      "
    >
      <div className="grid grid-cols-3 gap-2">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => {
              if (onGenreSelect) {
                onGenreSelect(genre.id);
              } else {
                navigate(`/?genre=${genre.id}`);
              }

              setIsGenreOpen(false);
            }}
            className={`
              text-left
              px-3
              py-2
              rounded-md
              transition
              ${
                selectedGenreId === genre.id
                  ? "bg-red-600 text-white"
                  : "text-white hover:bg-red-600"
              }
            `}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  )}
</div>

            
          </div>
        </div>

        {/* Center: Mobile hamburger menu (3 horizontal lines) */}
        <div className="md:hidden flex-1 flex justify-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white hover:text-red-500 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between items-center relative">
              <span
                className={`w-6 h-0.5 bg-current transition-all duration-300 origin-left ${
                  isMobileMenuOpen ? "rotate-45 translate-x-1 -translate-y-0.5" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-6 h-0.5 bg-current transition-all duration-300 origin-left ${
                  isMobileMenuOpen ? "-rotate-45 translate-x-1 translate-y-0.5" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Right: Search */}
        <div className="flex-1 md:flex-none flex justify-end">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="
                w-28
                xs:w-36
                sm:w-48
                md:w-64
                bg-black/70
                border
                border-zinc-700
                rounded-md
                px-3
                py-1.5
                md:px-4
                md:py-2
                text-sm
                md:text-base
                text-white
                outline-none
                focus:border-red-600
                focus:ring-1
                focus:ring-red-600
                transition
              "
            />
          </form>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-zinc-800 backdrop-blur-xl animate-in slide-in-from-top duration-300">
          <div className="px-6 py-6 space-y-6">
            <button
              onClick={() => {
                if (onMovieClick) onMovieClick();
                else navigate("/?type=movies");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-lg font-semibold text-white hover:text-red-500 transition"
            >
              Movies
            </button>

            <button
              onClick={() => {
                if (onTvClick) onTvClick();
                else navigate("/?type=tv");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-lg font-semibold text-white hover:text-red-500 transition"
            >
              TV Shows
            </button>

            {/* Mobile Genres Accordion */}
            <div className="space-y-3">
              <div className="text-lg font-semibold text-zinc-400 border-b border-zinc-800 pb-2">
                Genres
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-y-auto pr-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => {
                      if (onGenreSelect) onGenreSelect(genre.id);
                      else navigate(`/?genre=${genre.id}`);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left py-1 text-sm text-zinc-300 hover:text-red-500 transition"
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}