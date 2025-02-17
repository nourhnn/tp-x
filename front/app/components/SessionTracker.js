"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function SessionTracker() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const users = JSON.parse(localStorage.getItem("savedSessions")) || [];
      
      // ✅ Empêcher les doublons
      if (!users.some(u => u.id === session.user.id)) {
        users.push(session.user);
        localStorage.setItem("savedSessions", JSON.stringify(users));
      }
    }
  }, [session]);

  return null;
}
