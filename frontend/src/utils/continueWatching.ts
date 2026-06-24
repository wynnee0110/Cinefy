import type { Movie } from "../types/movie";

const STORAGE_KEY = "cinefy_continue_watching";
const MAX_ITEMS = 20;

/**
 * Add a movie or TV show to the "Continue Watching" list.
 * - Moves it to the front if it already exists (most recently watched first).
 * - Caps the list at MAX_ITEMS.
 */
export function addToContinueWatching(item: {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type: "movie" | "tv";
}): void {
  const existing = getContinueWatching();

  // Remove if already in list (we'll re-add at the front)
  const filtered = existing.filter((m) => !(m.id === item.id && m.media_type === item.media_type));

  const entry: Movie = {
    id: item.id,
    title: item.title,
    name: item.name,
    poster_path: item.poster_path,
    backdrop_path: item.backdrop_path,
    overview: item.overview || "",
    vote_average: item.vote_average || 0,
    release_date: item.release_date,
    first_air_date: item.first_air_date,
    media_type: item.media_type,
  };

  // Add to front, cap at MAX_ITEMS
  const updated = [entry, ...filtered].slice(0, MAX_ITEMS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save continue watching:", err);
  }
}

/**
 * Get the "Continue Watching" list from localStorage.
 */
export function getContinueWatching(): Movie[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    return JSON.parse(saved) as Movie[];
  } catch {
    console.error("Failed to load continue watching list");
    return [];
  }
}
