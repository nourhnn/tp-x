import { NextResponse } from "next/server";
import connectDB from "@/app/utils/db";
import Message from "@/app/models/message";
import Conversation from "@/app/models/conversation";
import { getSession } from "next-auth/react";

export async function POST(req) {
  await connectDB();

  const session = await getSession({ req });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username, message } = await req.json();

    if (!username || !message) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const newMessage = new Message({
      sender: session.user.username,
      receiver: username,
      text: message,
      createdAt: new Date(),
    });

    await newMessage.save();

    // Mettre à jour ou créer la conversation
    await Conversation.findOneAndUpdate(
      { participants: { $all: [session.user.username, username] } },
      { lastMessage: message, lastMessageAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
