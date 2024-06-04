import { io } from 'socket.io-client';

let socket;

export const connectSocket = (url) => {
  socket = io(url);

  socket.on('connect', () => {
    console.log('Socket.IO connection established');
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket.IO disconnected:', reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const subscribeToEvent = (eventName, callback) => {
  if (!socket) return;
  socket.on(eventName, callback);
};

export const sendMessage = (eventName, data) => {
  if (!socket) return;
  socket.emit(eventName, data);
};
