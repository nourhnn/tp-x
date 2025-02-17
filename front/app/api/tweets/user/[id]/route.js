import { NextResponse } from "next/server";
import connectDB from "@/app/utils/db";
import Tweet from "@/app/models/Tweet";


export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params; // ID de l'utilisateur

    // Vérifier si l'ID est fourni
    if (!id) {
      return NextResponse.json({ error: "ID utilisateur requis" }, { status: 400 });
    }

    // Récupérer tous les tweets de l'utilisateur
    const userTweets = await Tweet.find({ author: id }).sort({ createdAt: -1 });

    return NextResponse.json(userTweets, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des tweets de l'utilisateur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
