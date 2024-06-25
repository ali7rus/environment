import io from 'socket.io-client';
const sockets = io('http://localhost:3001/', { autoConnect: true,});


sockets.on("connect", () => {
  //console.log("Connected to server");
});



sockets.on("disconnect", () => {
   // console.log("Disconnected from server");
  });

export default sockets;
