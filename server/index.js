const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*", // разрешить все домены
    methods: ["GET", "POST"],
  },
});

const path = require("path");
//
let socketList = {};

app.use(cors());

app.get("/ping", (req, res) => {
  res
    .send({
      success: true,
    })
    .status(200);
});

app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

// Route

// Socket
io.on("connection", (socket) => {
 // console.log(`New User connected: ${socket.id}`);

  socket.on("BE-check-user", ({ roomId, userName }) => {
    let error = false;

    const room = io.of("/").adapter.rooms.get(roomId);

    if (room) {
      const clients = Array.from(room);
      clients.forEach((client) => {
        if (socketList[client] == userName) {
          error = true;
        }
      });
    }
    socket.emit("FE-error-user-exist", { error });
  });

  socket.on("BE-join-room", ({ roomId, userName }) => {
   
    // Socket Join RoomName
    socket.join(roomId);
   // console.log(`Регистрием комнату : ${roomId}`);

    socketList[socket.id] = { userName, video: true, audio: true };
   // console.log(`добавили в сокетлист : ${JSON.stringify(socketList)}`);

    const roomID = roomId;
    const room = io.sockets.adapter.rooms.get(roomID);

    if (room) {
      const clients = Array.from(room);
     // console.log(`Clients in room ${roomId}: ${JSON.stringify(clients)}`);

      if (clients && clients.includes(socket.id)) {
        try {
          socket.emit("FE-error-user-exist", { error: false });
        //  console.log("Переходим в комнату");
          const newUser = { userId: socket.id, info: socketList[socket.id] };
       //    console.log(
      //       `Новый пользователь ${roomId}: ${JSON.stringify(newUser)}`
      //     );

          socket.broadcast.to(roomId).emit("FE-user-join", newUser);

       //   console.log(`Передан  FE-user-join событие в комнату ${roomId}`);
        } catch (e) {
       //   console.log(`Error occurred: ${e}`);
          io.sockets.in(roomId).emit("FE-error-user-exist", { error: true });
        }
      }
    } else {
//console.log(`No clients in room ${roomId}`);
    }
  });

  socket.on("BE-call-user", ({ userToCall, from, signal }) => {
    // console.log("signal call", signal);
    //console.log("BE-call-user", userToCall);
    io.to(userToCall).emit("FE-receive-call", {
      signal,
      from,
      info: socketList[socket.id],
    });
  });

  socket.on("BE-accept-call", ({ signal, to }) => {
   // console.log("signal accept", signal);
   // console.log("FE-call-accepted", to);
    io.to(to).emit("FE-call-accepted", {
      signal,
      answerId: socket.id,
    });
  });

  socket.on("BE-send-message", ({ roomId, msg, sender }) => {
    io.sockets.in(roomId).emit("FE-receive-message", { msg, sender });
  });

  socket.on("BE-leave-room", ({ roomId, leaver }) => {
    delete socketList[socket.id];
    //console.log(`Удалился из комнаты: ${roomId}`);
   // console.log(`socketList after user left: ${JSON.stringify(socketList)}`);
    socket.broadcast
      .to(roomId)
      .emit("FE-user-leave", { userId: socket.id, userName: [socket.id] });
    //console.log(io.sockets.sockets);
    socket.leave(roomId);
  });

  socket.on("BE-toggle-camera-audio", ({ roomId, switchTarget }) => {
    if (switchTarget === "video" && socketList[socket.id]) {
      socketList[socket.id].video = !socketList[socket.id].video;
    } else {
      socketList[socket.id].audio = !socketList[socket.id].audio;
    }
    socket.broadcast
      .to(roomId)
      .emit("FE-toggle-camera", { userId: socket.id, switchTarget });
  });

  socket.on("disconnect", () => {
   // console.log(`User disconnected: ${socket.id}`);
    delete socketList[socket.id];
  //  console.log(`socketList after user left: ${JSON.stringify(socketList)}`);
    socket.broadcast.emit("FE-user-leave", { userId: socket.id, userName: [socket.id] });
  });
});



module.exports = http;


