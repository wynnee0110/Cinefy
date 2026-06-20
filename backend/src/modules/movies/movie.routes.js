const express = require("express");
const router = express.Router();

const movieController = require("./movie.controller");

// List / collection routes
router.get("/popular",            movieController.getPopular);
router.get("/trending/:timeWindow", movieController.getTrending);
router.get("/trending",            movieController.getTrending);    // default "week"
router.get("/top-rated",          movieController.getTopRated);
router.get("/upcoming",           movieController.getUpcoming);
router.get("/now-playing",        movieController.getNowPlaying);
router.get("/genres",             movieController.getGenres);
router.get("/search",             movieController.search);

// Genre-based discovery
router.get("/genre/:genreId",     movieController.getByGenre);

router.get("/:id/images",         movieController.getImages);

// Single movie (must be last to avoid conflicts with named routes)
router.get("/:id",                movieController.getMovie);


module.exports = router;