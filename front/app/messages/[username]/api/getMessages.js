import { NextResponse } from "next/server";
import connectDB from "@/app/utils/db";
import Message from "@/app/models/message";
import { getSession } from "next-auth/react";

export async function GET(req) {
  await connectDB();

  const session = await getSession({ req });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const otherUser = searchParams.get("username");

  if (!otherUser) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const messages = await Message.find({
      $or: [
        { sender: session.user.username, receiver: otherUser },
        { sender: otherUser, receiver: session.user.username },
      ],
    }).sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
