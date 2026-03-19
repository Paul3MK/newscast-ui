import clsx from "clsx";
import { ChatContext } from "./chat-context";
import { useContext } from "react";
import { db } from "@/db";

export function ChatBubble({ content, sender, time, status, messageId }) {
  const { send } = useContext(ChatContext);

  return (
    <div
      className={clsx(
        "bg-green-200 py-2 px-4 my-2 rounded-sm self-start grid gap-1 grid-cols-none max-w-[60%]",
        {
          "bg-green-950 text-white self-end": sender === "7283332958067363841",
          "cursor-pointer bg-teal-700": status == "created",
        },
      )}
      onClick={
        status == "created"
          ? async () => {
              const storedMessage = await db.messages.get(messageId);
              if (storedMessage) {
                return send(
                  JSON.stringify({
                    message_id: messageId,
                    message_timestamp: Date.now(),
                    message_body: content,
                    message_chat: storedMessage.chatId,
                    message_sender: "7283332958067363841",
                    message_recipient: storedMessage.recipient,
                  }),
                );
              }
            }
          : () => {}
      }
    >
      <span>{content}</span>
      <span className="text-xs font-medium justify-self-end">
        {new Date(Number(time)).toLocaleTimeString().slice(0, 5)}
        {"-"}
        {status}
      </span>
      {/* <span>{time}</span> */}
    </div>
  );
}
