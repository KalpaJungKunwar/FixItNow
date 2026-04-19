import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import { useAuth } from "../context/AuthContext";

const SocketContext = createContext(null);


export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const SOCKET_URL =
      import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
    socketRef.current = io(SOCKET_URL, { transports: ["websocket"] });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
