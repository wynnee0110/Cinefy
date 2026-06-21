const tvService = require("./tv.service");


exports.getPopular = async (req, res) => {
  try {
    const data = await tvService.getPopular();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrending = async (req, res) => {
  try {
    const { timeWindow = "week" } = req.params;
    const data = await tvService.getTrending(timeWindow);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopRated = async (req, res) => {
  try {
    const data = await tvService.getTopRated();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAiringToday = async (req, res) => {
  try {
    const data = await tvService.getAiringToday();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOnTheAir = async (req, res) => {
  try {
    const data = await tvService.getOnTheAir();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getShow = async (req, res) => {
  try {
    const data = await tvService.getShow(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSeason = async (req, res) => {
  try {
    const { id, seasonNumber } = req.params;
    const data = await tvService.getSeason(id, seasonNumber);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getGenres = async (req, res) => {
  try {
    const data = await tvService.getGenres();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByGenre = async (req, res) => {
  try {
    const { genreId } = req.params;
    const { page = 1 } = req.query;
    const data = await tvService.getByGenre(genreId, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const { q, page = 1 } = req.query;
    const data = await tvService.search(q, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getImages = async (req, res) => {  
  try {
    const data = await tvService.getImages(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSimilar = async (req, res) => {
  try {
    const data = await tvService.getSimilar(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
