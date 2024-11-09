import jwt from 'jsonwebtoken';

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'task_manager1', {
    expiresIn: '1h', // Token expiration time
  });
};

export const verifyToken = (token: string) => 
  jwt.verify(token, process.env.JWT_SECRET || 'task_manager1'); 