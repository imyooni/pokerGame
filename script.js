const socket = io("wss://https://puzzlebattleserver.onrender.com"); // Replace with your Render backend URL


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

let player = { x: 50, y: 50 };
let opponent = { x: 400, y: 400 };
let roomCode = "";

function joinRoom() {
    roomCode = document.getElementById("roomCode").value;
    if (roomCode) {
        socket.emit("createRoom", roomCode);
    }
}

socket.on("roomUpdate", (players) => {
    document.getElementById("status").innerText = `Players in room: ${players.length}/2`;
});

socket.on("roomFull", (message) => {
    alert(message);
});

socket.on("gameStart", () => {
    document.getElementById("status").innerText = "Game Started!";
});

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") player.y -= 10;
    if (event.key === "ArrowDown") player.y += 10;
    if (event.key === "ArrowLeft") player.x -= 10;
    if (event.key === "ArrowRight") player.x += 10;

    socket.emit("playerMove", { roomCode, position: player });
});

socket.on("updateGame", (data) => {
    opponent = data;
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, 20, 20); // Player
    ctx.fillStyle = "red";
    ctx.fillRect(opponent.x, opponent.y, 20, 20); // Opponent
    requestAnimationFrame(draw);
}

draw();
