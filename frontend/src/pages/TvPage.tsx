import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTvShow, getTvSeason } from "../services/movie.service";
import type { Genre, ProductionCompany, ProductionCountry, SpokenLanguage } from "../types/movie";

interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date: string;
}

interface Season {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string;
}

interface TvDetail {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path?: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  tagline?: string;
  genres?: Genre[];
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
  seasons: Season[];
  number_of_seasons: number;
  number_of_episodes: number;
}

export default function TvPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState<TvDetail | null>(null);
  const [selectedSeasonNum, setSelectedSeasonNum] = useState<number>(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  const [activeEpisode, setActiveEpisode] = useState<{ season: number; episode: number } | null>(null);

  useEffect(() => {
    if (activeEpisode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeEpisode]);

  // Load main TV show details
  useEffect(() => {
    async function loadShow() {
      setIsLoading(true);
      try {
        const data = await getTvShow(Number(id));
        setShow(data);
        if (data.seasons && data.seasons.length > 0) {
          // Find the first valid season (usually 1, ignore season 0 specials for default)
          const firstSeason = data.seasons.find((s: Season) => s.season_number > 0) || data.seasons[0];
          setSelectedSeasonNum(firstSeason.season_number);
        }
      } catch (error) {
        console.error("Failed to load TV show:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) loadShow();
  }, [id]);

  // Load episodes when selected season changes
  useEffect(() => {
    async function loadSeasonEpisodes() {
      if (!id || !selectedSeasonNum) return;
      setIsLoadingEpisodes(true);
      try {
        const data = await getTvSeason(Number(id), selectedSeasonNum);
        setEpisodes(data.episodes || []);
      } catch (error) {
        console.error("Failed to load season episodes:", error);
      } finally {
        setIsLoadingEpisodes(false);
      }
    }

    loadSeasonEpisodes();
  }, [id, selectedSeasonNum]);

  if (isLoading || !show) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/90 via-black/60 to-transparent px-10 py-5">
        <div className="flex items-center gap-8">
          <h1
            className="text-red-600 text-4xl font-black tracking-tight cursor-pointer"
            onClick={() => navigate("/")}
          >
            CINEFY
          </h1>

          <button
            onClick={() => navigate(-1)}
            className="text-zinc-400 hover:text-white transition text-sm flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </nav>

      {/* Full-Screen Hero */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${show.backdrop_path || show.poster_path}`}
          alt={show.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

        {/* Hero Content */}
        <div className="absolute bottom-20 left-12 right-12 md:left-16 md:right-auto max-w-2xl z-10">
          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold mb-4">
            {show.vote_average > 0 && (
              <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md">
                {(show.vote_average * 10).toFixed(0)}% Match
              </span>
            )}
            <span className="text-zinc-300">
              {show.first_air_date ? show.first_air_date.split("-")[0] : "N/A"}
            </span>
            <span className="text-zinc-300">
              {show.number_of_seasons} {show.number_of_seasons === 1 ? "Season" : "Seasons"}
            </span>
            <span className="text-zinc-400 border border-zinc-600 px-2 py-0.5 text-xs rounded font-bold">
              HD
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-5 drop-shadow-xl leading-none">
            {show.name}
          </h1>

          {show.tagline && (
            <p className="italic text-zinc-400 text-base mb-5 border-l-3 border-red-600 pl-4">
              "{show.tagline}"
            </p>
          )}

          <p className="text-zinc-300 text-lg mb-8 leading-relaxed line-clamp-3 max-w-xl">
            {show.overview || "No overview available."}
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => {
                // Play first episode of first season
                setActiveEpisode({ season: selectedSeasonNum, episode: 1 });
              }}
              className="bg-white text-black px-8 py-3.5 rounded-full font-bold hover:bg-zinc-200 transition flex items-center gap-2 text-lg shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play S1:E1
            </button>

            <button
              onClick={() => {
                document.getElementById("episodes-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-zinc-700/80 backdrop-blur-sm px-8 py-3.5 rounded-md font-bold hover:bg-zinc-600 transition text-lg"
            >
              Episodes
            </button>
          </div>
        </div>
      </section>

      {/* Episodes Picker Section */}
      <section id="episodes-section" className="max-w-7xl mx-auto px-10 md:px-16 py-12 border-t border-zinc-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h2 className="text-3xl font-bold">Episodes</h2>

          {/* Season Selector */}
          <div className="relative">
            <select
              value={selectedSeasonNum}
              onChange={(e) => setSelectedSeasonNum(Number(e.target.value))}
              className="bg-zinc-900 border border-zinc-800 text-white rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-red-600 cursor-pointer appearance-none text-lg font-semibold"
            >
              {show.seasons
                .filter((s) => s.season_number > 0)
                .map((season) => (
                  <option key={season.id} value={season.season_number}>
                    {season.name} ({season.episode_count} Episodes)
                  </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              ▼
            </div>
          </div>
        </div>

        {/* Episode Grid */}
        {isLoadingEpisodes ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {episodes.map((episode) => (
              <div
                key={episode.id}
                onClick={() => setActiveEpisode({ season: episode.season_number, episode: episode.episode_number })}
                className="group flex gap-4 bg-zinc-900/40 hover:bg-zinc-900/90 border border-zinc-900 hover:border-zinc-800 rounded-xl p-4 cursor-pointer transition duration-300"
              >
                <div className="relative w-40 h-24 shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                  {episode.still_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                      alt={episode.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold">
                      No Image
                    </div>
                  )}
                  {/* Overlay play button on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <div className="flex flex-col justify-between overflow-hidden">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-red-500 transition truncate">
                      {episode.episode_number}. {episode.name}
                    </h3>
                    <p className="text-zinc-400 text-xs mt-1">
                      {episode.air_date ? new Date(episode.air_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : ""}
                    </p>
                    <p className="text-zinc-400 text-sm mt-2 line-clamp-2 leading-snug">
                      {episode.overview || "No description available for this episode."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Show Details Section */}
      <section className="max-w-7xl mx-auto px-10 md:px-16 py-12 border-t border-zinc-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">About {show.name}</h2>
              <p className="text-zinc-300 text-lg leading-relaxed">
                {show.overview || "No overview available."}
              </p>
            </div>

            {/* Genres */}
            {show.genres && show.genres.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {show.genres.map((g) => (
                    <span
                      key={g.id}
                      className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-1.5 rounded-full text-sm"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">Rating</h3>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-white">
                  {show.vote_average?.toFixed(1)}
                </span>
                <div className="text-zinc-400 text-sm">
                  <div>out of 10</div>
                  <div>{show.vote_count?.toLocaleString()} votes</div>
                </div>
              </div>
            </div>

            {show.production_countries && show.production_countries.length > 0 && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-2">Country</h3>
                <span className="text-white">
                  {show.production_countries.map((c) => c.name).join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Player Modal */}
      {activeEpisode && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Close button */}
          <button
            onClick={() => setActiveEpisode(null)}
            className="absolute top-5 right-5 text-white text-3xl z-50 bg-black/60 w-12 h-12 rounded-full hover:bg-black transition flex items-center justify-center"
          >
            ✕
          </button>

          {/* TV Show Embed */}
          <iframe
            src={`https://vidking.net/embed/tv/${show.id}/${activeEpisode.season}/${activeEpisode.episode}`}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
