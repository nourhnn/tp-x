"use client";
import { useState } from "react"; // ✅ Assure-toi que `useState` est bien importé

export default function MessagesSearch({ onSelectUser }) { // ✅ Vérifier que la prop est bien reçue
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
  
    const handleUserClick = (user) => {
      console.log("📩 Utilisateur sélectionné :", user);
      if (onSelectUser) {
        onSelectUser({ id: user._id, name: user.name, username: user.username });
      }
    };

    const handleSearch = async (e) => {
        setQuery(e.target.value);
      
        if (e.target.value.length > 1) {
          try {
            console.log("🔍 Recherche envoyée à :", `/api/messages/search?q=${e.target.value}`);
      
            const res = await fetch(`/api/messages/search?q=${e.target.value}`);
            const data = await res.json();
      
            console.log("✅ Réponse de l'API :", data); // 🔥 Voir ce que l'API retourne
      
            if (!res.ok) {
              throw new Error(data.message || "Erreur inconnue");
            }
      
            setResults(data.users);
            console.log("✅ Utilisateurs enregistrés dans results :", data.users); // 🔥 Vérifier si `setResults` fonctionne
          } catch (error) {
            console.error("❌ Erreur lors de la recherche :", error);
            setResults([]);
          }
        } else {
          setResults([]);
        }
      };
      
      
  
      return (
        <div>
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={query}
            onChange={handleSearch}
          />
      
          {console.log("🔎 Utilisateurs affichés :", results)} {/* 🔥 Vérifier si `results` contient des données */}
      
          <div>
            {results.length > 0 ? (
              results.map((user) => (
                <p key={user._id} onClick={() => handleUserClick(user)}>
                  {user.name} (@{user.username})
                </p>
              ))
            ) : (
              <p>Aucun utilisateur trouvé</p>
            )}
          </div>
        </div>
      );
      
      
  }
  