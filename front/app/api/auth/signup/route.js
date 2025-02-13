import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/app/models/user";
import connectDB from "@/app/utils/db";

export async function POST(req) {
  try {
    console.log("Connexion à MongoDB...");
    await connectDB();
    
    const { name, username, email, password, birthdate } = await req.json();
    console.log("Données reçues :", { name, username, email, password, birthdate });

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Cet email est déjà utilisé" }, { status: 400 });
    }

    // Vérifier si l'identifiant (username) existe déjà
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json({ message: "Ce nom d'utilisateur est déjà pris" }, { status: 400 });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur avec username
    const newUser = new User({ name, username, email, password: hashedPassword, birthdate });
    await newUser.save();

    return NextResponse.json({ message: "Inscription réussie !" }, { status: 201 });

  } catch (error) {
    console.error("Erreur serveur :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
