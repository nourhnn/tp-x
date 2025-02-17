import mongoose from "mongoose";

let isConnected = false; // Ajout d'une variable pour suivre l'état de connexion

const connectDB = async () => {
  if (isConnected) {
    console.log("✅ MongoDB déjà connecté");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true; // Marquer la connexion comme établie
    console.log("✅ MongoDB connecté");
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB :", error);
    throw new Error("Échec de connexion à MongoDB");
  }
};

export default connectDB;
