// "use client";
// import { useSession, signOut } from "next-auth/react";
// import { useEffect } from "react";

// export default function TestSession() {
//   const { data: session, status, update } = useSession();

//   useEffect(() => {
//     if (status === "authenticated") {
//       update(); // 🔄 Force la mise à jour de la session
//     }
//   }, [status]);

//   if (status === "loading") return <p>⏳ Chargement...</p>;

//   return (
//     <div>
//       <h2>Session Active :</h2>
//       {session?.user ? (
//         <>
//           <p>Nom : {session.user.name}</p>
//           <p>Username : {session.user.username}</p>
//           <p>Email : {session.user.email}</p>
//           <p>ID : {session.user.id}</p>
//           <button onClick={() => signOut()} style={{ marginTop: "10px", padding: "5px 10px", background: "red", color: "white", border: "none", cursor: "pointer" }}>
//             🚪 Déconnexion
//           </button>
//         </>
//       ) : (
//         <p>❌ Aucun utilisateur connecté</p>
//       )}
//     </div>
//   );
// }
