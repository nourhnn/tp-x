// On va commencer par importer mongoose
import mongoose from "mongoose";

// notre fonction qui va nous connecter à MongoDB
const connect = async () => {
    // D'abord, on vérifie si on est déjà connecté
    if (mongoose.connections[0].readyState) {
        console.log("Déjà connecté à MongoDB");
        return;
    }
    try {
        // Tentative de connexion avec les variables d'environnement
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'Blog', // On dit à MongoDB qu'on veut utiliser notre base 'Blog'
            useNewUrlParser: true,
            // Cette option permet d'utiliser le nouveau système d'analyse
            // d'URL de MongoDB. C'est recommandé car l'ancien analyseur est déprécié.
            useUnifiedTopology: true,
            // Cette option active le nouveau moteur de gestion de la topologie
            // du serveur MongoDB, qui offre une meilleure gestion des connexions
            // et une surveillance plus efficace du cluster.
        });
        console.log("On est connecté à MongoDB ");
    } catch (error) {
        // Oups, quelque chose s'est mal passé... On note l'erreur
        console.error("Problème de connexion:", error.message);
        throw new Error("Échec de connexion à la base de données");
    }
};

/**
* Système de cache pour éviter les connexions multiples
* Garde en mémoire l'état de la connexion globalement
*/
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

/**
* Fonction principale exportée qui gère la connexion MongoDB
* Implémente le pooling de connexions et le cache
* @returns {Promise} Connexion Mongoose
*/
export default async function connectDB() {
    // Retourne la connexion existante si disponible
    if (cached.conn) {
        return cached.conn;
    }
    // Initialise la connexion si aucune n'est en cours
    if (!cached.promise) {
        cached.promise = connect();
    }
    try {
        // Attend que la connexion soit établie
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (e) {
        // Réinitialise la promesse en cas d'erreur pour réessayer
        cached.promise = null;
        throw e;
    }
}