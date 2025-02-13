import { NextResponse } from "next/server";
import connectDB from "@/app/utils/db";
import User from "@/app/models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Utilise bcryptjs au lieu de bcrypt

export async function POST(req) {
    await connectDB();
  
    try {
      const { email, password } = await req.json();
      console.log("Requête reçue - Email:", email, "Password:", password); // Debug
  
      const user = await User.findOne({ email });
      if (!user) {
        console.log("Utilisateur introuvable !");
        return NextResponse.json({ message: "Utilisateur introuvable." }, { status: 404 });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        console.log("Mot de passe incorrect !");
        return NextResponse.json({ message: "Mot de passe incorrect." }, { status: 401 });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      console.log("Token généré :", token);
  
      return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
      console.error("Erreur serveur :", error);
      return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
    }
  }
