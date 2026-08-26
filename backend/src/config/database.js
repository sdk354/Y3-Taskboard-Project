import mongoose from "mongoose";

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log("connected to MongoDB");
};

export default connectDB;
