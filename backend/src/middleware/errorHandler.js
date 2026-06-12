/**
 * Global error handler middleware.
 * Must have 4 parameters for Express to treat it as an error handler.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.path} —`, err.message);

  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
}

module.exports = errorHandler;
