import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI non défini dans .env.local");
}

export default async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connecté à MongoDB");
  } catch (error) {
    console.error("❌ Erreur connexion MongoDB :", error);
    process.exit(1);
  }
}
