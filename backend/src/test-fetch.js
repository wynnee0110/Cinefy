require("dotenv").config();
const BASE_URL = "https://api.themoviedb.org/3";
const headers = {
  Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
  accept: "application/json",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

async function test(id, append) {
  const url = `${BASE_URL}/movie/${id}?append_to_response=${append}`;
  try {
    const res = await fetch(url, { headers });
    console.log(`Movie ID [${id}] Append [${append}]: status = ${res.status}`);
  } catch (err) {
    console.log(`Movie ID [${id}] Append [${append}]: error = ${err.message}`);
  }
}

async function run() {
  await test(550, "videos");
  await test(823464, "videos");
  await test(1022789, "videos");
  await test(550, "");
  await test(823464, "");
  await test(1022789, "");
}

run();
