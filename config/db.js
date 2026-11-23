const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pustak_bookstore";

  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout to fall back gracefully if daemon isn't up
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Warning: Could not connect to MongoDB at "${uri}".`);
    console.warn(`[MongoDB] Operating in graceful in-memory storage fallback mode.`);
    console.warn(`[MongoDB] Reason: ${error.message}`);
    return false;
  }
};

const getStatus = () => ({
  connected: isConnected,
  database: isConnected ? mongoose.connection.name : "in-memory-fallback",
  readyState: mongoose.connection.readyState,
  host: isConnected ? mongoose.connection.host : "localhost",
});

module.exports = { connectDB, getStatus };
