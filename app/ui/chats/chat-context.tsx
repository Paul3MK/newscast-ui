"use client";

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
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "retrieve_chats" }));
      setIsReady(true);
    };
    socket.onclose = () => setIsReady(false);
    socket.onmessage = (ev: MessageEvent) => setValue(JSON.parse(ev.data));

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

  return (
    <ChatContext.Provider value={providerValue}>
      {children}
    </ChatContext.Provider>
  );
};
