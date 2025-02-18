import { NextResponse } from "next/server";
import connectDB from "../../../utils/db";
import User from "../../../models/user";
import jwt from "jsonwebtoken";

export async function GET(req, context) {
  await connectDB();
  
  try {
    const { id } = context.params; // ✅ Attendre les paramètres dynamiques

    console.log("🔍 Paramètre reçu :", id);

    let user;

    // ✅ Gérer le cas spécial "/profile/me"
    if (id === "me") {
      const authHeader = req.headers.get("authorization");

      if (!authHeader) {
        console.log("❌ Aucun token reçu !");
        return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
      }

      try {
        const token = authHeader.split(" ")[1]; // Extraire le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log("🔑 ID extrait du token :", decoded.id);
    
        // Récupérer l'utilisateur connecté avec l'ID du token
        user = await User.findById(decoded.id).select("-password");
    
      } catch (error) {
        console.warn("⚠️ Token invalide ou expiré :", error.message);
        return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
      }
    } else {
      // Si ce n'est pas "me", rechercher par ID ou username
      user = await User.findOne({ $or: [{ _id: id }, { username: id }] }).select("-password");
    }

    if (!user) {
      console.log("❌ Utilisateur introuvable !");
      return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 });
    }

    console.log("✅ Utilisateur trouvé :", user);
    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error("🚨 Erreur serveur :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
