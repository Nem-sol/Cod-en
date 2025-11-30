"use client";
import { io , Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { socketUrl } from "../utils/apiTools";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

interface SocketSet {
  ready: boolean,
  socket: Socket | null,
  setRetry: Dispatch<SetStateAction<boolean>>
}
const SocketContext = createContext<SocketSet | undefined>( undefined );

export const SocketProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [ ready, setReady] = useState(false);
  const [ retry, setRetry] = useState(false);
  const [ socket, setSocket] = useState<Socket | null>(null);
  const { data: session , status } = useSession()

  useEffect(() => {
    if ( status !== 'authenticated' || !session?.user?.id ) return;

    const connectSocket = async () => {
      if ( socket?.connected ) return
      try {
        const s = io( socketUrl , {
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
    return () => {
      if (socket) socket.disconnect()
    };
  }, [ status , retry , session ]);

  return (
    <SocketContext.Provider value={{ socket, ready , setRetry }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  
  if (!context) throw new Error('useEmail must be used within an EmailProvider');
  
  return context;
}
