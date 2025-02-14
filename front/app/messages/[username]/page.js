"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/app/components/Sidebar"; // 🔥 Sidebar ajoutée
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import styles from "./styles.module.css";

export default function ChatPage() {
  const { username } = useParams();
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 🔥 Charger les infos de l'utilisateur + messages
    const fetchChat = async () => {
      const userRes = await fetch(`/api/getUser?username=${username}`);
      const userData = await userRes.json();
      setUser(userData);

      const messagesRes = await fetch(`/api/getMessages?username=${username}`);
      const messagesData = await messagesRes.json();
      setMessages(messagesData);
    };

    fetchChat();
  }, [username]);

  return (
    <div className={styles.messagesLayout}>
      {/* 🔥 Sidebar toujours visible à gauche */}
      <Sidebar />

      {/* 🔥 Liste des conversations au milieu */}
      <div className={styles.conversationsList}>
        {/* (Réutilise la liste des conversations de MessagesPage) */}
      </div>

      {/* 🔥 Zone des messages à droite */}
      <div className={styles.chatBox}>
        {user && (
          <div className={styles.chatHeader}>
            <img src={user.profilePicture} alt={user.name} className={styles.chatProfilePic} />
            <div>
              <p className={styles.chatName}>{user.name}</p>
              <p className={styles.chatUsername}>@{user.username}</p>
            </div>
          </div>
        )}

        <MessageList messages={messages} />
        <MessageInput username={username} setMessages={setMessages} />
      </div>
    </div>
  );
}
