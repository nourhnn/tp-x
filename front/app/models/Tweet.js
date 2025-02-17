import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 280 },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Associer le tweet à un utilisateur
});

export default mongoose.models.Tweet || mongoose.model("Tweet", TweetSchema);
