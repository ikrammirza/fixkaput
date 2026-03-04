import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGO_URI not found in environment variables");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDb() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    }).then((mongoose) => {
      return mongoose;
    }).catch((err) => {
      console.error("❌ MongoDB connection error:", err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    throw err;
  }
}

/** Wraps an API handler to ensure DB connection before execution */
export const withDb = (handler) => {
  return async (req, res) => {
    await connectDb();
    return handler(req, res);
  };
};

export default connectDb;
