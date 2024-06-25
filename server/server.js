process.env.DEBUG = "socket.io-client:*";
const fetch = require("node-fetch");
const http = require("http");
const socketIo = require("socket.io");
var admin = require("firebase-admin");

var serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://progect-joke-default-rtdb.firebaseio.com"
});

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World\n");
});

const io = require("socket.io")(server, {
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
  socket.on("send_message", async (message, callback) => {
    console.log("send message", message);
    const { toUserId, text, fromUserId, clientId, partnerId } = message;
    const timestamp = Date.now();
    console.log(`Sending message to room: ${toUserId}`);

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
    // Emit new_message event with the newMessage data
    io.emit('new_message', newMessage);
  });

  socket.on("leave_user", (userId) => {
    console.log(`User left userId: ${userId}, socket ID: ${socket.id}`);
    socket.leave(userId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

server.listen(4000, () => console.log("Server listening on port 4000"));

function generateChatId(userId1, userId2) {
  if (userId1 < userId2) {
    return userId1 + "-" + userId2;
  } else {
    return userId2 + "-" + userId1;
  }
}





 