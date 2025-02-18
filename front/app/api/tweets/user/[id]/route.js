import { NextResponse } from "next/server";
import mongoose from "mongoose"; // 🔥 Ajout de mongoose pour la validation de l'ObjectId
import connectDB from "@/app/utils/db";
import Tweet from "@/app/models/Tweet";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params; // ID de l'utilisateur

    // 🔹 Vérifier si l'ID est valide (ObjectId MongoDB)
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.error("❌ ID utilisateur invalide :", id);
      return NextResponse.json({ error: "ID utilisateur invalide" }, { status: 400 });
    }

    // 🔹 Récupérer tous les tweets de l'utilisateur
    const userTweets = await Tweet.find({ author: id }).sort({ createdAt: -1 });

    if (!userTweets.length) {
      console.warn("⚠️ Aucun tweet trouvé pour cet utilisateur :", id);
      return NextResponse.json({ message: "Aucun tweet trouvé" }, { status: 200 });
    }

    console.log("✅ Tweets récupérés :", userTweets);
    return NextResponse.json(userTweets, { status: 200 });

  } catch (error) {
    console.error("❌ Erreur lors de la récupération des tweets de l'utilisateur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
