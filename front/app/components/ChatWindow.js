"use client";
import { useState, useEffect } from "react";

export default function ChatWindow({ senderId, recipientId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  console.log("👤 senderId :", senderId);
  console.log("📩 recipientId :", recipientId);

  // ✅ Définir `fetchMessages()` AVANT `useEffect()`
  const fetchMessages = async () => {
    if (!senderId || !recipientId) {
      console.error("⚠️ senderId ou recipientId manquant !");
      return;
    }

    try {
      console.log("📩 Envoi de la requête à /api/messages/get...");

      const res = await fetch("/api/messages/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: senderId, recipient: recipientId }),
      });

      console.log("✅ Statut de la réponse :", res.status);

      const data = await res.json();
      console.log("✅ Réponse JSON :", data);

      if (!res.ok) {
        throw new Error(data.message || "Erreur inconnue");
      }

      setMessages(data.messages);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des messages :", error);
    }
  };

  // ✅ `useEffect()` ne s'exécutera que si `senderId` et `recipientId` existent
  useEffect(() => {
    if (senderId && recipientId) {
      fetchMessages();
    }
  }, [senderId, recipientId]);

  // ✅ Fonction pour envoyer un message
  const sendMessage = async () => {
    if (!message.trim()) return; // ✅ Empêcher l'envoi de messages vides
  
    console.log("📩 Envoi du message avec :", { senderId, receiverId, content: message });
  
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId, receiverId, content: message }),
      });
  
      console.log("✅ Statut de la réponse :", res.status);
  
      const data = await res.json();
      console.log("✅ Réponse JSON :", data);
  
      if (!res.ok) {
        throw new Error(data.message || "Erreur inconnue");
      }
  
      setMessages([...messages, { senderId, content: message }]);
      setMessage("");
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi du message :", error);
    }
  };
  
  

  return (
    <div className="p-4 border rounded-lg shadow-md w-96">
      <h2 className="text-lg font-bold mb-2">Chat avec {recipientId}</h2>

      {/* Affichage des messages */}
      <div className="h-64 overflow-y-auto border p-2 mb-2">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <p key={index} className={`p-2 rounded-md ${msg.sender === senderId ? "bg-blue-200 text-right" : "bg-gray-200 text-left"}`}>
              <strong>{msg.sender === senderId ? "Moi" : "Lui"} :</strong> {msg.content}
            </p>
          ))
        ) : (
          <p className="text-gray-500">Aucun message</p>
        )}
      </div>

      {/* Champ de saisie */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Écrivez un message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-md"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-md">Envoyer</button>
      </div>
    </div>
  );
}
