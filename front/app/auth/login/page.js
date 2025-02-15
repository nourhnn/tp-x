"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../public/logo.png";
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
    console.log("🔍 Réponse API Login :", data);

    if (!res.ok || !data.token) {
      setError(data.message || "Erreur inconnue");
      return;
    }

    localStorage.setItem("token", data.token);
    sessionStorage.setItem("tempToken", data.token); // 🔥 Stockage temporaire

    console.log("✅ Token stocké :", localStorage.getItem("token"));

    router.push("/profile");
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
    </div>
  );
}
