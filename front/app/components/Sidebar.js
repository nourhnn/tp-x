"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "@/app/page.module.css";
import logo from "@/app/logo.png";

export default function Sidebar({ onNewTweet }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tweetText, setTweetText] = useState("");
  const [image, setImage] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handlePostTweet = () => {
    if (tweetText.trim() === "") return;
    
    const newTweet = { text: tweetText, image, id: Date.now() };
    onNewTweet(newTweet);
    
    setIsModalOpen(false);
    setTweetText("");
    setImage(null);
  };

  return (
    <div className={styles.sidebar}>
        <img src="@/app/logo.png" alt="MiaouX Logo" className={styles.logo} />
      <nav className={styles.navLinks}>
        <Link href="/">🏠 Home</Link>
        <Link href="/messages">📩 Messages</Link>
        <Link href="/profile">👤 Profile</Link>
      </nav>
      
      <button className={styles.postButton} onClick={() => setIsModalOpen(true)}>Poster un Miaou</button>
      <button className={styles.logoutButton} onClick={handleLogout}>Déconnexion</button>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Poster un Miaou</h2>
            <textarea
              className={styles.tweetInput}
              placeholder="Miaou Miaou ?"
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {image && <img src={image} alt="Aperçu" className={styles.imagePreview} />}
            <button className={styles.postButton} onClick={handlePostTweet}>Poster</button>
            <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
