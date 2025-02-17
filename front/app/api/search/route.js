import { NextResponse } from "next/server";
import connectDB from "../../utils/db";
import User from "../../models/user";

export async function GET(req) {
  await connectDB();
  
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ message: "Aucun terme de recherche fourni" }, { status: 400 });
  }

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } }
      ]
    }).select("name username profilePicture");

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
