"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; 
import Image from "next/image";
import styles from "../../page.module.css";
import Sidebar from "../../components/Sidebar";
import SearchBar from "../../components/SearchBar";

export default function UserProfile() {
  const { id } = useParams(); // ✅ Récupère bien l'ID depuis l'URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  console.log("🔎 ID extrait de l'URL :", id);

  useEffect(() => {
    if (!id) return; // ✅ Empêche l'appel si `id` est absent

    const token = localStorage.getItem("token");
    // if (!token) {
    //   console.warn("⚠️ Aucun token trouvé, redirection vers login.");
    //   router.push("/auth/login");
    //   return;
    // }

    const fetchUser = async () => {
      try {
        console.log(`📡 Chargement du profil ID: ${id}`);
        const res = await fetch(`/api/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("❌ Erreur API Profil :", res.status);
          setUser(null);
          return;
        }

        const data = await res.json();
        console.log("✅ Données utilisateur reçues :", data);
        setUser(data.user);
      } catch (error) {
        console.error("❌ Erreur serveur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, router]);

  if (loading) return <p>Chargement...</p>;
  if (!user) return <p>Utilisateur introuvable</p>;

  return (
    <div className={styles.profilePage}>
      <Sidebar /> 

      <div className={styles.profileContent}>
        {/* Bannière */}
        <div className={styles.bannerContainer}>
          {user.banner ? (
            <Image 
              src={user.banner} 
              alt="Bannière" 
              width={800} 
              height={200} 
              className={styles.bannerImage} 
            />
          ) : (
            <div className={styles.defaultBanner}></div>
          )}
        </div>

        {/* Photo de profil */}
        <div className={styles.profilePictureContainer}>
          {user.profilePicture ? (
            <Image 
              src={user.profilePicture} 
              alt="Photo de profil" 
              width={120} 
              height={120} 
              className={styles.profilePicture} 
            />
          ) : (
            <div className={styles.defaultProfile}></div>
          )}
        </div>

        {/* Infos utilisateur */}
        <div className={styles.profileHeader}>
          <div>
            <h1 className={styles.profileName}>{user.name}</h1>
            <p className={styles.profileUsername}>@{user.username}</p> {/* ✅ Correction ici */}
            <p className={styles.profileBio}>{user.bio || "Aucune bio pour l'instant."}</p> 
            <p className={styles.profileJoined}>
              📅 Joined {user?.createdAt ? new Date(user.createdAt).toLocaleString("fr-FR", { month: "long", year: "numeric" }) : "Date inconnue"}
            </p>
            <div className={styles.profileStats}>
              <span><strong>{user.following}</strong> Following</span>
              <span><strong>{user.followers}</strong> Followers</span>
            </div>
          </div>
        </div>
      </div>

      <SearchBar /> 
    </div>
  );
}
