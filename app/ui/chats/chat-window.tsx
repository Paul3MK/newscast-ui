"use client";

import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ChatBubble } from "./chat-bubble";
import { isArray } from "util";
import { ChatContext } from "./chat-context";

export default function ChatWindow({ chatId }: { chatId: string }) {
  const { isReady, send, value } = useContext(ChatContext);
  const [messages, setMessages] = useState<[]>([]);
  const hasPageBeenRendered = useRef(false);

  const windowRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      //   console.log("use effect fired");
      if (hasPageBeenRendered.current) {
        //     console.log("page render check passed");
        if (isReady) {
          send(JSON.stringify({ type: "request", chatId: chatId }));
        }
        // console.log(messages);
      }
      hasPageBeenRendered.current = true;
      // console.log("use effect done");
    }
  }, [isReady]);

  useEffect(() => {
    const window: HTMLElement = windowRef.current!;
    window.scrollTo({
      behavior: "smooth",
      top: window.scrollHeight,
    });
  }, [value]);

  return (
    <div
      className="w-full bg-slate-200 flex px-4 flex-col flex-grow h-full overflow-y-auto"
      ref={windowRef}
    >
      {chatId}
      {value?.chat?.map((message) => (
        <ChatBubble
          key={message.messageId}
          content={message.content}
          sender={message.authorId}
          time={Number(message.timestamp)}
        />
      ))}
    </div>
  );
}
