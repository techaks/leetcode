import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ Please define MONGO_URI in .env.local");
}

// 🔥 Global cache (Next.js hot reload fix)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // ✅ already connected
  if (cached.conn) {
    return cached.conn;
  }

  // ✅ connection already in progress
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      dbName: "mydb", // ⚠️ अपना DB name डालना
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    cached.promise = null;
    console.log("❌ MongoDB Error:", err);
    throw err;
  }

  return cached.conn;
};