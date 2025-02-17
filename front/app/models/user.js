import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthdate: { type: Date, required: true },
  profilePicture: { type: String, default: "/default-profile.png" }, // ✅ Ajout de l'image de profil par défaut
  banner: { type: String, default: "/default-banner.jpg" }, // ✅ Ajout de la bannière par défaut
  createdAt: { type: Date, default: Date.now },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  allowMessages: { type: Boolean, default: true }, 
  bio: { type: String, default: "" }, // ✅ Ajout de la bio
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
