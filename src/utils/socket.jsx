import { io } from "socket.io-client";

let socket = null;

export function getSocket() {
  if (!socket) {
    const baseURL = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    socket = io( baseURL , {
      autoConnect: true,
      reconnection: true, 
      path: "/api/socket",
      reconnectionDelay: 2000,
      reconnectionAttempts: 10,
      transports: ["websocket"],
    });

    socket.on("connect_error", (err) => {
      console.warn("Socket connection failed:", err.message);
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log(`Trying to reconnect... ${attempt}`);
    });

    socket.on("Reconnect_failed", () => {
      console.error("Failed to reconnect to WebSocket server");
    });
  }
  return socket;
}
