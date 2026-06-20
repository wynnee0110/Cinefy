const express = require("express");
const compression = require("compression");
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
  characteristics: ["ip.src"],
  rules: [
    shield({
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:PREVIEW",
        "CATEGORY:MONITOR",
      ],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
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

app.use(compression());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Arcjet middleware
app.use(async (req, res, next) => {
  try {
    // Skip Arcjet for requests with no real client IP (e.g. Render's
    // internal health-check probes from localhost / ::1). Arcjet reads
    // req.ip internally and cannot fingerprint loopback addresses.
    if (!req.ip || ["::1", "127.0.0.1"].includes(req.ip)) {
      return next();
    }

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