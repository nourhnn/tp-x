import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "../../../models/user";
import connectDB from "../../../utils/db";

export async function POST(req) {
  try {
    console.log("🚀 Requête reçue sur /api/auth/signup");
    await connectDB();
    
    const { name, username, email, password, birthdate } = await req.json();
    console.log("📩 Données reçues :", { name, username, email, password, birthdate });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Cet email est déjà utilisé" }, { status: 400 });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json({ message: "Ce nom d'utilisateur est déjà pris" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, email, password: hashedPassword, birthdate });
    await newUser.save();

    return NextResponse.json({ message: "Inscription réussie ! Connecte-toi maintenant." }, { status: 201 });

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
