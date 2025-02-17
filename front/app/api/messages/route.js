import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import Message from "../../models/message";
import connectDB from "../../../libs/mongodb";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) return new Response("Chat ID is required", { status: 400 });

  const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

  return new Response(JSON.stringify(messages), { status: 200 });
}
