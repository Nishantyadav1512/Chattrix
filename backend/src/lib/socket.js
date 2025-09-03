import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true, // Add this
    },
});

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    try {
        console.log("A user connected", socket.id);

        const userId = socket.handshake.query.userId;
        if (!userId) {
            console.log("No userId provided in connection");
            return;
        }

        userSocketMap[userId] = socket.id;
        console.log("User connected:", userId);
        console.log("Current online users:", Object.keys(userSocketMap));

        // Emit to all clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            console.log("User disconnected:", userId);
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    } catch (error) {
        console.error("Socket error:", error);
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

export { io, app, server }; 