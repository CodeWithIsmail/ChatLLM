"use client";

import useAuthStore from "@/app/hooks/useAuthStore";
import useChatStore from "@/app/hooks/useChatStore";
import { ChatLayout } from "@/components/chat/chat-layout";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

type ChatSession = {
  messages: any[];
  createdAt: string;
  title?: string;
};

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [isLoading, setIsLoading] = useState(false);
  const [chatNotFound, setChatNotFound] = useState(false);
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);

  const getChatById = useChatStore((state) => state.getChatById);
  const addChat = useChatStore((state) => state.addChat);
  const { token } = useAuthStore();

  const chat = getChatById(id);

  useEffect(() => {
    setChatNotFound(false);
    setActiveChat(null);

    if (!token) {
      return;
    }

    if (chat) {
      setActiveChat(chat);
      return;
    }

    const fetchChatFromAPI = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/chats/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setChatNotFound(true);
            return;
          }
          throw new Error("Failed to fetch chat");
        }

        const { chat: fetchedChat } = await response.json();
        const normalizedChat = {
          messages: fetchedChat.messages || [],
          createdAt: fetchedChat.createdAt,
          title: fetchedChat.title,
        };

        addChat(fetchedChat.id, normalizedChat);
        setActiveChat(normalizedChat);
      } catch (error) {
        console.error("Error fetching chat:", error);
        setChatNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatFromAPI();
  }, [id, chat, token, addChat]);

  if (chatNotFound) {
    return notFound();
  }

  const displayedChat = token ? (activeChat ?? chat) : chat;

  if (isLoading || !displayedChat) {
    return (
      <main className="flex h-[calc(100dvh)] flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading chat...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center  ">
      <ChatLayout
        key={id}
        id={id}
        initialMessages={displayedChat.messages}
        navCollapsedSize={10}
        defaultLayout={[30, 160]}
      />
    </main>
  );
}
