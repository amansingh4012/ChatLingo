import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

// Store user socket mappings
const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} mapped to socket ${socket.id}`);
    }

    // Join global chat room
    socket.on("joinGlobalChat", () => {
        socket.join("global-chat");
        console.log(`Socket ${socket.id} joined global-chat room`);
    });

    // Leave global chat room
    socket.on("leaveGlobalChat", () => {
        socket.leave("global-chat");
        console.log(`Socket ${socket.id} left global-chat room`);
    });

    // Join language-specific chat room
    socket.on("joinLanguageChat", (language) => {
        if (language) {
            const languageRoom = `${language.toLowerCase()}-chat`;
            socket.join(languageRoom);
            console.log(`Socket ${socket.id} joined ${languageRoom} room`);
        }
    });

    // Leave language-specific chat room
    socket.on("leaveLanguageChat", (language) => {
        if (language) {
            const languageRoom = `${language.toLowerCase()}-chat`;
            socket.leave(languageRoom);
            console.log(`Socket ${socket.id} left ${languageRoom} room`);
        }
    });

    // Handle typing indicators for global chat
    socket.on("typing", (data) => {
        socket.to("global-chat").emit("userTyping", {
            userId: data.userId,
            username: data.username,
            isTyping: data.isTyping
        });
    });

    // Handle typing indicators for language-specific chat
    socket.on("languageTyping", (data) => {
        if (data.language) {
            const languageRoom = `${data.language.toLowerCase()}-chat`;
            socket.to(languageRoom).emit("userLanguageTyping", {
                userId: data.userId,
                username: data.username,
                isTyping: data.isTyping,
                language: data.language
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        // Remove user from socket map
        for (const [userId, socketId] of Object.entries(userSocketMap)) {
            if (socketId === socket.id) {
                delete userSocketMap[userId];
                break;
            }
        }
    });
});

export { io, app, server };