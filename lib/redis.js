import Redis from "ioredis";
import jwt from "jsonwebtoken";

if (!process.env.REDIS_URL) {
  console.warn("⚠️ REDIS_URL not found, falling back to localhost");
}

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
});

// Connection logs
redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

// Get session
export const getSession = async (sessionId) => {
  if (!sessionId) return null;

  try {
    const token = await redis.get(sessionId);
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;

  } catch (error) {
    console.error("❌ Error decoding JWT from Redis:", error);
    return null;
  }
};

// Set session
export const setSession = async (sessionId, sessionData, ttlSeconds = 86400) => {
  try {
    const value =
      typeof sessionData === "string"
        ? sessionData
        : JSON.stringify(sessionData);

    await redis.set(sessionId, value, "EX", ttlSeconds);

  } catch (error) {
    console.error("❌ Error saving session to Redis:", error);
  }
};

// Delete session
export const deleteSession = async (sessionId) => {
  if (!sessionId) return;

  try {
    await redis.del(sessionId);
  } catch (error) {
    console.error("❌ Error deleting session from Redis:", error);
  }
};

export default redis;