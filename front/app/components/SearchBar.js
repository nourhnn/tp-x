"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/page.module.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

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

  const handleUserClick = (username) => {
    console.log("Token avant redirection :", localStorage.getItem("token"));
    router.push(`/profile/${username}`);
  };
  

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Rechercher un profil..."
        className={styles.searchBox}
        value={query}
        onChange={handleSearch}
      />
      {results.length > 0 && (
        <div className={styles.searchResults}>
          {results.map((user) => (
            <div key={user.username} className={styles.searchItem} onClick={() => handleUserClick(user.username)}>
              <img src={user.profilePicture} alt={user.name} className={styles.searchProfilePic} />
              <div>
                <p className={styles.searchName}>{user.name}</p>
                <p className={styles.searchUsername}>@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
