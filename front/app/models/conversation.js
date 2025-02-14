import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  participants: { type: [String], required: true }, // Liste des deux utilisateurs
  lastMessage: { type: String, default: "" },
  lastMessageAt: { type: Date, default: Date.now },
});

export default mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
