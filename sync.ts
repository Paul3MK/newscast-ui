import { db } from "./db";

const socket = new WebSocket("ws://127.0.0.1:8000/ws/chat");
socket.onopen = () => {
  socket.send(JSON.stringify({ type: "retrieve_chats" }));
};
// socket.onclose = () => setIsReady(false);
socket.onmessage = (ev: MessageEvent) =>
  console.log("INCOMING: ", JSON.parse(ev.data));

function sendWSMessage(data: any) {
  return socket.send(JSON.stringify(data));
}

function closeWS() {
  return socket.close();
}

export { socket, sendWSMessage, closeWS };
