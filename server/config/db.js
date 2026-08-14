import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.error("The server will keep running, but database features (auth, courses, quizzes) will not work until MONGO_URI is set correctly in .env");
  }
}
