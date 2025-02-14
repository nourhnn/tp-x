"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.png";
import styles from "../../page.module.css";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState(""); // ✅ Ajout de l'identifiant
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, email, birthdate, password }), // ✅ On envoie username
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    router.push("/auth/login");
  };

  return (
    <div className={styles.signupPage}>
      {/* Logo en haut */}
      <Image src={logo} alt="MiaouX Logo" width={150} height={150} className={styles.signupLogo} />

      {/* Titre */}
      <h1 className={styles.signupTitle}>Inscrivez-vous sur MiaouX</h1>

      {error && <p className={styles.error}>{error}</p>}

      {/* Formulaire */}
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <input type="text" placeholder="Nom et prénom" className={styles.signupInput} value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Identifiant (username)" className={styles.signupInput} value={username} onChange={(e) => setUsername(e.target.value)} required /> {/* ✅ Ajout du champ */}
        <input type="email" placeholder="Email" className={styles.signupInput} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="date" className={styles.signupInput} value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" className={styles.signupInput} value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        {/* Bouton Inscription */}
        <button type="submit" className={styles.signupButton}>Inscription</button>

        {/* Séparateur "ou" */}
        <div className={styles.separator}>
          <span>ou</span>
        </div>

        {/* Bouton "Revenir à l'accueil" */}
        <button type="button" className={styles.homeButton} onClick={() => router.push("/")}>Revenir à la page d'accueil</button>
      </form>
    </div>
  );
}
