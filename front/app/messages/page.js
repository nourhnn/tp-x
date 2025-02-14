"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";
import styles from "./styles.module.css";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // 🔥 Charger toutes les conversations existantes
    const fetchConversations = async () => {
      const res = await fetch("/api/getConversations");
      const data = await res.json();
      setConversations(data);
    };

    fetchConversations();
  }, []);

  // 🔍 Recherche d'utilisateur pour envoyer un message
  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 1) {
      const res = await fetch(`/api/search?q=${e.target.value}`);
      const data = await res.json();
      setSearchResults(data.users);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className={styles.messagesLayout}>
      {/* 🔥 Sidebar à gauche */}
      <Sidebar />

      {/* 🔥 Liste des conversations au centre */}
      <div className={styles.conversationsList}>
        <h2>Messages</h2>

        {/* 🔍 Barre de recherche des utilisateurs */}
        <input
          type="text"
          placeholder="Search Direct Messages"
          className={styles.searchBox}
          value={searchQuery}
          onChange={handleSearch}
        />

        {/* 🔍 Résultats de recherche des utilisateurs */}
        {searchQuery && searchResults.length > 0 && (
          <div className={styles.searchResults}>
            {searchResults.map((user) => (
              <Link key={user.username} href={`/messages/${user.username}`} className={styles.searchItem}>
                <img src={user.profilePicture} alt={user.name} className={styles.searchProfilePic} />
                <div>
                  <p className={styles.searchName}>{user.name}</p>
                  <p className={styles.searchUsername}>@{user.username}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 🔥 Liste des conversations */}
        {conversations.map((conv) => (
          <Link key={conv.username} href={`/messages/${conv.username}`} className={styles.conversationItem}>
            <img src={conv.profilePicture} alt={conv.name} className={styles.profilePic} />
            <div>
              <p className={styles.name}>{conv.name}</p>
              <p className={styles.lastMessage}>{conv.lastMessage}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 🔥 Zone vide "Select a message" si aucun utilisateur n'est sélectionné */}
      <div className={styles.selectMessage}>
        <h2>Select a message</h2>
        <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
      </div>
    </div>
  );
}
