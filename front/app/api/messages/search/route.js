import { NextResponse } from "next/server";
import connectDB from "../../../utils/db";
import User from "../../../models/user";

export async function GET(req) {
  try {
    console.log("📩 API /api/messages/search appelée !");
    await connectDB();
    console.log("✅ Connexion MongoDB réussie");

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    console.log("🔍 Recherche pour :", query);

    if (!query) {
      console.log("⚠️ Aucun terme de recherche fourni");
      return NextResponse.json({ message: "Aucun terme de recherche fourni" }, { status: 400 });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } }
      ]
    }).select("name username _id profilePicture");

    console.log("✅ Utilisateurs trouvés :", users);

    return NextResponse.json({ users }, { status: 200 });

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return NextResponse.json({ message: "Erreur serveur", error: error.message }, { status: 500 });
  }
}
