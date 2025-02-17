"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../page.module.css";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]); // Liste des tweets de l'utilisateur connecté
  const [isEditing, setIsEditing] = useState(false);
  const [editingTweet, setEditingTweet] = useState(null);
  const [newTweetText, setNewTweetText] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [banner, setBanner] = useState("");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [bio, setBio] = useState("");
  const router = useRouter();

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
        const res = await fetch(`/api/profile/me`, {
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
        setBio(data.user.bio || "");

        // 🔹 Récupérer uniquement les tweets du profil connecté
        const tweetsRes = await fetch(`/api/tweets/user/${data.user._id}`);
        if (!tweetsRes.ok) throw new Error("Erreur lors de la récupération des tweets");

        const tweetsData = await tweetsRes.json();
        setTweets(tweetsData);
      } catch (error) {
        console.error("❌ Erreur serveur :", error);
        router.push("/");
      }
    };

    fetchUserData();
  }, [router]);

  const addTweet = async (newTweet) => {
    if (!user) return; // Vérification que l'utilisateur est bien chargé

    try {
      const res = await fetch("/api/tweets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTweet.text, image: newTweet.image, userId: user._id }),
      });

      if (!res.ok) throw new Error("Erreur lors de la publication");

      const savedTweet = await res.json();
      setTweets([savedTweet, ...tweets]);
    } catch (error) {
      console.error("Erreur lors de la publication :", error);
    }
  };

  const deleteTweet = async (id) => {
    try {
      const res = await fetch(`/api/tweets/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      setTweets(tweets.filter(tweet => tweet._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const startEditingTweet = (tweet) => {
    setEditingTweet(tweet);
    setNewTweetText(tweet.text);
  };

  const saveEditedTweet = async () => {
    try {
      const res = await fetch(`/api/tweets/${editingTweet._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTweetText }),
      });

      if (!res.ok) throw new Error("Erreur lors de la modification");

      setTweets(tweets.map(tweet =>
        tweet._id === editingTweet._id ? { ...tweet, text: newTweetText } : tweet
      ));

      setEditingTweet(null);
      setNewTweetText("");
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
    }
  };

  return (
    <div className={styles.profilePage}>
      <Sidebar onNewTweet={addTweet} />

      <div className={styles.profileContent}>
        <div className={styles.bannerContainer}>
          {banner ? (
            <img src={banner} alt="Bannière" className={styles.bannerImage} />
          ) : (
            <div className={styles.defaultBanner}></div>
          )}
        </div>

        <div className={styles.profilePictureContainer}>
          {profilePicture ? (
            <Image src={profilePicture} alt="Photo de profil" width={120} height={120} className={styles.profilePicture} />
          ) : (
            <div className={styles.defaultProfile}></div>
          )}
        </div>

        <div className={styles.profileHeader}>
          <div>
            <h1 className={styles.profileName}>{name}</h1>
            <p className={styles.profileUsername}>@{username}</p>
            <p>{bio || "Ajoutez une bio..."}</p>
            <p className={styles.profileJoined}>
              📅 Joined {user?.createdAt ? new Date(user.createdAt).toLocaleString("fr-FR", { month: "long", year: "numeric" }) : "?"}
            </p>
            <div className={styles.profileStats}>
              <span><strong>{following}</strong> Following</span>
              <span><strong>{followers}</strong> Followers</span>
            </div>
          </div>
        </div>

        <div className={styles.tweetsContainer}>
          {tweets.length === 0 ? (
            <p>Aucun Miaou pour l'instant</p>
          ) : (
            tweets.map((tweet) => (
              <div key={tweet._id} className={styles.tweet}>
                {editingTweet && editingTweet._id === tweet._id ? (
                  <>
                    <textarea 
                      value={newTweetText} 
                      onChange={(e) => setNewTweetText(e.target.value)}
                      className={styles.tweetInput}
                    />
                    <button className={styles.saveButton} onClick={saveEditedTweet}>Enregistrer</button>
                  </>
                ) : (
                  <>
                    <p>{tweet.text}</p>
                    {tweet.image && <img src={tweet.image} alt="Tweet" className={styles.tweetImage} />}
                    <p className={styles.tweetDate}>{new Date(tweet.createdAt).toLocaleString("fr-FR")}</p>
                    <button className={styles.editButton} onClick={() => startEditingTweet(tweet)}>✏️ Modifier</button>
                    <button className={styles.deleteButton} onClick={() => deleteTweet(tweet._id)}>🗑️ Supprimer</button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <SearchBar />
    </div>
  );
}
