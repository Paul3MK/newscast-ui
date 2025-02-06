// "use client";
import { ChatContextProvider } from "@/app/ui/chats/chat-context";
import ChatList from "@/app/ui/chats/chat-list";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  // const [chat, setChat] = useState<null | string>(null);

  return (
    <div className="h-auto max-h-full grid grid-cols-[1fr_3fr]">
      <ChatContextProvider>
        <ChatList />
        {children}
      </ChatContextProvider>
    </div>
  );
}
