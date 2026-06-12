const express = require("express");
const redis = require("../config/redis");

const router = express.Router();

router.get("/redis-test", async (req, res) => {
  try {
    await redis.set("hello", "cinefy");

    const value = await redis.get("hello");

    res.json({
      success: true,
      value,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;