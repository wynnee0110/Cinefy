require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const redis = require("./config/redis");

async function testUpstash() {
  console.log("Connecting to Upstash Redis...");
  console.log("URL:", process.env.UPSTASH_REDIS_REST_URL);

  try {
    const testKey = "test:connection";
    const testValue = { status: "success", timestamp: new Date().toISOString() };

    console.log("Setting key...");
    await redis.set(testKey, testValue);

    console.log("Getting key...");
    const result = await redis.get(testKey);

    console.log("Result from Upstash:", result);

    if (result && result.status === "success") {
      console.log("✅ Upstash Redis connection is working perfectly!");
    } else {
      console.log("❌ Connection completed but received unexpected value.");
    }
  } catch (error) {
    console.error("❌ Failed to connect or query Upstash Redis:", error);
  }
}

testUpstash();
