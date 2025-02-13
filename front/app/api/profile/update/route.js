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

    const { profilePicture } = await req.json(); // Récupérer la nouvelle image
    if (!profilePicture) return NextResponse.json({ message: "Aucune image fournie" }, { status: 400 });

    const user = await User.findByIdAndUpdate(decoded.userId, { profilePicture }, { new: true });
    if (!user) return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 });

    return NextResponse.json({ message: "Photo de profil mise à jour", user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
