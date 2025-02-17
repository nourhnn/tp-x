import { NextResponse } from "next/server";
import connectDB from "../../../utils/db";
import User from "../../../models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    console.log("⚙️ Requête POST reçue sur /api/users/updateMessages");

    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { allowMessages } = await req.json();
    await User.findByIdAndUpdate(session.user.id, { allowMessages });

    return NextResponse.json({ message: "Préférences mises à jour !" }, { status: 200 });

  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
