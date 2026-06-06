require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

async function testTMDB() {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/popular",
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
      },
    }
  );

  const data = await response.json();

  console.log(data);
}

testTMDB();