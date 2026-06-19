const express = require("express");

const cors = require("cors");
const {
  default: arcjet,
  shield,
  detectBot,
  tokenBucket,
} = require("@arcjet/node");

const errorHandler = require("./middleware/errorHandler");
const movieRoutes = require("./modules/movies/movie.routes");
const tvRoutes = require("./modules/tv/tv.routes");

const app = express();

app.set("trust proxy", true);
// Arcjet configuration
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 60,
      capacity: 20,
    }),
  ],
});
// Arcjet middleware
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1,
    });

    if (decision.isDenied()) {
      return res.status(429).json({
        error: "Too many requests, please try again later",
      });
    }

    next();
  } catch (err) {
    console.error("Arcjet error:", err);
    next();
  }
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