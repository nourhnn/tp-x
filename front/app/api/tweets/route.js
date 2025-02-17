import { NextResponse } from "next/server";
import connectDB from "@/app/utils/db";
import Tweet from "@/app/models/Tweet";
import User from "@/app/models/user";

export async function POST(req) {
  try {
    await connectDB();
    const { text, image, userId } = await req.json();

    // Vérifier que les données sont bien envoyées
    if (!text || !userId) {
      return NextResponse.json({ error: "Le texte et l'ID utilisateur sont requis" }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe en base
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Créer et sauvegarder le tweet
    const newTweet = new Tweet({
      text,
      image,
      author: userId,
      createdAt: new Date(),
    });

    await newTweet.save();
    return NextResponse.json(newTweet, { status: 201 });

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
