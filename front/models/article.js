import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator"; // Pour valider les valeurs uniques

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            required: true,
        },
        picture: {
            type: String,
        },
    },
    {
        timestamps: true, // Ajoute `createdAt` et `updatedAt`
    }
);

// Appliquer le plugin pour valider les valeurs uniques
articleSchema.plugin(uniqueValidator);

// Création du modèle
const Article = mongoose.models.Article || mongoose.model("Article", articleSchema);

export default Article;
