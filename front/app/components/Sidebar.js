"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "@/app/page.module.css"; 

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.topSection}>
        <Link href="/">
          <Image src="/logo.png" alt="MiaouX Logo" className={styles.logoSidebar} width={50} height={50} />
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/">🏠 Home</Link>
          <Link href="/messages">📩 Messages</Link>
          <Link href="/profile">👤 Profile</Link>
        </nav>
      </div>

      <div className={styles.bottomSection}>
        <button className={styles.postButton}>Post</button>
        <button className={styles.logoutButton} onClick={handleLogout}>Déconnexion</button>
      </div>
    </div>
  );
}
