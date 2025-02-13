"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../logo.png";
import styles from "../../page.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Erreur inconnue");
      return;
    }
  
    localStorage.setItem("token", data.token);
  
    console.log("✅ Connexion réussie, redirection vers /profile");
    router.push("/profile");  // 🔥 Assure-toi que c'est bien une string
  };
  
  

  return (
    <div className={styles.loginPage}>
      <Image src={logo} alt="MiaouX Logo" width={150} height={150} className={styles.loginLogo} />
      <h1 className={styles.loginTitle}>Connectez-vous à MiaouX</h1>

      {error && <p className={styles.error}>{error}</p>}

      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" className={styles.loginInput} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" className={styles.loginInput} value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className={styles.loginButton}>Connexion</button>
      </form>

      <div className={styles.separator}>
        <span>ou</span>
      </div>

      <button className={styles.backButton} onClick={() => router.push("/")}>Revenir à la page d'accueil</button>
    </div>
  );
}
