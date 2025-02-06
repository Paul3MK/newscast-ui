import { ReactNode, Suspense, useContext } from "react";
import { getMessagesByChatId } from "@/app/lib/data";
import clsx from "clsx";
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import ChatInput from "@/app/ui/chats/chat-input";
import { ChatBubble } from "@/app/ui/chats/chat-bubble";
import ChatWindow from "@/app/ui/chats/chat-window";
import { ChatContext, ChatContextProvider } from "@/app/ui/chats/chat-context";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ chatId: string }>;
}) {
  const chatId = (await searchParams).chatId || "";

  console.log("current chat id:", chatId);
  // const messages = await getMessagesByChatId(chatId);
  return (
    <div className="grid grid-rows-[1fr_auto] h-[94vh] relative">
      <Suspense key={chatId} fallback={<div></div>}>
        <ChatWindow chatId={chatId} />
      </Suspense>
      <ChatInput chatId={chatId} />
    </div>
  );
}
