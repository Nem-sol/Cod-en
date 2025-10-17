"use client";
import { getSocket } from "../utils/socket";
import { useUserContext } from "./UserProvider";
import { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [socket, setSocket] = useState(null);
  const { userDetails: user } = useUserContext();

  useEffect(() => {
    if (!user) return;

    const connectSocket = async () => {
      try {
        await fetch("/api/socket", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.id}`,
          },
        });

        const s = getSocket();
        setSocket(s);

        s.on("connect", () => {
          console.log("Connected to Socket.IO:", s.id);
          setReady(true);
        });

        s.on("disconnect", () => {
          setReady(false);
          console.warn("Disconnected from Socket.IO");

          // Retry after short delay if user still logged in
         user && setTimeout(() => {
            console.log("Reconnecting socket...");
            connectSocket();
          }, 5000);
        });

        s.on("connect_error", () => setReady(false))
      } catch (err) {
        console.error("Failed to initialize socket:", err);
      }
    };

    connectSocket();
    return () => socket && socket.disconnect();
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, ready }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
