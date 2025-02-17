"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";

export default function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      const res = await fetch(`/api/messages?chatId=${chatId}`);
      const data = await res.json();
      setMessages(data);
    }
    fetchMessages();
  }, [chatId]);

  return (
    <div className="h-screen flex">
      <ChatWindow chatId={chatId} messages={messages} />
    </div>
  );
}
