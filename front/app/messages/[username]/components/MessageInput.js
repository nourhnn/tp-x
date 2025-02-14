import { useState } from "react";
import styles from "../styles.module.css";

export default function MessageInput({ username, setMessages }) {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = { text: message, isSender: true, timestamp: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, newMessage]); // 🔥 Met à jour instantanément

    await fetch("/api/sendMessage", {
      method: "POST",
      body: JSON.stringify({ username, message }),
    });

    setMessage(""); // Reset l'input après envoi
  };

  return (
    <div className={styles.messageInputContainer}>
      <input
        type="text"
        placeholder="Write a message..."
        className={styles.messageInput}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage} className={styles.sendButton}>Send</button>
    </div>
  );
}
