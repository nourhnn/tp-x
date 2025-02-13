import { NextResponse } from "next/server";
import connectDB from "@/app/utils/db";
import User from "@/app/models/user";

export async function GET(req, { params }) {
  await connectDB();

  try {
    const { username } = params;
    console.log("🔍 Recherche de l'utilisateur :", username);

    if (!username) return NextResponse.json({ message: "Username requis" }, { status: 400 });

    const user = await User.findOne({ username }, { name: 1, username: 1, bio: 1, profilePicture: 1, banner: 1 });

    if (!user) return NextResponse.json({ message: `Utilisateur '${username}' non trouvé` }, { status: 404 });

    console.log("✅ Utilisateur trouvé :", user);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur API Profil :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
