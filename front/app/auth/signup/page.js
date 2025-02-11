"use client"; // Indique que ce composant est un Client Component

import Image from "next/image";
import logo from "../../logo.png"; // Vérifie bien le chemin du logo
import styles from "./signup.module.css";

export default function SignupPage() {
  return (
    <div className={styles.signupPage}>
      {/* Logo en haut */}
      <Image src={logo} alt="MiaouX Logo" width={150} height={150} className={styles.signupLogo} />

      {/* Titre */}
      <h1 className={styles.signupTitle}>Inscrivez-vous sur MiaouX</h1>

      {/* Formulaire */}
      <form className={styles.signupForm}>
        <input type="text" placeholder="Nom" className={styles.signupInput} required />
        <input type="email" placeholder="Email" className={styles.signupInput} required />
        <input type="date" placeholder="Date de naissance" className={styles.signupInput} required />
        <input type="password" placeholder="Mot de passe" className={styles.signupInput} required />
        <button type="submit" className={styles.signupButton}>Inscription</button>
      </form>
    </div>
  );
}
