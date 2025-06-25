process.env.DEBUG = "socket.io-client:*";
const http = require("http");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const socketIo = require("socket.io");
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://progect-joke-default-rtdb.firebaseio.com",
});

const app = express();
app.use(cors());
app.use(express.json());

// Simple in-memory users list for local testing
const users = [{ id: 1, username: "test", password: "password" }];
const JWT_SECRET = "dev-secret";

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "protected", user: req.user });
});

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

function handleNewMessage(message) {
  return {
    fromUserId: message.fromUserId,
    toUserId: message.toUserId,
    text: message.text,
    timestamp: message.timestamp,
    clientId: message.clientId,
    partnerId: message.partnerId,
  };
}

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("register", (userId) => {
    if (!socket.userId) {
      socket.userId = userId;
      console.log(`User registered: ${userId}, socket ID: ${socket.id}`);
    }
  });

  socket.on("join_user", (userId) => {
    socket.join(userId);
    console.log(`User joined: ${userId}, socket ID: ${socket.id}`);
  });

  socket.on("send_message", async (message) => {
    const { toUserId, text, fromUserId, clientId, partnerId } = message;
    const timestamp = Date.now();

    const newMessage = handleNewMessage({
      fromUserId,
      toUserId,
      text,
      timestamp,
      clientId,
      partnerId,
    });

    const isRecipientInRoom = io.sockets.adapter.rooms.has(toUserId);

    if (isRecipientInRoom) {
      socket.to(toUserId).emit("receive_message", newMessage);
    } else {
      console.log("No clients in room:", toUserId);
    }

    io.emit("new_message", newMessage);
  });

  socket.on("leave_user", (userId) => {
    socket.leave(userId);
    console.log(`User left userId: ${userId}, socket ID: ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

server.listen(4000, "0.0.0.0", () => console.log("Server listening on port 4000"));
