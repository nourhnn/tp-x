import { NextResponse } from "next/server";
import connectDB from "@/app/utils/db";
import User from "@/app/models/user";

export async function GET(req, { params }) {
  await connectDB();

  try {
    const { username } = params;
    if (!username) return NextResponse.json({ message: "Username requis" }, { status: 400 });

    const user = await User.findOne({ username });
    if (!user) return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
