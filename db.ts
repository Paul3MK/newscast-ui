// db.js
import Dexie, { type EntityTable } from "dexie";

interface Chat {
  chat;
}

export const db = new Dexie("newscastDb");
db.version(1).stores({
  friends: "++id, name, age", // Primary key and indexed props
});
