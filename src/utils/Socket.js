// socket.js
import { io } from "socket.io-client";

// Create a singleton socket instance that's exported once
let socket;;

if (!socket) {
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
  });

  socket.on("disconnect", (reason) => {
    // Don't reconnect if the disconnection was intentional
    if (reason === "io client disconnect") {
    }
  });

  socket.on("connect_error", (error) => {
  });

  socket.on("reconnect", (attemptNumber) => {
  });

  socket.on("reconnect_error", (error) => {
  });

  socket.on("reconnect_failed", () => {
  });
}

export default socket;