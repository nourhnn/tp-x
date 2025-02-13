import { NextResponse } from "next/server";
import connectDB from "@/app/utils/db";
import User from "@/app/models/user";
import jwt from "jsonwebtoken";

export async function GET(req) {
  await connectDB();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      console.log("❌ Aucun token reçu !");
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

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
