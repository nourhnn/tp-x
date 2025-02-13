"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import styles from "@/app/page.module.css";
import Sidebar from "@/app/components/Sidebar";
import SearchBar from "@/app/components/SearchBar";

export default function UserProfile() {
  const { username } = useParams(); // Récupère l'username depuis l'URL
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Récupérer les infos du profil visité
    const fetchUser = async () => {
      const res = await fetch(`/api/profile/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        router.push("/");
        return;
      }

      const data = await res.json();
      setUser(data.user);
    };

    fetchUser();
  }, [username, router]);

  if (!user) return <p>Chargement...</p>;

  return (
    <div className={styles.profilePage}>
      <Sidebar /> {/* ✅ Sidebar toujours présente */}

      <div className={styles.profileContent}>
        {/* Bannière */}
        <div className={styles.bannerContainer}>
          {user.banner ? (
            <Image src={user.banner} alt="Bannière" layout="fill" objectFit="cover" className={styles.bannerImage} />
          ) : (
            <div className={styles.defaultBanner}></div>
          )}
        </div>

        {/* Photo de profil */}
        <div className={styles.profilePictureContainer}>
          {user.profilePicture ? (
            <Image src={user.profilePicture} alt="Photo de profil" width={120} height={120} className={styles.profilePicture} />
          ) : (
            <div className={styles.defaultProfile}></div>
          )}
        </div>

        {/* Infos utilisateur */}
        <div className={styles.profileHeader}>
          <div>
            <h1 className={styles.profileName}>{user.name}</h1>
            <p className={styles.profileUsername}>@{user.username}</p>
            <p className={styles.profileBio}>{user.bio}</p> {/* 🔥 Affichage de la bio */}
            <p className={styles.profileJoined}>
              📅 Joined {user?.createdAt ? new Date(user.createdAt).toLocaleString("en-US", { month: "long", year: "numeric" }) : "Date inconnue"}
            </p>
            <div className={styles.profileStats}>
              <span><strong>{user.following}</strong> Following</span>
              <span><strong>{user.followers}</strong> Followers</span>
            </div>
          </div>
          {/* ❌ Pas de bouton "Éditer" ici */}
        </div>
      </div>

      <SearchBar /> {/* ✅ SearchBar toujours présente */}
    </div>
  );
}
