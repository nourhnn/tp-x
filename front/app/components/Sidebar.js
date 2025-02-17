"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../../app/page.module.css"; 

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
          <Link href="/test-messages">📩 Messages</Link>
          <Link href="/profile">👤 Profile</Link>
          <Link href="/settings">⚙️ Paramètres</Link> {/* 🔥 Ajout du lien vers les paramètres */}
        </nav>
      </div>

      <div className={styles.bottomSection}>
        <button className={styles.postButton}>Post</button>
        <button onClick={() => signOut()} style={{ marginTop: "10px", padding: "5px 10px", background: "red", color: "white", border: "none", cursor: "pointer" }}>
                    🚪 Déconnexion
                  </button>
      </div>
    </div>
  );
}
