import { NextResponse } from "next/server";
import connectDB from "@/app/utils/db";
import User from "@/app/models/user";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  await connectDB();

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { profilePicture, banner, name, username, bio } = await req.json();
    
    console.log("🔍 Données reçues pour mise à jour :", { profilePicture, banner, name, username, bio });

    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 });

    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (banner !== undefined) user.banner = banner;
    if (name !== undefined) user.name = name;
    if (username !== undefined) user.username = username;
    if (bio !== undefined) user.bio = bio;  // 🔥 Vérification pour bien enregistrer la bio

    await user.save();
    
    console.log("✅ Profil mis à jour :", user);

    return NextResponse.json({ message: "Profil mis à jour", user }, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur API update :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
