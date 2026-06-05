const express = require("express");
const router = express.Router();

const movieController = require("./movie.controller");

router.get("/popular", movieController.getPopular);

router.get("/search", movieController.search);

router.get("/:id", movieController.getMovie);

module.exports = router;