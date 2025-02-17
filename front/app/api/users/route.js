import { NextResponse } from "next/server";
import connectDB from "../../../utils/db";
import User from "../../../models/user";

export async function GET() {
  try {
    console.log("🔍 API /api/messages/users appelée !");
    await connectDB();
    console.log("✅ Connexion MongoDB réussie");

    const users = await User.find().select("_id name username");
    console.log("✅ Utilisateurs récupérés :", users);

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
