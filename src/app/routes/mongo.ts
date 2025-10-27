import mongoose from "mongoose";

// Use global variable to maintain connection across hot reloads (Next.js)
let isConnected = global.mongoose?.isConnected || false;

const connectMongo = async () => {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error("MongoDB URI is not defined in environment variables.");
  }

  try {
    // Connect to MongoDB with recommended options
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000,  // 45 seconds
    });

    isConnected = true;
    // Store connection status globally to persist across hot reloads
    if (!global.mongoose) global.mongoose = { isConnected: true };
    else global.mongoose.isConnected = true;

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectMongo;
