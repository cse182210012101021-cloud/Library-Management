import mongoose from "mongoose";

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(mongoURI);
    isConnected = mongoose.connection.readyState === 1;

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    const { seedBooks } = await import("@/db/seed");
    const { seedStudents } = await import("@/db/seed-students");

    await seedBooks();
    await seedStudents();

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      isConnected = false;
      process.exit(1);
    });
  } catch (error) {
    throw error;
  }
}
