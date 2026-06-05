const movieService = require("./movie.service");

exports.getPopular = async (req, res) => {
    try {
        const movies = await movieService.getPopular();

        res.json(movies);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.getMovie = async (req, res) => {
    try {
        const movie = await movieService.getMovie(
            req.params.id
        );

        res.json(movie);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};