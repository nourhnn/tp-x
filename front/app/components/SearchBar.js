"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/page.module.css";

export default function SearchBar({ currentUser }) { // 🔥 On récupère l'utilisateur connecté
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // Liste des profils sélectionnés
  const router = useRouter();

  const storageKey = `selectedUsers_${currentUser?.username}`; // 🔥 Clé unique pour chaque utilisateur

  // 🔄 Charger les recherches spécifiques à l'utilisateur connecté
  useEffect(() => {
    if (!currentUser?.username) return;
    
    try {
      const storedUsers = localStorage.getItem(storageKey);
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        console.log(`🔄 Utilisateurs chargés pour ${currentUser.username}:`, parsedUsers);
        setSelectedUsers(parsedUsers);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      localStorage.removeItem(storageKey); // Si corrompu, on réinitialise
    }
  }, [currentUser?.username]);

  // 🔍 Gérer la recherche
  const handleSearch = async (e) => {
    setQuery(e.target.value);

    if (e.target.value.length > 1) {
      const res = await fetch(`/api/search?q=${e.target.value}`);
      const data = await res.json();
      setResults(data.users);
    } else {
      setResults([]);
    }
  };

  // 🖱️ Gérer la sélection d'un utilisateur
  const handleUserClick = (user) => {
    if (!selectedUsers.some((u) => u.username === user.username)) {
      const newUser = {
        name: user.name,
        username: user.username,
        profilePicture: user.profilePicture,
      };

      const updatedUsers = [...selectedUsers, newUser];
      setSelectedUsers(updatedUsers);

      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedUsers));
        console.log(`✅ Utilisateurs stockés pour ${currentUser.username}:`, localStorage.getItem(storageKey));
      } catch (error) {
        console.error("Erreur lors de l'enregistrement dans localStorage:", error);
      }
    }

    setQuery("");
    setResults([]);

    // ✅ Redirection immédiate vers le profil
    router.push(`/profile/${user.username}`);
  };

  // ❌ Supprimer un utilisateur de la liste
  const handleRemoveUser = (username) => {
    const updatedUsers = selectedUsers.filter((user) => user.username !== username);
    setSelectedUsers(updatedUsers);

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedUsers));
      console.log(`🗑️ Utilisateurs restants pour ${currentUser.username}:`, localStorage.getItem(storageKey));
    } catch (error) {
      console.error("Erreur lors de la suppression dans localStorage:", error);
    }
  };

  return (
    <div className={styles.searchContainer}>
      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher un profil..."
        className={styles.searchBox}
        value={query}
        onChange={handleSearch}
      />

      {/* Résultats de recherche */}
      {results.length > 0 && (
        <div className={styles.searchResults}>
          {results.map((user) => (
            <div key={user.username} className={styles.searchItem} onClick={() => handleUserClick(user)}>
              <img src={user.profilePicture} alt={user.name} className={styles.searchProfilePic} />
              <div>
                <p className={styles.searchName}>{user.name}</p>
                <p className={styles.searchUsername}>@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Liste des utilisateurs sélectionnés sous la barre de recherche */}
      {selectedUsers.length > 0 && (
        <div className={styles.selectedUsersContainer}>
          {selectedUsers.map((user) => (
            <div key={user.username} className={styles.selectedUser}>
              <img src={user.profilePicture} alt={user.name} className={styles.selectedProfilePic} />
              <div>
                <p className={styles.selectedName}>{user.name}</p>
                <p className={styles.selectedUsername}>@{user.username}</p>
              </div>
              <button className={styles.removeButton} onClick={() => handleRemoveUser(user.username)}>❌</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
