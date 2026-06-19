const express = require("express");
const cors = require("cors");
const arcjet = require("@arcjet/node");

const errorHandler = require("./middleware/errorHandler");
const movieRoutes = require("./modules/movies/movie.routes");
const tvRoutes = require("./modules/tv/tv.routes");

const app = express();
console.log(arcjet);

// Arcjet configuration
const aj = arcjet({
  key: process.env.ARCJET_KEY,
rules: [
  arcjet.shield({
    mode: "LIVE",
  }),
  arcjet.detectBot({
    mode: "LIVE",
    allow: ["CATEGORY:SEARCH_ENGINE"],
  }),
  arcjet.tokenBucket({
    mode: "LIVE",
    refillRate: 10,
    interval: 60,
    capacity: 20,
  }),
],
});

// Arcjet middleware
app.use(async (req, res, next) => {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    return res.status(429).json({
      error: "Request blocked",
    });
  }

  next();
});

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/movies", movieRoutes);
app.use("/tv", tvRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.path}`,
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;