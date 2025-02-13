"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/app/page.module.css"; 
import logo from "@/app/logo.png"; 

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className={styles.sidebar}>
      <Link href="/">
        <img src={logo} alt="MiaouX Logo" className={styles.logo} />
      </Link>
      <nav className={styles.navLinks}>
        <Link href="/">🏠 Home</Link>
        <Link href="/messages">📩 Messages</Link>
        <Link href="/profile">👤 Profile</Link>
      </nav>
      
      <button className={styles.postButton}>Post</button>
      <button className={styles.logoutButton} onClick={handleLogout}>Déconnexion</button>
    </div>
  );
}
