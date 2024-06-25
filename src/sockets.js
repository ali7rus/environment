import io from 'socket.io-client';

const socket = io('http://localhost:4000', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5
});
socket.on("connect_error", (error) => {
    console.log("Connection errors:", error);
  });

socket.on("connect", () => {
  console.log("Connected to servers");
});

socket.on('reconnect_attempt', () => {
  console.log('Attempting to reconnect...');
});

socket.on("receive_message", (message) => {
  console.log("Received message:", message);
});

socket.on("unread_count", (unreadCount) => {
  console.log("unread_count:", unreadCount);
});

socket.on("disconnect", () => {
  console.log("Disconnected from servers");
});

export default socket;