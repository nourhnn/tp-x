"use client";
import { useState, useEffect } from "react";

export default function TestMessages() {
  const [users, setUsers] = useState([]); // Liste des utilisateurs
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // ✅ Charger la liste des utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/messages/users");
      const data = await res.json();
      setUsers(data.users);
    };
    fetchUsers();
  }, []);

  // ✅ Charger les messages de l’utilisateur sélectionné
  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        const res = await fetch("/api/messages/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senderId: "id_de_ton_utilisateur", receiverId: selectedUser._id }),
        });
        const data = await res.json();
        setMessages(data.messages);
      };
      fetchMessages();
    }
  }, [selectedUser]);

  // ✅ Envoyer un message
  const sendMessage = async () => {
    if (!message.trim() || !selectedUser) return;

    const res = await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId: "id_de_ton_utilisateur", receiverId: selectedUser._id, content: message }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessages([...messages, { senderId: "id_de_ton_utilisateur", content: message }]);
      setMessage("");
    } else {
      console.error("Erreur lors de l'envoi :", data.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Test Messages</h1>

      {/* Liste des utilisateurs */}
      <h2 className="text-lg font-semibold">Utilisateurs :</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id} onClick={() => setSelectedUser(user)} className="cursor-pointer p-2 border mb-2">
            {user.name} (@{user.username})
          </li>
        ))}
      </ul>

      {/* Chat */}
      {selectedUser && (
        <div className="mt-4 p-4 border">
          <h2 className="text-lg font-semibold">Chat avec {selectedUser.name}</h2>
          <div className="h-40 overflow-y-auto border p-2 mb-2">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <p key={index} className={msg.senderId === "id_de_ton_utilisateur" ? "text-right bg-blue-200 p-1 rounded" : "text-left bg-gray-200 p-1 rounded"}>
                  {msg.content}
                </p>
              ))
            ) : (
              <p className="text-gray-500">Aucun message</p>
            )}
          </div>
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="border p-2 w-full mb-2" placeholder="Écrire un message..." />
          <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded">Envoyer</button>
        </div>
      )}
    </div>
  );
}
