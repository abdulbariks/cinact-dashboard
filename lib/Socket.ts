import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const getSocketUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const baseUrl = configuredUrl || apiUrl;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_SOCKET_URL or NEXT_PUBLIC_API_ENDPOINT is required");
  }

  return baseUrl.endsWith("/ws") ? baseUrl : `${baseUrl.replace(/\/$/, "")}/ws`;
};

export const connectSocket = (token: string): Socket => {
  // console.log("token=======",token);
    
  if (!socket) {
    socket = io(getSocketUrl(), {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });
  }

  //  If exists but disconnected → reconnect
  if (socket && !socket.connected) {
    socket.auth = { token }; // update token if needed
    socket.connect();
  }

  return socket;
};

export const getSocket = () => socket;
