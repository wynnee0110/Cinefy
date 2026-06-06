import { useState } from "react";
import type { NavigateFunction } from "react-router-dom";

interface HeaderProps {
  isScrolled: boolean;
  navigate: NavigateFunction;
  onSearch: (query: string) => void;
}

export default function Header({
  isScrolled,
  navigate,
  onSearch,
}: HeaderProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    onSearch(query);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 transition-colors duration-500 ${
        isScrolled
          ? "bg-black shadow-lg"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <h1
          className="text-red-600 text-3xl md:text-4xl font-black tracking-tighter cursor-pointer hover:text-red-500 transition"
          onClick={() => navigate("/")}
        >
          CINEFY
        </h1>

        {/* Search */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              w-64
              bg-black/70
              border
              border-zinc-700
              rounded-md
              px-4
              py-2
              text-white
              outline-none
              focus:border-red-600
              transition
            "
          />
        </form>
      </div>
    </nav>
  );
}