const BASE_URL = "https://api.themoviedb.org/3";

const headers = {
    Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
    accept: "application/json"
};

exports.getPopular = async () => {
    const response = await fetch(
        `${BASE_URL}/movie/popular`,
        { headers }
    );

    return response.json();
};

exports.getMovie = async (id) => {
    const response = await fetch(
        `${BASE_URL}/movie/${id}?append_to_response=videos`,
        { headers }
    );

    return response.json();
};