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

// Health check — placed before Arcjet so Render's internal
// health-check requests (from localhost / ::1) are never rate-limited.
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Arcjet middleware
app.use(async (req, res, next) => {
  try {
    // Provide a fallback IP when req.ip is empty or a loopback address
    // (e.g. Render's internal health-check probes).
    const ip = req.ip && !["::1", "127.0.0.1"].includes(req.ip)
      ? req.ip
      : "127.0.0.1";

    const decision = await aj.protect(req, {
      requested: 1,
      ip,
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