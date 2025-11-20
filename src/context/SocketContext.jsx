"use client";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [ ready, setReady] = useState(false);
  const [ retry, setRetry] = useState(false);
  const [ socket, setSocket] = useState(null);
  const { data: session , status } = useSession()

  useEffect(() => {
    if (status !== 'authenticated') return;

    const connectSocket = async () => {
      if (socket) return
      try {
        const s = io( process.env.NEXT_PUBLIC_socketURL || 'http://localhost:4000' , {
          autoConnect: true,
          reconnection: true,
          withCredentials: true,
          reconnectionDelay: 2000,
          reconnectionAttempts: 10,
          transports: ["websocket", "polling"],
          auth: { id: session.user.id }
        });

        s.on("connect_error", (err) => {
          console.warn("Socket connection failed:", err.message);
        });

        setSocket(s);

        s.on("connect", () => {
          console.log("Connected to Socket.IO");
          setReady(true);
        });
        
        s.on("disconnect", () => {
          setReady(false);
          console.warn("Disconnected from Socket.IO");
        });

        s.on("connect_error", () => setReady(false))
      } catch (err) {
        console.error("Failed to initialize socket:", err);
      }
    };

    connectSocket();
    return () => socket && socket.disconnect();
  }, [ status , retry ]);

  return (
    <SocketContext.Provider value={{ socket, ready , setRetry }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
