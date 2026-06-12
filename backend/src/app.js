const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

const movieRoutes = require("./modules/movies/movie.routes");
const tvRoutes    = require("./modules/tv/tv.routes");

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/movies", movieRoutes);
app.use("/tv",     tvRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;