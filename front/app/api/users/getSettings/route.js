// import { NextResponse } from "next/server";
// import connectDB from "../../../utils/db";
// import User from "../../../models/user";
// import { getServerSession } from "next-auth/next";

// export async function POST(req) {
//   await connectDB();
  
 

//   try {
//     const session = await getServerSession(req, authOptions);

//     if (!session || !session.user || !session.user.id) {
//       return NextResponse.json({ message: "Non autorisé ou session invalide" }, { status: 401 });
//     }

//     const { allowMessages } = await req.json();

//     if (typeof allowMessages !== "boolean") {
//       return NextResponse.json({ message: "Valeur invalide" }, { status: 400 });
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       session.user.id, // ✅ Utilisation correcte de l'ID utilisateur
//       { allowMessages },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Paramètre mis à jour !", user: updatedUser });
//   } catch (error) {
//     console.error("❌ Erreur serveur :", error);
//     return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
//   }
// }
