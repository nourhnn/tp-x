"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MessagesSidebar({ onSelectChat }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function fetchChats() {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setChats(data);
    }
    fetchChats();
  }, []);

  return (
    <div className="w-1/4 h-full bg-gray-200 p-4">
      <h2 className="text-lg font-bold mb-4">Discussions</h2>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="p-2 hover:bg-gray-300 cursor-pointer"
          onClick={() => onSelectChat(chat._id)}
        >
          <Link href={`/messages/${chat._id}`}>{chat.username}</Link>
        </div>
      ))}
    </div>
  );
}
