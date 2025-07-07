import Redis from "ioredis";
import jwt from "jsonwebtoken"; // ✅ THIS IS REQUIRED

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Optional: Handle connection errors
redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

// Get session by ID
export const getSession = async (sessionId) => {
  if (!sessionId) return null;

  try {
    const token = await redis.get(sessionId);

    if (!token) return null;

    // Decode JWT using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded;
  } catch (error) {
    console.error("❌ Error decoding JWT from Redis:", error);
    return null;
  }
};

// Set session by ID
export const setSession = async (sessionId, sessionData, ttlSeconds = 86400) => {
  try {
    // If you're passing a raw JWT as sessionData, don't stringify
    const value = typeof sessionData === "string"
      ? sessionData
      : JSON.stringify(sessionData);

    await redis.set(sessionId, value, "EX", ttlSeconds); // Default TTL = 24 hrs
  } catch (error) {
    console.error("❌ Error saving session to Redis:", error);
  }
};

// Delete session by ID
export const deleteSession = async (sessionId) => {
  if (!sessionId) return;
  try {
    await redis.del(sessionId);
  } catch (error) {
    console.error("❌ Error deleting session from Redis:", error);
  }
};

export default redis;
