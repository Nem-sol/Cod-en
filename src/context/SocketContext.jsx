"use client";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useUserContext } from "./UserProvider";
import { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { date: session } = useSession()
  const [ ready, setReady] = useState(false);
  const [ socket, setSocket] = useState(null);
  const { userDetails: user } = useUserContext();

  useEffect(() => {
    if (!user) return;

    const connectSocket = async () => {
      try {
        const s = io( process.env.socketURL || 'http://localhost:4000' , {
          autoConnect: true,
          reconnection: true,
          withCredentials: true,
          reconnectionDelay: 2000,
          reconnectionAttempts: 10,
          transports: ["websocket"],
          auth: { token: session?.accessToken }
        });

        s.on("connect_error", (err) => {
          console.warn("Socket connection failed:", err.message);
        });

        setSocket(s);

        socket.on("connect", () => {
          console.log("Connected to Socket.IO:", socket.id);
          setReady(true);
        });

        socket.on("disconnect", () => {
          setReady(false);
          console.warn("Disconnected from Socket.IO");

         user && setTimeout(() => {
            console.log("Reconnecting socket...");
            connectSocket();
          }, 5000);
        });

        socket.on("connect_error", () => setReady(false))
      } catch (err) {
        console.error("Failed to initialize socket:", err);
      }
    };

    connectSocket();
    return () => socket && socket.disconnect();
  }, [ session ]);

  return (
    <SocketContext.Provider value={{ socket, ready }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
