import { NextResponse } from "next/server";
import connectDB from "../../../utils/db";
import Message from "../../../models/message";
import User from "../../../models/user"; // ✅ Import du modèle User

export async function POST(req) {
  try {
    await connectDB();
    
    const { senderId, receiverId, content } = await req.json();

    if (!senderId || !receiverId || !content.trim()) {
      return NextResponse.json({ message: "Données invalides" }, { status: 400 });
    }

    // ✅ Vérifier si le destinataire autorise les messages privés
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return NextResponse.json({ message: "Destinataire introuvable." }, { status: 404 });
    }
    if (!receiver.allowMessages) {
      return NextResponse.json({ message: "Cet utilisateur n'accepte pas les messages privés." }, { status: 403 });
    }

    // ✅ Si l'utilisateur accepte les messages, on les enregistre
    const newMessage = new Message({ senderId, receiverId, content });
    await newMessage.save();

    return NextResponse.json({ message: "Message envoyé !" }, { status: 201 });
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
