"use client";

import { db } from "@/db";
import { createContext, useEffect, useRef, useState } from "react";
// ws.addEventListener("open", () => {
//   ws.send(JSON.stringify({ type: "request" }));
// });
type ChatContext = {
  isReady: boolean;
  value: any;
  send: any;
};
export const ChatContext = createContext<ChatContext>({
  isReady: false,
  value: null,
  send: () => {},
});

export const ChatContextProvider = ({ children }) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [value, setValue] = useState<any>(null);

  const ws = useRef<null | WebSocket>(null);
  console.log("context value", value);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/chat");
    socket.onopen = async () => {
      console.log(
        await db.messages.where("syncStatus").equals("created").toArray(),
      );
      socket.send(JSON.stringify({ type: "retrieve_chats" }));
      setIsReady(true);
    };
    socket.onclose = () => setIsReady(false);
    socket.onmessage = (ev: MessageEvent) => setValue(JSON.parse(ev.data));
    socket.onmessage = async (ev: MessageEvent) => {
      if (JSON.parse(ev.data)) {
        const d = JSON.parse(ev.data);
        // console.log(d);
        if (d.chatList) {
          for await (const c of d.chatList) {
            await db.chats.put({
              chatId: c.chatId,
              phoneNumber: c.phone_number,
            });
          }
          if (d.chat) {
            for await (const m of d.chat) {
              await db.messages.put({
                messageId: m.messageId,
                chatId: m.chatId,
                content: m.content,
                sender: m.authorId,
                syncStatus: "synced",
                timestamp: m.timestamp,
                createdAt: m._creationTime,
                deliveryStatus: m.deliveryStatus,
                recipient: m.metaRecipientId,
              });
            }
          }
        }

        // if (d.chat) {
        //   for await (const m of d.chat) {
        //     await db.messages.put({
        //       chatId: m.chatId,
        //       content: m.content,
        //       createdAt: new Date(m._creationTime),
        //       timestamp: m.timestamp,
        //       messageId: m.messageId,
        //       syncStatus: "synced",
        //       sender: m.authorId,
        //       deliveryStatus: m.deliveryStatus || "accepted",
        //     });
        //   }
        // }

        if (d.message) {
          await db.messages.put({
            messageId: d.message.messageId,
            chatId: d.message.chatId,
            content: d.message.content,
            sender: d.message.authorId,
            syncStatus: "synced",
            timestamp: d.message.timestamp,
            createdAt: d.message._creationTime,
            deliveryStatus: d.message.deliveryStatus,
            recipient: d.message.metaRecipientId,
          });
        }

        if (d.meta_response) {
          if (d.chatId && d.message) {
            console.log(d);
            await db.messages.update(d.message.messageId, {
              syncStatus: "synced",
            });
            await db.chats.update(d.chatId, {
              lastMessageAt: new Date(),
            });
          }
          if (!d.meta_response?.messages[0].message_status) {
            await db.messages.update(d.message.messageId, {
              deliveryStatus: "unavailable",
            });
          } else {
            await db.messages.update(d.message.messageId, {
              deliveryStatus: d.meta_response?.messages[0].message_status,
            });
          }
        }
      }
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const providerValue = {
    isReady,
    value,
    send: ws.current?.send.bind(ws.current),
  };

  // db.messages.put(value);

  return (
    <ChatContext.Provider value={providerValue}>
      {children}
    </ChatContext.Provider>
  );
};
