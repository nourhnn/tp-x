import { NextResponse } from "next/server";
import connectDB from "@/app/utils/db";
import Conversation from "@/app/models/conversation";
import { getSession } from "next-auth/react"; // Si tu utilises NextAuth

export async function GET(req) {
  await connectDB();

  const session = await getSession({ req });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const conversations = await Conversation.find({ participants: session.user.username })
      .sort({ lastMessageAt: -1 }) // Trier par dernier message reçu/envoyé
      .select("participants lastMessage");

    const formattedConversations = conversations.map((conv) => {
      const otherUser = conv.participants.find((p) => p !== session.user.username);
      return {
        username: otherUser,
        name: otherUser, // À remplacer par une requête pour récupérer les noms
        profilePicture: `/avatars/${otherUser}.png`, // À adapter selon ton système de stockage
        lastMessage: conv.lastMessage || "No messages yet",
      };
    });

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error("Erreur lors de la récupération des conversations :", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
