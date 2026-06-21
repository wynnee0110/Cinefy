import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSimilarTv, getTvImages, getTvSeason, getTvShow } from "../services/movie.service";
import type { Genre, ProductionCompany, ProductionCountry, SimilarTvShow, SpokenLanguage, TmdbImages, TmdbLogo } from "../types/movie";
import { useRef } from "react";

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
  const [error, setError] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [similarShows, setSimilarShows] = useState<SimilarTvShow[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

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

  useEffect(() => {
    async function loadLogo() {
      if (!id) return;
      setLogoUrl(null);

      try {
        const images: TmdbImages = await getTvImages(Number(id));

        const logo =
          images.logos?.find((l: TmdbLogo) => l.iso_639_1 === "en") ||
          images.logos?.find((l: TmdbLogo) => l.iso_639_1 === null) ||
          images.logos?.[0];

        if (logo?.file_path) {
          setLogoUrl(`https://image.tmdb.org/t/p/w500${logo.file_path}`);
        }
      } catch (err) {
        console.error("Failed to load TV logo:", err);
      }
    }

    loadLogo();
  }, [id]);

  // Load main TV show details
  useEffect(() => {
    async function loadShow() {
      setIsLoading(true);
      setError("");
      setSimilarShows([]);
      try {
        const data = await getTvShow(Number(id));
        setShow(data);
        if (data.seasons && data.seasons.length > 0) {
          // Find the first valid season (usually 1, ignore season 0 specials for default)
          const firstSeason = data.seasons.find((s: Season) => s.season_number > 0) || data.seasons[0];
          setSelectedSeasonNum(firstSeason.season_number);
        }
        try {
          const similar = await getSimilarTv(Number(id));
          setSimilarShows(similar.results || []);
        } catch (error) {
          console.error("Failed to load similar TV shows:", error);
        }
      } catch (error) {
        console.error("Failed to load TV show:", error);
        setShow(null);
        setError(error instanceof Error ? error.message : "Failed to load TV show.");
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
    if (error) {
      return (
        <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white px-6 text-center">
          <h1 className="text-3xl font-bold mb-3">TV show unavailable</h1>
          <p className="text-zinc-400 max-w-md">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-zinc-200 transition"
          >
            Go Back
          </button>
        </div>
      );
    }

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </nav>

      {/* Full-Screen Hero */}
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/w1280${show.backdrop_path || show.poster_path}`}
          alt={show.name}
                    className="
  absolute inset-0
  w-full h-full
  object-cover
  object-[60%_center]
"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

        {/* Hero Content */}
        <div className="absolute bottom-12 left-12 right-12 md:left-16 md:right-auto max-w-2xl z-10">
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

          <div className="mb-4">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={show.name}
                className="
  w-auto
  max-w-[220px]
  sm:max-w-[320px]
  md:max-w-[450px]
  lg:max-w-[600px]
  max-h-[100px]
  sm:max-h-[140px]
  md:max-h-[180px]
  lg:max-h-[220px]
  object-contain
  mb-5
"
              />
            ) : (
              <h1 className="text-6xl md:text-7xl font-black leading-none">
                {show.name}
              </h1>
            )}
          </div>

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
              className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transition flex items-center gap-2 text-lg shadow-lg"
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
              className="bg-zinc-700/80 backdrop-blur-sm px-8 py-3 rounded-md font-bold hover:bg-zinc-600 transition text-lg"
            >
              Episodes
            </button>
          </div>
        </div>
      </section>

      {/* Episodes Picker Section */}
      <section id="episodes-section" className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20 border-t border-zinc-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h2 className="text-3xl md:text-4xl font-black">Episodes</h2>

          {/* Season Selector */}
{/* Custom Season Dropdown */}
          <div className="relative w-full md:w-auto md:min-w-[280px]">
            {/* The Box You Click */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between bg-zinc-800/80 backdrop-blur-md border-2 border-zinc-700 hover:border-red-500 text-white rounded-2xl px-5 py-3.5 outline-none text-lg font-bold tracking-wide transition-all duration-300 shadow-lg"
            >
              <span>
                {show.seasons.find(s => s.season_number === selectedSeasonNum)?.name || "Select Season"}
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-red-500" : "text-zinc-400"}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* The Dropdown Menu List */}
            {isDropdownOpen && (
              <div className="absolute z-50 top-full left-0 right-0 mt-3 bg-zinc-900 border-2 border-zinc-800 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 max-h-80 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {show.seasons
                  .filter((s) => s.season_number > 0)
                  .map((season) => {
                    const isSelected = selectedSeasonNum === season.season_number;
                    return (
                      <button
                        key={season.id}
                        onClick={() => {
                          setSelectedSeasonNum(season.season_number);
                          setIsDropdownOpen(false); // Close menu on click
                        }}
                        className={`text-left w-full px-4 py-3 rounded-xl font-bold transition-all duration-200 flex justify-between items-center ${
                          isSelected
                            ? "bg-red-600 text-white"
                            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        }`}
                      >
                        <span>{season.name}</span>
                        <span className={`text-xs font-medium ${isSelected ? "text-red-200" : "text-zinc-600"}`}>
                          {season.episode_count} Episodes
                        </span>
                      </button>
                    );
                  })}
              </div>
            )}
            
            {/* Invisible background overlay to close dropdown when clicking outside */}
            {isDropdownOpen && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDropdownOpen(false)}
              />
            )}
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
                      loading="lazy"
                      decoding="async"
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
                      {episode.air_date
                        ? new Date(episode.air_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
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
      <section className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-12 border-t border-zinc-900">
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

      {/* Similar Shows Section */}
      {similarShows.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pb-0">
          <h2 className="text-3xl md:text-4xl font-black mb-8 text-white tracking-tight">
            Similar Shows
          </h2>

          <div className="relative group">
            {/* LEFT ARROW */}
            <button
              onClick={() => scroll("left")}
              className="absolute -left-6 md:left-0 top-1/2 -translate-y-1/2 z-20
                       opacity-0 group-hover:opacity-100 transition-opacity
                       bg-black/70 hover:bg-red-600 text-white
                       w-12 h-12 rounded-full flex items-center justify-center
                       backdrop-blur-md transition-colors"
              aria-label="Scroll left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* RIGHT ARROW */}
            <button
              onClick={() => scroll("right")}
              className="absolute -right-6 md:right-0 top-1/2 -translate-y-1/2 z-20
                       opacity-0 group-hover:opacity-100 transition-opacity
                       bg-black/70 hover:bg-red-600 text-white
                       w-12 h-12 rounded-full flex items-center justify-center
                       backdrop-blur-md transition-colors"
              aria-label="Scroll right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Scroll Container - NO SCROLLBAR */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory
                       [&::-webkit-scrollbar]:hidden
                       [-ms-overflow-style:none]
                       [scrollbar-width:none]"
            >
              {similarShows.map((similarShow) => (
                <div
                  key={similarShow.id}
                  onClick={() => navigate(`/tv/${similarShow.id}`)}
                  className="flex-shrink-0 snap-start cursor-pointer group/card"
                  style={{ minWidth: "200px" }}
                >
                  {/* Poster Card */}
                  <div className="aspect-[2/3] w-[200px] rounded-lg overflow-hidden bg-zinc-900 shadow-lg transition-transform duration-300 group-hover/card:scale-105">
                    {similarShow.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w342${similarShow.poster_path}`}
                        alt={similarShow.name}
                        className="w-full h-full object-cover transition-brightness duration-300 group-hover/card:brightness-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs text-center p-2 bg-zinc-800">
                        No Poster Available
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <p className="mt-3 text-sm text-zinc-300 line-clamp-2 group-hover/card:text-white transition w-[200px]">
                    {similarShow.name}
                  </p>

                  {/* First Air Year */}
                  {similarShow.first_air_date && (
                    <p className="text-xs text-zinc-500 mt-1">
                      {new Date(similarShow.first_air_date).getFullYear()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Player Modal */}
      {activeEpisode && (
        <div className="fixed inset-0 z-50 bg-black/95">
          {/* Close button */}
          <button
            onClick={() => setActiveEpisode(null)}
            className="absolute top-6 right-6 text-white text-4xl z-50 hover:text-red-600 transition"
            aria-label="Close player"
          >
            ✕
          </button>

          {/* TV Show Embed */}
          <iframe
            src={`https://www.vidking.net/embed/tv/${show.id}/${activeEpisode.season}/${activeEpisode.episode}`}
            className="w-full h-full"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}