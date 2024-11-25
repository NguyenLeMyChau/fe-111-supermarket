import React, { createContext, useContext, useEffect } from "react";
import { connectSocket, disconnectSocket, onSocketEvent, emitSocketEvent } from "../services/socket";

// Tạo context
const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    connectSocket(); 

    return () => {
      disconnectSocket(); 
    };
  }, []);

  return (
    <SocketContext.Provider value={{ emitSocketEvent, onSocketEvent }}>
      {children}
    </SocketContext.Provider>
  );
};
