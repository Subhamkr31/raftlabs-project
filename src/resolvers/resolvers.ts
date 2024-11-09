
import { ApolloError } from 'apollo-server-errors';
import jwt from 'jsonwebtoken';
import { Server as SocketIOServer } from 'socket.io';
import { JWT_SECRET, User, Context, Room, Message,UserCredentials } from '../config/constant';
 

// Mock data store
const rooms: Map<string, Room> = new Map();
const messages: Map<string, Message[]> = new Map();
const users: Map<string, UserCredentials> = new Map();

// Define resolvers
export const resolvers =  (io: SocketIOServer) => ({
    Query: {
      rooms: (_parent: unknown, _args: unknown, { user }: Context) => {
        if (!user) throw new ApolloError('Not authenticated', 'UNAUTHORIZED');
        return Array.from(rooms.values());
      },
      messages: (_parent: unknown, { roomId }: { roomId: string }, { user }: Context) => {
        if (!user) throw new ApolloError('Not authenticated', 'UNAUTHORIZED');
        return messages.get(roomId) || [];
      },
    },
    Mutation: {
      login: (_parent: unknown, { username, password }: { username: string; password: string }) => {
      
        const existingUser = users.get(username);
        
        if (!existingUser) {
        
          users.set(username, { username, password });
          const user: User = { id: Date.now().toString(), username };
          const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
          return token;
        }
  
        // Existing user - verify password
        if (existingUser.password !== password) {
          throw new ApolloError('Invalid credentials', 'INVALID_CREDENTIALS', {
            details: 'Password is incorrect',
          });
        }
  
        const user: User = { id: Date.now().toString(), username };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
        return token;
      },
      joinRoom: (_parent: unknown, { roomId }: { roomId: string }, { user }: Context) => {
        if (!user) throw new ApolloError('Not authenticated', 'UNAUTHORIZED');
        
        let room = rooms.get(roomId);
        if (!room) {
          room = { id: roomId, name: `Room ${roomId}`, participants: [] };
          rooms.set(roomId, room);
        }
  
        const isParticipant = room.participants.some((p) => p.id === user.id);
        if (!isParticipant) {
          room.participants.push({ id: user.id, username: user.username });
        }
  
        return room;
      },
      leaveRoom: (_parent: unknown, { roomId }: { roomId: string }, { user }: Context) => {
        if (!user) throw new ApolloError('Not authenticated', 'UNAUTHORIZED');
  
        const room = rooms.get(roomId);
        if (!room) return true;
  
        room.participants = room.participants.filter((p) => p.id !== user.id);
        return true;
      },
      sendMessage: (_parent: unknown, { roomId, content }: { roomId: string; content: string }, { user }: Context) => {
        if (!user) throw new ApolloError('Not authenticated', 'UNAUTHORIZED');
        
        const room = rooms.get(roomId);
        if (!room) throw new ApolloError('Room not found', 'ROOM_NOT_FOUND');
  
        const message: Message = {
          id: Date.now().toString(),
          content,
          sender: { id: user.id, username: user.username },
          roomId,
        };
  
        if (!messages.has(roomId)) messages.set(roomId, []);
        messages.get(roomId)!.push(message);
  
        // Emit the message to all connected clients in the same room
        io.to(roomId).emit('newMessage', message);
  
        return message;
      },
    },
     
  });