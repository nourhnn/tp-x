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

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        router.push("/auth/login");
        return;
      }

      const data = await res.json();
      setUser(data.user);
      setName(data.user.name || "");
      setUsername(data.user.username || "");
      setProfilePicture(data.user.profilePicture || "");
      setBanner(data.user.banner || "");
      setFollowers(data.user.followers || 0);
      setFollowing(data.user.following || 0);
    };

    fetchUserData();
  }, [router]);

  // ✅ Gestion du changement de photo de profil
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setProfilePicture(reader.result);
      await handleUpdateProfile(); // 🔥 Envoie directement l’image à l’API
    };
  };
  

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      setBanner(reader.result);
      await handleUpdateProfile(); // 🔥 Envoie directement l’image à l’API
    };
  };
  



  const handleUpdateProfile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;

      const token = localStorage.getItem("token");
      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ profilePicture: base64Image }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user); // Met à jour l'affichage avec la nouvelle image
      }
    };
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
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom et prénom" />
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Identifiant" />
            
            <label>Photo de profil</label>
            <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
            
            <label>Bannière</label>
            <input type="file" accept="image/*" onChange={handleBannerChange} />
            
            <button onClick={() => setIsEditing(false)}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}
