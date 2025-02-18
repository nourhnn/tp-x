"use client";  // ✅ Ajout pour permettre l'utilisation de Context

import { SessionProvider } from "next-auth/react";
import SessionTracker from "./components/SessionTracker"; // Assure-toi que ce fichier existe
import "./globals.css"; // ✅ Import du CSS global


export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="global-body">
        <SessionProvider>
          <SessionTracker /> {/* Assure-toi qu'il est bien un Client Component */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
