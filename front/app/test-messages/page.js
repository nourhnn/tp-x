"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function TestMessages() {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/messages/users");
        if (!res.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des utilisateurs :", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: session?.user?.id,
            receiverId: selectedUser._id,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setMessages(data.messages);
        } else {
          console.error("❌ Erreur lors de la récupération des messages :", data.message);
        }
      } catch (error) {
        console.error("❌ Erreur réseau :", error);
      }
    };

    fetchMessages();
  }, [selectedUser]);

  if (status === "loading") return <p>⏳ Chargement...</p>;
  if (!session) return <p>❌ Vous devez être connecté !</p>;

  const currentUserId = session.user.id;
  const currentUserName = session.user.name;

  console.log("👤 Utilisateur connecté :", { id: currentUserId, name: currentUserName });

  const sendMessage = async () => {
    if (!message.trim() || !selectedUser) return;
  
    console.log("📩 Envoi du message avec :", {
      senderId: session.user.id, 
      receiverId: selectedUser._id,
      content: message,
    });
  
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: session.user.id,
          receiverId: selectedUser._id,
          content: message,
        }),
      });
  
      const data = await res.json();
      console.log("✅ Réponse API :", data);
  
      if (res.ok) {
        setMessages([
          ...messages,
          {
            senderId: session.user.id,
            receiverId: selectedUser._id,
            content: message,
          },
        ]);
        setMessage("");
      } else {
        console.error("❌ Erreur :", data.message);
      }
    } catch (error) {
      console.error("❌ Erreur réseau :", error);
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold">
        ✅ Connecté en tant que : {currentUserName} (ID: {currentUserId})
      </h2>
      <h1 className="text-xl font-bold mb-4">Liste des utilisateurs</h1>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className="cursor-pointer p-2 border mb-2 hover:bg-gray-100"
            >
              {user.name} (@{user.username})
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Aucun utilisateur trouvé.</p>
      )}
      {selectedUser && (
        <div className="mt-4 p-4 border">
          <h2 className="text-lg font-semibold">
            Discussion avec {selectedUser.name}
          </h2>
          <div className="border p-2 h-40 overflow-y-scroll mb-2">
            {messages.length > 0 ? (
              messages.map((msg, index) => {
                const isSentByMe = msg.senderId === currentUserId; // ✅ Vérifier si c'est moi qui ai envoyé le message
                const senderName = isSentByMe ? "Moi" : users.find(u => u._id === msg.senderId)?.name || "Inconnu"; // ✅ Trouver le nom de l'expéditeur

                return (
                  <p
                    key={index}
                    className={`p-2 ${isSentByMe ? "bg-blue-200 text-right" : "bg-gray-200 text-left"}`}
                  >
                    <strong>{senderName} :</strong> {msg.content}
                  </p>
                );
              })
            ) : (
              <p className="text-gray-500">Aucun message.</p>
            )}
          </div>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-2 w-full mb-2"
            placeholder="Écrire un message..."
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">
            Envoyer
          </button>
        </div>
      )}
    </div>
  );
}
