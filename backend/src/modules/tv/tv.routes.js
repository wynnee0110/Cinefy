const express = require("express");
const router = express.Router();

const tvController = require("./tv.controller");

// Collection routes
router.get("/popular",             tvController.getPopular);
router.get("/trending/:timeWindow", tvController.getTrending);
router.get("/trending",            tvController.getTrending);    // default "week"
router.get("/top-rated",           tvController.getTopRated);
router.get("/airing-today",        tvController.getAiringToday);
router.get("/on-the-air",          tvController.getOnTheAir);
router.get("/genres",              tvController.getGenres);
router.get("/search",              tvController.search);

// Genre-based discovery
router.get("/genre/:genreId",      tvController.getByGenre);

// Single show
router.get("/:id",                 tvController.getShow);

// Season detail
router.get("/:id/season/:seasonNumber", tvController.getSeason);

module.exports = router;
