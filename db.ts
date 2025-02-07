// db.js
import Dexie, { type EntityTable } from "dexie";

interface Message {
  chatId: string;
  messageId: string;
  content: {};
  timestamp: number;
  sender: string;
  recipient: string;
}

export const db = new Dexie("newscastDb") as Dexie & {
  messages: EntityTable<Message, "messageId">;
};
db.version(1).stores({
  messages: "chatId, messageId, recipient", // Primary key and indexed props
});

export type { Message };
