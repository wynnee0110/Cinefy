const { getOrSetCache } = require("../../utils/cache");

const BASE_URL = "https://api.themoviedb.org/3";

const headers = {
  Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
  accept: "application/json",
};

const TTL = {
  POPULAR:  60 * 10,      // 10 minutes
  DETAIL:   60 * 60 * 6,  // 6 hours
  SEARCH:   60 * 5,       // 5 minutes
  TRENDING: 60 * 15,      // 15 minutes
  GENRES:   60 * 60 * 24, // 24 hours
};

exports.getPopular = async () => {
  return getOrSetCache("tv:popular", TTL.POPULAR, async () => {
    const response = await fetch(`${BASE_URL}/tv/popular`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return response.json();
  });
};

exports.getTrending = async (timeWindow = "week") => {
  return getOrSetCache(`tv:trending:${timeWindow}`, TTL.TRENDING, async () => {
    const response = await fetch(
      `${BASE_URL}/trending/tv/${timeWindow}`,
      { headers }
    );
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return response.json();
  });
};

exports.getTopRated = async () => {
  return getOrSetCache("tv:top_rated", TTL.POPULAR, async () => {
    const response = await fetch(`${BASE_URL}/tv/top_rated`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return response.json();
  });
};

exports.getAiringToday = async () => {
  return getOrSetCache("tv:airing_today", TTL.POPULAR, async () => {
    const response = await fetch(`${BASE_URL}/tv/airing_today`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return response.json();
  });
};

exports.getOnTheAir = async () => {
  return getOrSetCache("tv:on_the_air", TTL.POPULAR, async () => {
    const response = await fetch(`${BASE_URL}/tv/on_the_air`, { headers });
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return response.json();
  });
};

exports.getShow = async (id) => {
  return getOrSetCache(`tv:detail:${id}`, TTL.DETAIL, async () => {
    const response = await fetch(
      `${BASE_URL}/tv/${id}?append_to_response=videos,credits,similar,recommendations`,
      { headers }
    );
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return response.json();
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
  return getOrSetCache(`tv:genre:${genreId}:page:${page}`, TTL.POPULAR, async () => {
    const response = await fetch(
      `${BASE_URL}/discover/tv?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`,
      { headers }
    );
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return response.json();
  });
};

exports.search = async (query, page = 1) => {
  if (!query || !query.trim()) {
    return { page: 1, results: [], total_pages: 1, total_results: 0 };
  }

  const cacheKey = `tv:search:${encodeURIComponent(query.trim())}:page:${page}`;
  return getOrSetCache(cacheKey, TTL.SEARCH, async () => {
    const response = await fetch(
      `${BASE_URL}/search/tv?query=${encodeURIComponent(query)}&page=${page}`,
      { headers }
    );
    if (!response.ok) throw new Error(`TMDB error: ${response.status}`);
    return response.json();
  });
};
