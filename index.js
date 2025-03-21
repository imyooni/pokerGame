const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let rooms = {}; // Store active lobbies

io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);

    socket.on("createRoom", (roomCode) => {
        if (!rooms[roomCode]) {
            rooms[roomCode] = { players: [] };
        }

        if (rooms[roomCode].players.length < 2) {
            rooms[roomCode].players.push(socket.id);
            socket.join(roomCode);
            console.log(`Player ${socket.id} joined room ${roomCode}`);

            io.to(roomCode).emit("roomUpdate", rooms[roomCode].players);

            if (rooms[roomCode].players.length === 2) {
                io.to(roomCode).emit("gameStart", "Game is starting!");
            }
        } else {
            socket.emit("roomFull", "This room is already full!");
        }
    });

    socket.on("playerMove", (data) => {
        io.to(data.roomCode).emit("updateGame", data.position);
    });

    socket.on("disconnect", () => {
        for (const roomCode in rooms) {
            rooms[roomCode].players = rooms[roomCode].players.filter(id => id !== socket.id);
            if (rooms[roomCode].players.length === 0) {
                delete rooms[roomCode]; // Remove empty rooms
            } else {
                io.to(roomCode).emit("roomUpdate", rooms[roomCode].players);
            }
        }
        console.log(`Player disconnected: ${socket.id}`);
    });
});

server.listen(4000, () => console.log("Server running on port 4000"));
