import { NextResponse } from "next/server";
import connectDB from "@/app/utils/db";
import User from "@/app/models/user";
import { verifyToken } from "@/app/utils/auth"; // Fonction pour vérifier le token

export async function GET(req) {
  try {
    await connectDB();

    // Récupérer le token d'authentification depuis le header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    // Récupérer l'utilisateur connecté
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du profil :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
