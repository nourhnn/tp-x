"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from "./message.module.css"; // Import du fichie
import Sidebar from "../components/Sidebar";  

export default function TestMessages() {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [recentContacts, setRecentContacts] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/messages/users");
        if (!res.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
        const data = await res.json();
  
        console.log("📸 Utilisateurs récupérés dans Messages :", data.users); // 🔥 DEBUG
  
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des utilisateurs :", error);
      }
    };
    // ✅ Charger les contacts récents depuis localStorage
    const savedContacts = JSON.parse(localStorage.getItem("recentContacts")) || [];
    setRecentContacts(savedContacts);
  
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

    // ✅ Ajouter l'utilisateur aux contacts récents S'IL N'EST PAS DÉJÀ DEDANS
    setRecentContacts((prev) => {
      if (prev.some((user) => user._id === selectedUser._id)) {
        return prev; // Ne rien changer si l'utilisateur est déjà dans la liste
      }
      const updatedContacts = [selectedUser, ...prev];

      localStorage.setItem("recentContacts", JSON.stringify(updatedContacts));
      return updatedContacts;
    });

  }, [selectedUser]);

  // ✅ Fonction pour supprimer un contact récent
  const removeRecentContact = (userId) => {
    setRecentContacts((prev) => {
      const updatedContacts = prev.filter((user) => user._id !== userId);
      localStorage.setItem("recentContacts", JSON.stringify(updatedContacts));
      return updatedContacts;
    });
  };

  if (status === "loading") return <p>⏳ Chargement...</p>;
  if (!session) return <p>❌ Vous devez être connecté !</p>;

  const currentUserId = session.user.id;
  const currentUserName = session.user.name;

  const sendMessage = async () => {
    if (!message.trim() || !selectedUser) return;
  
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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(query) || user.username?.toLowerCase().includes(query)
    );
    
    setFilteredUsers(filtered);
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      {/* Sidebar gauche */}
      <div className={styles.sidebar}>
        <h2 className={styles.title}>Messages</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchBar}
          placeholder="🔍 Rechercher un utilisateur..."
        />

        <div className={styles.contacts}>
          {searchQuery ? (
            filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user._id} className={styles.contact} onClick={() => setSelectedUser(user)}>
                  <img src={user.profilePicture} alt={user.name} className={styles.avatarSearch} />
                  <div className={styles.contactInfo}>
                    <span className={styles.contactName}>{user.name}</span>
                    <span className={styles.contactUsername}>@{user.username}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noResults}>Aucun utilisateur trouvé.</p>
            )
          ) : (
            recentContacts.map((user) => (
              <div key={user._id} className={styles.contact} onClick={() => setSelectedUser(user)}>
                <img src={user.profilePicture} alt={user.name} className={styles.avatarSearch} />
                <div className={styles.contactInfo}>
                  <span className={styles.contactName}>{user.name}</span>
                  <span className={styles.contactUsername}>@{user.username}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Zone de discussion */}
      <div className={styles.chatArea}>
        {selectedUser ? (
          <>
            {/* En-tête de la discussion */}
            <div className={styles.chatHeader}>
              <img 
                src={selectedUser.profilePicture || "/default-avatar.png"} 
                alt={selectedUser.name} 
                className={styles.avatarMessage}
                onError={(e) => e.target.src = "/default-avatar.png"} // Remplace par une image par défaut si erreur
              />

              <div>
                <h3 className={styles.chatName}>{selectedUser.name}</h3>
                <p className={styles.chatUsername}>@{selectedUser.username}</p>
              </div>
            </div>

            {/* Messages */}
            <div className={styles.chatBox}>
              {messages
                .filter((msg) => msg.senderId === selectedUser._id || msg.senderId === currentUserId)
                .map((msg, index) => {
                  const isSentByMe = msg.senderId === currentUserId;
                  return (
                    <div key={index} className={`${styles.message} ${isSentByMe ? styles.sent : styles.received}`}>
                      <p className={styles.messageText}>{msg.content}</p>
                    </div>
                  );
                })}
            </div>


            {/* Zone d'envoi de message */}
            <div className={styles.chatInput}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.inputField}
                placeholder="Écrire un message..."
              />
              <button onClick={() => sendMessage(message, selectedUser._id)} className={styles.sendButton}>
                ➤
              </button>
            </div>
          </>
        ) : (
          <p className={styles.noConversation}>Sélectionnez un utilisateur pour commencer la discussion.</p>
        )}
      </div>
    </div>
  );
}
