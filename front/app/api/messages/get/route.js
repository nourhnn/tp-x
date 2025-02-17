import { NextResponse } from "next/server";
import connectDB from "../../../utils/db";
import Message from "../../../models/message";

export async function POST(req) {
  try {
    await connectDB();
    
    const { senderId, receiverId } = await req.json();

    if (!senderId || !receiverId) {
      return NextResponse.json({ message: "Données invalides" }, { status: 400 });
    }

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ timestamp: 1 }); // ✅ Trier les messages du plus ancien au plus récent

    console.log("📩 Messages trouvés :", messages);

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
