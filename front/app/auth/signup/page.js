"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../public/logo.png";
import styles from "../../page.module.css";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // ✅ Pour afficher le message de succès
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, email, birthdate, password }),
    });
  
    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
      return;
    }

    setSuccess(true); // ✅ Affiche le message de succès
  };

  return (
    <div className={styles.signupPage}>
      <Image src={logo} alt="MiaouX Logo" width={150} height={150} className={styles.signupLogo} />
      <h1 className={styles.signupTitle}>Inscrivez-vous sur MiaouX</h1>

      {error && <p className={styles.error}>{error}</p>}
      {success && (
        <div className={styles.success}>
          ✅ Inscription réussie ! <br />
          <button onClick={() => router.push("/auth/login")} className={styles.loginButton}>
            🔑 Se connecter
          </button>
        </div>
      )}

      {!success && (
        <form className={styles.signupForm} onSubmit={handleSubmit}>
          <input type="text" placeholder="Nom et prénom" className={styles.signupInput} value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="text" placeholder="Identifiant (username)" className={styles.signupInput} value={username} onChange={(e) => setUsername(e.target.value)} required /> 
          <input type="email" placeholder="Email" className={styles.signupInput} value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="date" className={styles.signupInput} value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" className={styles.signupInput} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className={styles.signupButton}>Inscription</button>
        </form>
      )}
    </div>
  );
}
