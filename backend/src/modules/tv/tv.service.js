const { getOrSetCache } = require("../../utils/cache");

const BASE_URL = "https://api.themoviedb.org/3";

const headers = {
  Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
  accept: "application/json",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

const TTL = {
  POPULAR:  60 * 10,      // 10 minutes
  DETAIL:   60 * 60 * 6,  // 6 hours
  SEARCH:   60 * 5,       // 5 minutes
  TRENDING: 60 * 15,      // 15 minutes
  GENRES:   60 * 60 * 24, // 24 hours
};

async function getFallbackOverview(id) {
  const response = await fetch(`${BASE_URL}/tv/${id}/translations`, { headers });
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
    console.warn(`TMDB TV translations error: ${err.message}`);
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
  return getOrSetCache("tv:popular:v2", TTL.POPULAR, async () => {
    const response = await fetch(`${BASE_URL}/tv/popular`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return withResultsOverviewFallback(await response.json());
  });
};

exports.getTrending = async (timeWindow = "week") => {
  return getOrSetCache(`tv:trending:v2:${timeWindow}`, TTL.TRENDING, async () => {
    const response = await fetch(
      `${BASE_URL}/trending/tv/${timeWindow}`,
      { headers }
    );
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return withResultsOverviewFallback(await response.json());
  });
};

exports.getTopRated = async () => {
  return getOrSetCache("tv:top_rated:v2", TTL.POPULAR, async () => {
    const response = await fetch(`${BASE_URL}/tv/top_rated`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return withResultsOverviewFallback(await response.json());
  });
};

exports.getAiringToday = async () => {
  return getOrSetCache("tv:airing_today:v2", TTL.POPULAR, async () => {
    const response = await fetch(`${BASE_URL}/tv/airing_today`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return withResultsOverviewFallback(await response.json());
  });
};

exports.getOnTheAir = async () => {
  return getOrSetCache("tv:on_the_air:v2", TTL.POPULAR, async () => {
    const response = await fetch(`${BASE_URL}/tv/on_the_air`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return withResultsOverviewFallback(await response.json());
  });
};

exports.getShow = async (id) => {
  return getOrSetCache(`tv:detail:v2:${id}`, TTL.DETAIL, async () => {
    const response = await fetch(`${BASE_URL}/tv/${id}`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return withOverviewFallback(id, await response.json());
  });
};

exports.getSeason = async (id, seasonNumber) => {
  return getOrSetCache(`tv:season:${id}:${seasonNumber}`, TTL.DETAIL, async () => {
    const response = await fetch(
      `${BASE_URL}/tv/${id}/season/${seasonNumber}`,
      { headers }
    );
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return response.json();
  });
};

exports.getGenres = async () => {
  return getOrSetCache("tv:genres", TTL.GENRES, async () => {
    const response = await fetch(`${BASE_URL}/genre/tv/list`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return response.json();
  });
};

exports.getByGenre = async (genreId, page = 1) => {
  return getOrSetCache(`tv:genre:v2:${genreId}:page:${page}`, TTL.POPULAR, async () => {
    const response = await fetch(
      `${BASE_URL}/discover/tv?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,
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

  const cacheKey = `tv:search:v2:${encodeURIComponent(query.trim())}:page:${page}`;
  return getOrSetCache(cacheKey, TTL.SEARCH, async () => {
    const response = await fetch(
      `${BASE_URL}/search/tv?query=${encodeURIComponent(query)}&page=${page}`,
      { headers }
    );
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return withResultsOverviewFallback(await response.json());
  });
};

exports.getImages = async (id) => {
  return getOrSetCache(`tv:images:${id}`, TTL.DETAIL, async () => {
    const response = await fetch(`${BASE_URL}/tv/${id}/images`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return response.json();
  });
};