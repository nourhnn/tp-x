"use client";

import Image from "next/image";
import logo from "../../logo.png"; 
import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.loginPage}>
      <Image src={logo} alt="MiaouX Logo" width={150} height={150} className={styles.loginLogo} />

      <h1 className={styles.loginTitle}>Connectez-vous à MiaouX</h1>

      <form className={styles.loginForm}>
        <input type="email" placeholder="Email" className={styles.loginInput} required />
        <input type="password" placeholder="Mot de passe" className={styles.loginInput} required />
        <button type="submit" className={styles.loginButton}>Connexion</button>
      </form>
    </div>
  );
}
