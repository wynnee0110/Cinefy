const express = require("express");
const cors = require("cors");

const movieRoutes = require("./modules/movies/movie.routes");

const app = express();

app.use(
  cors({
    origin: [
      "https://cinefy-pi.vercel.app/",
    ],
  })
);
app.use(express.json());

app.use("/movies", movieRoutes);

module.exports = app;