import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGO_URI is not defined. Set it in Railway environment variables.",
    );
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MONGODB CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.error("error connect to mongoDB", error);
    throw error;
  }
};
