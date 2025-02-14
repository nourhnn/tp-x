"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.png";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    const bgAudio = new Audio("/background-music.mp3"); // Mets ton fichier ici
    bgAudio.loop = true; // Son en boucle
    bgAudio.volume = 0.0; // Démarre immédiatement avec un volume bas
    setAudio(bgAudio);

    // Jouer immédiatement avec un fade-in rapide
    bgAudio.play().then(() => {
      let volume = 0.02; // Volume de départ bas
      const fadeIn = setInterval(() => {
        if (volume < 0.00) { // Volume maximum encore plus doux
          volume += 0.000;
          bgAudio.volume = volume;
        } else {
          clearInterval(fadeIn);
        }
      }, 100); // Fade-in rapide, monte toutes les 100ms
    }).catch(() => console.log("Autoplay bloqué, nécessite une interaction"));
  }, []);

  return (
    <div className={styles.page} onClick={() => audio?.play()}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Image src={logo} alt="MiaouX Logo" width={400} height={400} className={styles.logo} />
        </div>

        <div className={styles.content}>
          <h1 className={styles.tagline}>Rejoignez MiaouX dès maintenant</h1>
          <div className={styles.authButtons}>
            <button className={styles.button} onClick={() => router.push("/auth/signup")}>
              Inscription
            </button>
            <div className={styles.separator}>
              <span>ou</span>
            </div>
            <button className={styles.button} onClick={() => router.push("/auth/login")}>
              Connexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
