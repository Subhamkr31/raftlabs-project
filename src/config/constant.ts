export const JWT_SECRET = 'task-manager-2';

export interface User {
  id: string;
  username: string;
}

export interface Context {
  user: User | null;
}

export interface Room {
  id: string;
  name: string;
  participants: User[];
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  roomId: string;
}

export interface UserCredentials {
    username: string;
    password: string;
  }
  