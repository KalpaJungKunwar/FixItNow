import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const SOCKET_URL =
      import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    return () => socketRef.current.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
