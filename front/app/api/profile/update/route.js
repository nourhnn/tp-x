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

    const body = await req.json();
    console.log("🔍 Données reçues dans API update :", body); // 🔥 Voir ce qui arrive

    const { profilePicture, banner, name, username } = body;

    if (!profilePicture && !banner && !name && !username) {
      return NextResponse.json({ message: "Aucune donnée fournie pour la mise à jour" }, { status: 400 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 });

    if (profilePicture) user.profilePicture = profilePicture;
    if (banner) user.banner = banner;
    if (name) user.name = name;
    if (username) user.username = username;

    await user.save();

    return NextResponse.json({ message: "Profil mis à jour", user }, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur API update :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
