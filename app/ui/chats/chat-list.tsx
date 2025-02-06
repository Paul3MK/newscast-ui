"use client";
import { getChats } from "@/app/lib/data";
import { ChatRecord } from "./chat-record";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "./chat-context";

export default function ChatList() {
  const ws = useContext(ChatContext);
  const [chats, setChats] = useState<Array<any>>([]);
  const hasPageRendered = useRef(false);
  useEffect(() => {
    if (ws.isReady) {
      console.log("websocket ready, setting chat list", ws.value);
      setChats(ws.value?.chatList);
    }
  }, [ws]);
  if (ws.isReady) {
    return (
      <div className="h-full overflow-y-scroll md:mr-8 px-2">
        {chats?.length}
        {chats?.length > 0 &&
          chats?.map((chat) => <ChatRecord chat={chat} key={chat.chatId} />)}
      </div>
    );
  }
}
