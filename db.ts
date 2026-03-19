// db.js
import Dexie, { type EntityTable } from "dexie";

interface Message {
  chatId: string;
  messageId: string;
  content: {};
  timestamp: number;
  sender: string;
  recipient?: string;
  role?: "user" | "assistant";
  createdAt: Date;
  syncStatus: "created" | "synced";
  deliveryStatus?:
    | "sent"
    | "delivered"
    | "read"
    | "failed"
    | "unavailable"
    | "accepted";
}

interface Chat {
  chatId: string;
  lastMessageAt?: Date;
  phoneNumber: string;
}

export const db = new Dexie("newscastDb") as Dexie & {
  messages: EntityTable<Message, "messageId">;
  chats: EntityTable<Chat, "chatId">;
};
db.version(1).stores({
  messages: "messageId, chatId, recipient, syncStatus", // Primary key and indexed props
  chats: "chatId, phoneNumber",
});

export type { Message };
