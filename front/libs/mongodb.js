import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            console.log("🔄 MongoDB déjà connecté !");
            return;
        }

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ MongoDB connecté !");
    } catch (error) {
        console.error("🚨 Erreur de connexion MongoDB :", error);
        process.exit(1);
    }
};

// Charger les modèles après la connexion
import "../app/models/article";
import "../app/models/user";

export default connectDB;
