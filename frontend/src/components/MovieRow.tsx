import { useRef, useState, useEffect } from "react";
import MoviePreviewCard from "./MoviePreviewCard";
import type { Movie } from "../types/movie";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onPlay: (id: number, mediaType: "movie" | "tv") => void;
  onMoreInfo: (id: number, mediaType: "movie" | "tv") => void;
}

export default function MovieRow({ title, movies, onPlay, onMoreInfo }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const isTrending =
  title.toLowerCase().includes("trending");

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 20);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [movies]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="px-6 md:px-12">
      <h2 className="text-xl md:text-2xl font-bold mb-4 tracking-wide">
        {title}
      </h2>

      <div className="group/row relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-30 w-12 bg-gradient-to-r from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-30 w-12 bg-gradient-to-l from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto overflow-y-visible scroll-smooth scrollbar-hide py-2 pb-4"
        >
          {movies.map((movie, index) => (

<div
  key={`${title}-${movie.id}-${index}`}
  className="relative shrink-0"
>
  {isTrending && index < 10 && (
    <div className="absolute top-2 left-2 z-20">
      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
        TOP #{index + 1}
      </span>
    </div>
  )}

  <MoviePreviewCard
    movie={movie}
    onPlay={onPlay}
    onMoreInfo={onMoreInfo}
  />
</div>
          ))}
        </div>
      </div>
    </section>
  );
}
