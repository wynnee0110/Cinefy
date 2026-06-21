const { getOrSetCache } = require("../../utils/cache");

const BASE_URL = "https://api.themoviedb.org/3";

const headers = {
  Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
  accept: "application/json",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

// TTL constants (in seconds)
const TTL = {
  POPULAR: 60 * 10,       // 10 minutes — changes often
  MOVIE:   60 * 60 * 6,   // 6 hours   — movie details rarely change
  SEARCH:  60 * 5,        // 5 minutes
  TRENDING: 60 * 15,      // 15 minutes
  GENRES:  60 * 60 * 24,  // 24 hours  — genres are static
};

async function getFallbackOverview(id) {
  const response = await fetch(`${BASE_URL}/movie/${id}/translations`, { headers });
  if (!response.ok) return "";

  const data = await response.json();
  const translations = data.translations || [];
  const preferred =
    translations.find((item) => item.iso_639_1 === "en" && item.iso_3166_1 === "US") ||
    translations.find((item) => item.iso_639_1 === "en") ||
    translations.find((item) => item.data?.overview?.trim());

  return preferred?.data?.overview?.trim() || "";
}

async function withOverviewFallback(id, data) {
  if (data.overview?.trim()) return data;

  try {
    const overview = await getFallbackOverview(id);
    return overview ? { ...data, overview } : data;
  } catch (err) {
    console.warn(`TMDB movie translations error: ${err.message}`);
    return data;
  }
}

async function withResultsOverviewFallback(data) {
  if (!Array.isArray(data.results)) return data;

  const results = await Promise.all(
    data.results.map((item) => withOverviewFallback(item.id, item))
  );

  return { ...data, results };
}

exports.getPopular = async () => {
  return getOrSetCache("movies:popular:v2", TTL.POPULAR, async () => {
    const response = await fetch(`${BASE_URL}/movie/popular`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return withResultsOverviewFallback(await response.json());
  });
};

exports.getTrending = async (timeWindow = "week") => {
  return getOrSetCache(`movies:trending:v2:${timeWindow}`, TTL.TRENDING, async () => {
    const response = await fetch(
      `${BASE_URL}/trending/movie/${timeWindow}`,
      { headers }
    );
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return withResultsOverviewFallback(await response.json());
  });
};

exports.getTopRated = async () => {
  return getOrSetCache("movies:top_rated:v2", TTL.POPULAR, async () => {
    const response = await fetch(`${BASE_URL}/movie/top_rated`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return withResultsOverviewFallback(await response.json());
  });
};

exports.getUpcoming = async () => {
  return getOrSetCache("movies:upcoming:v2", TTL.POPULAR, async () => {
    const response = await fetch(`${BASE_URL}/movie/upcoming`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return withResultsOverviewFallback(await response.json());
  });
};

exports.getNowPlaying = async () => {
  return getOrSetCache("movies:now_playing:v2", TTL.POPULAR, async () => {
    const response = await fetch(`${BASE_URL}/movie/now_playing`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return withResultsOverviewFallback(await response.json());
  });
};

exports.getMovie = async (id) => {
  return getOrSetCache(`movies:detail:v2:${id}`, TTL.MOVIE, async () => {
    // Try with videos append first (used for trailer preview)
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${id}?append_to_response=videos`,
        { headers }
      );
      if (response.ok) return withOverviewFallback(id, await response.json());
      console.warn(`TMDB movie+videos failed (${response.status}), falling back to basic details`);
    } catch (err) {
      console.warn(`TMDB movie+videos error: ${err.message}, falling back`);
    }

    // Fallback: fetch without append_to_response
    const fallback = await fetch(`${BASE_URL}/movie/${id}`, { headers });
    if (!fallback.ok) throw new Error(`TMDB error: ${fallback.status}`);
    const data = await fallback.json();
    data.videos = { results: [] }; // empty so frontend doesn't crash
    return withOverviewFallback(id, data);
  });
};

exports.getGenres = async () => {
  return getOrSetCache("movies:genres", TTL.GENRES, async () => {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list`,
      { headers }
    );
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return response.json();
  });
};

exports.getByGenre = async (genreId, page = 1) => {
  return getOrSetCache(`movies:genre:v2:${genreId}:page:${page}`, TTL.POPULAR, async () => {
    const response = await fetch(
      `${BASE_URL}/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,
      { headers }
    );
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return withResultsOverviewFallback(await response.json());
  });
};

exports.search = async (query, page = 1) => {
  if (!query || !query.trim()) {
    return { page: 1, results: [], total_pages: 1, total_results: 0 };
  }

  const cacheKey = `movies:search:v2:${encodeURIComponent(query.trim())}:page:${page}`;
  return getOrSetCache(cacheKey, TTL.SEARCH, async () => {
    const response = await fetch(
      `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
      { headers }
    );
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return withResultsOverviewFallback(await response.json());
  });
};


exports.getImages = async (id) => {
  return getOrSetCache(`movies:images:v2:${id}`, TTL.MOVIE, async () => {
    const response = await fetch(`${BASE_URL}/movie/${id}/images`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return response.json();
  });
};

exports.getSimilar = async (id) => {
  return getOrSetCache(`movies:similar:v2:${id}`, TTL.POPULAR, async () => {
    const response = await fetch(`${BASE_URL}/movie/${id}/similar`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return withResultsOverviewFallback(await response.json());
  });
}