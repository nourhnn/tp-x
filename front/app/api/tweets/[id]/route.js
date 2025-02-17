import { NextResponse } from "next/server";
import connectDB from "@/app/utils/db";
import Tweet from "@/app/models/Tweet";

// 📌 Supprimer un tweet (DELETE)
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const deletedTweet = await Tweet.findByIdAndDelete(id);
    if (!deletedTweet) {
      return NextResponse.json({ error: "Tweet introuvable" }, { status: 404 });
    }

    return NextResponse.json({ message: "Tweet supprimé" }, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du tweet :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 📌 Modifier un tweet (PUT)
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Le texte est requis" }, { status: 400 });
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(id, { text }, { new: true });
    if (!updatedTweet) {
      return NextResponse.json({ error: "Tweet introuvable" }, { status: 404 });
    }

    return NextResponse.json(updatedTweet, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur lors de la modification du tweet :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
