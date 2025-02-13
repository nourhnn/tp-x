"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../page.module.css";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";

const res = await fetch("/api/profile", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

console.log("Réponse API Profil :", res.status);


export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [banner, setBanner] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const router = useRouter();

  const [bio, setBio] = useState("");

useEffect(() => {
  let token = localStorage.getItem("token");

  if (!token) {
    token = sessionStorage.getItem("tempToken");
    if (token) {
      localStorage.setItem("token", token);
    }
  }

  if (!token) {
    console.log("⚠️ Aucun token trouvé, redirection vers login.");
    router.push("/auth/login");
    return;
  }

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/profile/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("❌ Erreur API Profil :", res.status);
        router.push("/");
        return;
      }

      const data = await res.json();
      setUser(data.user);
      setName(data.user.name || "");
      setUsername(data.user.username || "");
      setProfilePicture(data.user.profilePicture || "");
      setBanner(data.user.banner || "");
      setBio(data.user.bio || ""); // 🔥 Ajout de la bio
    } catch (error) {
      console.error("❌ Erreur serveur :", error);
      router.push("/");
    }
  };

  fetchUserData();
}, [username, router]);


  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result); // Stocker l’image en base64
    };
    reader.readAsDataURL(file);
  };
  
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setBanner(reader.result); // Stocker l’image en base64
    };
    reader.readAsDataURL(file);
  };
  
  
  



  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
  
    const body = JSON.stringify({
      profilePicture,
      banner,
      name,
      username,
      bio, // 🔥 Ajout de la bio
    });
  
    console.log("📤 Données envoyées à /api/profile/update :", body); // 🔥 Vérifier ce qui est envoyé
  
    const res = await fetch("/api/profile/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: body,
    });
  
    const data = await res.json();
    console.log("📌 Réponse de l'API update :", data); // 🔥 Voir si l'API répond bien
  
    if (res.ok) {
      setUser(data.user);
      setIsEditing(false);
    } else {
      console.error("❌ Erreur lors de la mise à jour :", data.message);
    }
  };
  
  
  
  
  
  

  return (
    <div className={styles.profilePage}>
      <Sidebar />

      <div className={styles.profileContent}>
        {/* Bannière */}
        <div className={styles.bannerContainer}>
        {banner ? (
          <img src={banner} alt="Bannière" className={styles.bannerImage} />
        ) : (
          <div className={styles.defaultBanner}></div>
        )}
      </div>


        {/* Photo de profil */}
        <div className={styles.profilePictureContainer}>
          {profilePicture ? (
            <Image src={profilePicture} alt="Photo de profil" width={120} height={120} className={styles.profilePicture} />
          ) : (
            <div className={styles.defaultProfile}></div>
          )}
        </div>

        {/* Infos utilisateur + bouton "Éditer" */}
        <div className={styles.profileHeader}>
          <div>
            <h1 className={styles.profileName}>{name}</h1>
            <p className={styles.profileUsername}>@{username}</p>
            <p>{bio || "Ajoutez une bio..."}</p> {/* 🔥 Affichage de la bio */}
            <p className={styles.profileJoined}>
              📅 Joined {user?.createdAt ? new Date(user.createdAt).toLocaleString("en-US", { month: "long", year: "numeric" }) : "Date inconnue"}
            </p>
            <div className={styles.profileStats}>
              <span><strong>{following}</strong> Following</span>
              <span><strong>{followers}</strong> Followers</span>
            </div>
          </div>
          <button className={styles.editButton} onClick={() => setIsEditing(true)}>
            Éditer le profil
          </button>
        </div>
      </div>

      <SearchBar />

      {/* ✅ Modale pour modifier le profil */}
      {isEditing && (
        <div className={styles.modal} onClick={() => setIsEditing(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Modifier le profil</h2>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" />
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Identifiant" />
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio"></textarea> {/* 🔥 Champ de bio */}

            <label>Photo de profil</label>
            <input type="file" accept="image/*" onChange={handleProfilePictureChange} />

            <label>Bannière</label>
            <input type="file" accept="image/*" onChange={handleBannerChange} />

            <button onClick={handleUpdateProfile} className={styles.saveButton}>
              Enregistrer
            </button>

            <button onClick={() => setIsEditing(false)}>Annuler</button>
          </div>
        </div>
      )}


    </div>
  );
}