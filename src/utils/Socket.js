// socket.js
import { io } from "socket.io-client";

// Create a singleton socket instance that's exported once
let socket;;

if (!socket) {
    console.log("Creating new socket instance");
    socket = io(process.env.REACT_APP_SOCKET_URL, {
      transports: ["websocket"],
      upgrade: false, // Prevent transport upgrades
      forceNew: false,
      multiplex: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });
    

  // Log connection events for debugging
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    // Don't reconnect if the disconnection was intentional
    if (reason === "io client disconnect") {
      console.log("Socket manually disconnected, not reconnecting");
    }
  });

  socket.on("connect_error", (error) => {
    console.log("Socket connection error:", error);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`Socket reconnected after ${attemptNumber} attempts`);
  });

  socket.on("reconnect_error", (error) => {
    console.log("Socket reconnection error:", error);
  });

  socket.on("reconnect_failed", () => {
    console.log("Socket failed to reconnect after max attempts");
  });
}

export default socket;