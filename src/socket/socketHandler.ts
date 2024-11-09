
import { Server as SocketIOServer } from 'socket.io';
import {  Message, } from '../config/constant';

 
export const initializeSocketIO =(io: SocketIOServer) =>{
   
// Handle incoming socket connections
io.on('connection', (socket) => {
    console.log('New socket connection', socket.id);
  
    // Listen for new messages from clients
    socket.on('sendMessage', (roomId: string, content: string) => {
      const message: Message = {
        id: Date.now().toString(),
        content,
        sender: { id: socket.id, username: 'Anonymous' },
        roomId,
      };
      
      // Broadcast the message to the room
      io.to(roomId).emit('newMessage', message);
    });
  
    // Join a room
    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
      io.to(roomId).emit('userJoined', { roomId });
    });
  
    // Leave a room
    socket.on('leaveRoom', (roomId: string) => {
      socket.leave(roomId);
      console.log(`Socket ${socket.id} left room ${roomId}`);
      io.to(roomId).emit('userLeft', { roomId });
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });
  
  }
  
// Then in your server setup:
//   const io = initializeSocketIO(httpServer);